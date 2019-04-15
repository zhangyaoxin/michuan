<template>
  <div class="coupon_com">
    <van-field v-model="info.amount" type="number" label="优惠金额" placeholder="输入优惠金额" clearable v-if="info.type===1">
      <span slot="icon">元</span>
    </van-field>

    <van-field v-model="info.amount" type="number" label="折扣" placeholder="输入折扣值（0.01~9.99）" clearable v-if="info.type===2">
      <span slot="icon">折</span>
    </van-field>

    <van-field v-model="info.share_times" type="number" label="领券条件" placeholder="输入领券所需要传播奖励次数" clearable>
      <span slot="icon">次传播</span>
    </van-field>

    <van-field v-model="info.describe" label="用券条件" maxlength="14" placeholder="输入用券条件（默认消费立减）" clearable>
    </van-field>

    <div class="type_wrap">
      <div class="type_title van-hairline--bottom">用券方式</div>
      <div class="budget_content">
        <van-radio-group v-model="info.destroy_type">
          <van-radio class="van-hairline--bottom" :name="0">回收（使用后，优惠券立即消失）</van-radio>
          <van-radio class="van-hairline--bottom" :name="1">显示优惠码</van-radio>
          <van-radio class="van-hairline--bottom" :name="2">输入链接地址</van-radio>
        </van-radio-group>

        <van-field class="type_input" v-model="info.coupon_number" placeholder="输入优惠码" v-if="info.destroy_type==1">
        </van-field>

        <van-field class="type_input" style="top:166px;" v-model="info.coupon_link" placeholder="输入链接" v-if="info.destroy_type==2">
        </van-field>
      </div>
    </div>

    <van-field :value="info.expire_time|filterDate" label="有效期" readonly placeholder="选择有效期（默认三个月）" @click.native="isSelectTime =true">
    </van-field>

    <div class="btn" @click="confirmCoupon">完成</div>

    <!-- 选择时间 -->
    <van-popup v-model="isSelectTime" position="bottom">
      <van-datetime-picker v-model="currentDate" type="date" :min-date="minDate" @confirm="handleSelectTime" @cancel="isSelectTime=false" />
    </van-popup>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { validCoupon } from '@/assets/js/validate'
  export default {
    name: 'coupon_com',
    data () {
      return {
        curAdId: '',
        isAdd: true,

        // 设置有效期
        isSelectTime: false,
        minDate: new Date(),
        currentDate: new Date(),

        info: {
          type: 0,
          amount: '',
          share_times: '',
          describe: '',
          destroy_type: 0,
          coupon_number: '',
          coupon_link: '',
          expire_time: '',
        }
      }
    },
    filters: {
      filterDate (date) {
        return new Date(date * 1000).format('yyyy-MM-dd')
      }
    },
    computed: {
      ...mapGetters(['curCoupon'])
    },
    methods: {
      useTypeChange () { },

      handleSelectTime (time) {
        this.info.expire_time = new Date(time).getTime() / 1000
        this.isSelectTime = false
      },

      confirmCoupon () {
        const isAdd = this.isAdd
        const res = new validCoupon().validate(this.info)
        if (res) {
          this.$store.commit('changeCoupon', { isAdd, data: this.info })
          this.$router.replace({ path: 'create_ad', query: { ...this.$route.query, isEdit: true } })
        }
      }
    },
    created () {
      this.curAdId = this.$route.query.id
      this.isAdd = this.$route.query.type === 'add'
      if (!this.isAdd) {
        this.info = { ...this.curCoupon }
      } else {
        // 设置默认有效期 默认有效三个月
        let getFullYear = new Date().getFullYear()
        let getMonth = new Date().getMonth() + 4
        let getDate = new Date().getDate()

        if (getMonth > 12) {
          getFullYear++
          getMonth = getMonth % 12
        }
        this.info.expire_time = parseInt(new Date(getFullYear + '/' + getMonth + '/' + getDate).getTime() / 1000)
      }

      const type = this.$route.name === 'reduce' ? 1 : 2
      const infoType = this.info.type
      if (type !== infoType) {
        this.info.type = type
        this.info.amount = ''
      }
    }
  }
</script>

<style lang="scss">
  .coupon_com {
    padding: 0 0.8rem;
    height: 100%;
    background: #fff;

    .van-cell {
      padding: 0.8rem 0;
    }

    .van-cell:not(:last-child)::after {
      left: 0;
    }
    .van-hairline--bottom::after {
      border-color: #e8e8e8;
    }
    .van-field__clear,
    .van-field__right-icon {
      min-width: 50px;
    }
    .type_wrap {
      position: relative;
      left: -15px;
      padding: 0 0.8rem;
      width: 100%;
      background: rgb(244, 244, 244);
    }

    .type_title {
      padding: 15px 0;
    }
    .van-radio {
      padding: 15px 0;
    }
    .van-radio .van-icon-checked {
      color: #ff4c4c;
    }
    .type_input {
      position: absolute;
      top: 110px;
      right: 0;
      width: 245px;
      background: transparent;
    }

    .btn {
      margin-top: 50px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background-color: #ff4c4c;
      border-radius: 0.533333rem;
      color: #fff;
      font-size: 0.853333rem;
      letter-spacing: 0.266667rem;
    }
  }
</style>
