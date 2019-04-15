<template>
  <div class="me_recharge">
    <div class="home_tab_wrap">
      <van-tabs v-model="curTab" sticky>
        <van-tab title="在线充值">
          <van-field v-model="money" :value="money" type="text" label="充值金额" placeholder="请输入充值金额">
            <span slot="icon">元</span>
          </van-field>

          <van-field class="disabled" :value="money|filterBuyExchange('buy')" type="number" label="可得" placeholder="可获得蜂蜜数量" disabled>
            <span slot="icon">蜂蜜</span>
          </van-field>

          <div class="tip">温馨提示：当前汇率 <span class="col_ff4c">1</span> 元 = <span class="col_ff4c"> {{1|filterBuyExchange('buy')}}</span> 蜂蜜</div>

          <div class="type">
            <div class="line left"></div>
            <div class="line right"></div>
            <span>支付方式</span>
          </div>

          <van-radio-group v-model="type">
            <van-cell-group>
              <van-cell class="disabled" title="微信支付" clickable>
                <img class="wechat_icon" slot="icon" src="../../../assets/images/wechat.png" alt="">
                <van-radio slot="right-icon" name="1" />
              </van-cell>
            </van-cell-group>
          </van-radio-group>
          <div class="btn" :class="{'btn_hl':money!=0&&money.length}" @click="handleRecharge()">确认支付</div>
        </van-tab>

        <van-tab title="充值卡充值">
          <van-field v-model="card_no" type="number" placeholder="请输入充值卡卡号">
            <img class="recharge_icon" src="../../../assets/images/recharge_code.png" slot="left-icon" alt="">
          </van-field>

          <van-field v-model="card_pwd" type="number" placeholder="请输入充值卡密码">
            <img class="recharge_icon" src="../../../assets/images/recharge_pw.png" slot="left-icon" alt="">
          </van-field>

          <div class="btn" :class="{'btn_hl':card_no.length&&card_pwd.length}" style="margin-top:166px;" @click="handleRechargeCard">确认充值</div>
        </van-tab>
      </van-tabs>
    </div>
    <div>

    </div>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { browserVersions, isWechatrBrowse, setStore } from '@/utils/utils'
  export default {
    name: 'me_recharge',
    data () {
      return {
        curTab: 0,

        type: '1',
        money: '',

        curId: '',
        isShowTip: false,

        card_no: '',
        card_pwd: '',
      }
    },
    computed: {
      ...mapState({
        buyExchange: state => state.buyExchange,
        h5BaseUrl: state => state.h5BaseUrl
      })
    },

    methods: {
      handleRecharge (code = '') {
        const reg = /^[0-9]\d{0,9}(\.\d{1,2})?$/
        const amount = this.money
        if (amount == '') {
          this.$toast('请输入充值金额')
          return false
        } else if (!reg.test(amount) || amount == 0) {
          this.$toast('请输入正确的充值金额，只支持整数金额充值')
          return false
        }

        const params = {
          amount,
          trade_type: 'MWEB'
        }
        if (isWechatrBrowse()) {
          params.trade_type = 'JSAPI'
        }
        if (!browserVersions().mobile) {
          params.trade_type = 'NATIVE'
        }

        if (code) {
          params.trade_no = code
        }

        this.$toast.loading({
          mask: true,
          duration: 0,
          message: '处理中...'
        });
        console.log(params, '充值参数')
        this.$api.rechargeWx(params)
          .then(data => {
            if (data.status) {
              this.curId = data.data.order.id

              // 微信浏览器中
              if (isWechatrBrowse()) {
                this.onBridgeReady(data.data)
                return false
              }

              // h5中
              const url = encodeURIComponent(`http://h5.bvcio.com/#/account_recharge?id=${data.data.order.id}&isShowTip=true`)
              window.location.href = data.data.mweb_url + '&redirect_url=' + url

            } else {
              if (data.msg === '未绑定微信') {
                this.$dialog.confirm({
                  title: '温馨提示',
                  message: '您未绑定微信号，是否立即绑定微信账号？'
                }).then(() => {
                  setStore('isBind', 2)
                  this.$api.wechatLogin()
                }).catch(() => {
                  this.$toast('放弃绑定')
                });
              }
            }
          })
      },

      // JSAPI 回调
      onBridgeReady (info) {
        const that = this
        const time = parseInt(new Date().getTime() / 1000)
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            "appId": info.appId,
            "timeStamp": info.timestamp,
            "nonceStr": info.nonceStr,
            "package": info.package,
            "signType": info.signType,
            "paySign": info.paySign
          },
          function (res) {
            that.rechargeTip()
          });
      },

      rechargeTip () {
        this.$dialog.confirm({
          message: '请确认微信支付是否已完成',
          showCancelButton: true,
          confirmButtonText: '已完成',
          cancelButtonText: '重新支付'
        }).then(() => {
          this.$router.replace({ path: 'recharge_result', query: { id: this.curId } })
        }).catch(() => {
          this.$router.replace('account_recharge')
          this.againHandleOrder(this.curId)
        });
      },

      // 重新支付
      againHandleOrder (id) {
        this.$api.getOrderResult(4, id)
          .then(data => {
            if (data.status) {
              if (data.data.status == 1) {
                this.$router.replace({ path: 'recharge_result', query: { id: this.curId } })
                return false
              }
              this.money = data.data.amount
              this.handleRecharge(data.data.trade_code)
            }
          })
      },


      handleBindOtherLogin (code, type) {
        this.$store.dispatch('handleBindOtherLogin', { code, type })
          .then(data => {
            window.location.href = this.h5BaseUrl + '#/account_recharge'
            // this.$router.replace({ path: 'account_recharge', query: {} })
          })
      },

      // 充值卡充值
      handleRechargeCard () {
        const card_no = this.card_no
        const card_pwd = this.card_pwd
        if (!card_no) {
          this.$toast('请输入充值卡号码')
          return false
        }

        if (!card_pwd) {
          this.$toast('请输入充值卡密码')
          return false
        }
        const params = {
          card_no,
          card_pwd
        }
        this.$toast.loading({
          mask: true,
          duration: 0,
          message: '处理中...'
        });
        this.$api.rechargeCard(params)
          .then(data => {
            console.log('充值卡充值 ==>', data)
            if (data.status) {
              this.$toast.success('充值成功')
              this.$router.push('me_account')
            } else {
              this.$toast.fail('充值失败 - ' + data.msg)
            }
          })
      }
    },
    created () {
      const status = this.$route.query.status || 0
      this.curTab = status
      const code = this.$route.query.code
      const type = this.$route.query.type
      if (code && type) {
        this.handleBindOtherLogin(code, type)
      }
    },

    mounted () {
      this.curId = this.$route.query.id
      this.isShowTip = this.$route.query.isShowTip
      if (this.isShowTip) {
        this.rechargeTip()
      }
    }
  }
