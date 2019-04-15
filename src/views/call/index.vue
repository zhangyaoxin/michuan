<template>
  <div class="call_wrap">
    <div>
      <van-field ref="content" class="call_phone" v-model="curTel" readonly v-if="curTel" @click="isShowDialpadMd=!isShowDialpadMd" />
    </div>

    <div class="records_wrap">
      <records ref="records" @changePhone="editPhone" :curPhone="curTel"></records>
    </div>

    <dialpad :curPhone="curTel" @changePhone="curTel=$event" @addCallRecords="editCallRecords" @handleCall="handleCall"></dialpad>

    <!-- <div class="hidde_op" v-if="!isShowDialpad">
      <div class="op_item" @click="isShowDialpad=true">拨号键盘</div>
      <div class="op_call" @click="handleCall"><i class="iconfont">&#xe60f;</i></div>
      <div class="op_item">
        <router-link :to="{path:'account_detail',query:{type:12}}">话费明细</router-link>
      </div>
    </div> -->

    <!-- 通话中弹窗 -->
    <van-popup class="calling_wrap" v-model="isShowCallingMd">

      <div class="calling_name">未知</div>
      <div class="calling_num">{{curTel}} 正在拨号...</div>
      <div class="calling_tip">您将收到一个专线来电 接听即可通话</div>

      <div class="calling_btn" @click="isShowCallingMd=false">
        <i class="iconfont">&#xe744;</i>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import dialpad from './components/dialpad'
  import records from './components/records'
  import { mapState } from 'vuex'
  export default {
    name: 'call_wrap',
    components: { dialpad, records },
    data () {
      return {
        curTel: '',

        isShowCallingMd: false,
      }
    },

    computed: {
      ...mapState({
        isLogin: state => state.isLogin,
        balance: state => parseInt(state.account.account_active),
      }),
      isShowDialpadMd: {
        get () {
          return this.$store.state.isShowDialpadMd
        },
        set (val) {
          this.$store.commit('changeValue', { type: 'isShowDialpadMd', value: val })
        }
      },
    },
    watch: {
      isShowCallingMd (n) {
        if (n) {
          this.timer = setTimeout(() => {
            this.isShowCallingMd = false
          }, 10000);
        }
      }
    },
    methods: {
      editPhone (num) {
        this.isShowDialpadMd = false
        this.curTel = num
        this.handleCall()
      },

      editCallRecords () {
        this.$refs.records.addRecord()
      },

      handleCall () {
        if (!this.isLogin) {
          this.$router.push('login')
          return false
        }
        const callnumber = this.curTel
        if (!callnumber) {
          this.$toast('请输入手机号！')
          return false
        }

        if (!this.balance) {
          this.$dialog.confirm({
            title: '余额不足',
            message: '账户余额不足，是否去充值？',
            confirmButtonText: '去充值'
          }).then(() => {
            this.$router.push('account_recharge')
          }).catch(() => { });
          return false
        }

        this.$api.confirmCall({ callnumber })
          .then(data => {
            if (data.status) {
              this.editCallRecords()
              this.isShowCallingMd = true
            } else {
              if (data.response_code === 10700) {
                this.$toast('您所拨打的电话号码是空号！')
              } else {
                this.$toast(data.msg)
              }
            }
          })
      },
    },
    beforeDestroy () {
      clearTimeout(this.timer)
    }
  }
</script>

<style lang="scss">
  .call_wrap {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin-bottom: 50px;
    background: #fff;

    .van-field__control {
      font-size: 36px;
      text-align: center;
    }

    .records_wrap {
      flex: 1;
      overflow: scroll;
    }
    .hidde_op {
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: fixed;
      bottom: 50px;
      padding: 10px 15px;
      width: 100%;
      box-sizing: border-box;
      div {
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.22);
      }
    }
    .op_call {
      width: 60px;
      height: 60px;
      line-height: 60px;
      border-radius: 65px;
      i {
        margin-top: -2px;
        margin-left: -2px;
        font-size: 40px;
        color: #4cd964;
      }
    }
    .op_item {
      width: 100px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 32px;
      background: #fff;
    }

    .calling_wrap {
      width: 100%;
      height: 100%;
      background: url("../../assets/images/calling_bg.png");
      background-size: cover;
      text-align: center;
      color: #fff;
      z-index: 2012 !important;
      overflow: hidden;
      .calling_name {
        padding-top: 100px;
        font-size: 30px;
      }
      .calling_num {
        padding: 15px;
        font-size: 12px;
      }
      .calling_tip {
        font-size: 15px;
      }

      .calling_btn {
        position: absolute;
        bottom: 62px;
        left: 50%;
        margin-left: -55px;
        width: 110px;
        height: 40px;
        line-height: 40px;
        border-radius: 40px;
        background: #ff4c4c;

        i {
          // position: relative;
          // top: -3px;
          // left: -3px;
          font-size: 28px;
          color: #fff;
        }
      }

      .calling_btn:active {
        background: #d44343;
      }
    }
  }
</style>
