<template>
  <div class="rewrad_com">
    <!-- 温馨提示： -->
    <div class="tip">可用余额 {{Number(active)}} 蜂蜜</div>

    <div class="rewrad_detail">
      <van-field v-model="preBvt" type="number" label="本次预算" placeholder="请输入本次发布预算" clearable>
        <span slot="icon">蜂蜜</span>
      </van-field>

      <!-- 普通 -->
      <div v-if="curType===1">
        <van-field v-model="browseBvt" type="number" label="浏览奖励" placeholder="请输入每人次浏览奖励" clearable>
          <span slot="icon">蜂蜜</span>
        </van-field>
        <van-field class="van-hairline--bottom" v-model="shareBvt" type="number" label="分享奖励" placeholder="请输入分享每人次奖励" clearable>
          <span slot="icon">蜂蜜</span>
        </van-field>
      </div>

      <!-- 拼手气 -->
      <div v-if="curType===2">
        <van-field class="van-hairline--bottom" v-model="bvtNum" type="number" label="红包个数" placeholder="请输入红包个数" clearable>
          <span slot="icon">个</span>
        </van-field>
      </div>

      <div class="btn" @click="confirmReward">完成</div>
    </div>
  </div>
</template>

<script>
  import { validReward } from '@/assets/js/validate'
  import { mapState } from 'vuex'

  export default {
    name: 'rewrad_com',
    components: {},
    data () {
      return {
        curType: 1,
        curAdId: '',

        preBvt: '',
        browseBvt: '',
        shareBvt: '',

        bvtNum: '',

        isConfirm: false
      }
    },
    computed: {
      ...mapState({
        active: state => state.account.account_active,
      })
    },
    methods: {
      // 获取账户信息
      getAccountInfo () {
        if (this.active) return false
        this.$store.dispatch('getUserAccInfo')
      },

      confirmReward () {
        if (Number(this.active) < Number(this.preBvt)) {
          this.$toast('可用金额不足')
          return false
        }

        let res
        if (this.curType === 1) {
          res = validReward({ preBvt: this.preBvt, browseBvt: this.browseBvt, shareBvt: this.shareBvt })
          if (!res) return false
          this.$store.commit('changeAd', { type: 'browseBvt', val: this.browseBvt })
          this.$store.commit('changeAd', { type: 'shareBvt', val: this.shareBvt })
        } else {
          if (Number(this.preBvt) / Number(this.bvtNum) < 0.1) {
            this.$toast('预算奖励过低')
            return false
          }
          res = validReward({ preBvt: this.preBvt, bvtNum: this.bvtNum })
          if (!res) return false
          this.$store.commit('changeAd', { type: 'bvtNum', val: this.bvtNum })
        }
        if (res) {
          this.$store.commit('changeAd', { type: 'preBvt', val: this.preBvt })
          this.$store.commit('changeAd', { type: 'left_bvt', val: this.preBvt })
          this.isConfirm = true
          this.$router.replace({ path: 'create_ad', query: { ...this.$route.query, isEdit: true } })
        }
      }
    },

    created () {
      this.getAccountInfo()
      this.curAdId = this.$route.query.id
      this.curType = this.$route.name === 'reward' ? 1 : 2
      this.preBvt = this.$store.state.ad.left_bvt || this.$store.state.ad.preBvt
      if (this.curType === 1) {
        this.browseBvt = this.$store.state.ad.browseBvt
        this.shareBvt = this.$store.state.ad.shareBvt
      } else {
        this.bvtNum = this.$store.state.ad.bvtNum
      }
    },

    beforeRouteLeave (to, from, next) {
      if (!this.isConfirm) {
        this.$store.commit('delAdReward')
      }
      if (this.preBvt && !this.isConfirm) {
        this.$dialog.confirm({
          message: '退出后将不会保存你的填写，是否确认退出？'
        }).then(() => {
          next()
        }).catch(() => {
          next(false)
        });
      } else {
        console.log(2134)
        next()
      }
    }
  }
</script>
<style lang="scss">
  .rewrad_com {
    height: 100%;
    background: #fff;

    .tip {
      position: relative;
      // padding: 15px 15px 15px 38px;
      padding: 15px;
      background: #fffee0;
    }
    // .tip::before {
    //   content: "";
    //   display: block;
    //   position: absolute;
    //   top: 18px;
    //   left: 15px;
    //   width: 16px;
    //   height: 16px;
    //   background: url("../../assets/images/tip.png");
    //   background-size: 16px;
    // }

    .rewrad_detail {
      padding: 0 0.8rem;
    }
    .van-cell {
      padding: 0.8rem 0;
    }

    .van-cell:not(:last-child)::after {
      left: 0;
    }

    .van-field__clear,
    .van-field__right-icon {
      min-width: 40px;
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