</script>

<style  lang="scss">
  @import "../../../assets/css/var.scss";
  .me_recharge {
    height: 100%;
    .van-icon-checked {
      color: #ff4c4c;
    }
    .van-cell {
      padding: 15px;
      align-items: center;
    }
    .van-tab--active {
      color: #ff4c4c;
    }
    .van-field__clear,
    .van-field__right-icon {
      min-width: 50px;
    }

    .disabled {
      background: #f4f4f4;
      .van-field__control {
        color: #ff4c4c;
      }
    }

    .tip {
      padding: 15px;
      background: #fff;
    }
    .col_ff4c {
      color: #ff4c4c;
    }

    .type {
      position: relative;
      margin: 30px 0 15px;
      text-align: center;
      font-size: 0.853333rem;
    }
    .line {
      position: absolute;
      top: 50%;
      margin-top: -1px;
      width: 70px;
      height: 2px;
      background: #e8e8e8;
    }
    .left {
      left: 70px;
    }
    .right {
      right: 70px;
    }
    .wechat_icon {
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }
    .btn {
      margin: 15px auto;
      width: 92%;
      height: 50px;
      text-align: center;
      line-height: 50px;
      border-radius: 4px;
      background: #ff9797;
      font-size: 0.96rem;
      letter-spacing: 2px;
      color: #fff;
    }
    .btn_hl {
      background: #ff4c4c;
    }
    .recharge_icon {
      margin-right: 20px;
      width: 37px;
      height: 37px;
    }
  }
</style>
