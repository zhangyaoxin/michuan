<template>
  <div class="account_withraw">
    <div class="header">
      <div class="use_title">
        <span>可提现金额(元)</span>
        <!-- <van-icon class="active_tip" name="question-o" @click="activeTip" /> -->
      </div>
      <div class="use_num">{{active|filterBuyExchange('sell')}}</div>
      <!-- <div class="user_mic">折合 {{Number(active)}} 蜂蜜，购物可抵 {{Number(active*10).toFixed("1")}} 元</div> -->
      <div class="exchange">当前汇率 1 元 = {{1|filterSellExchange('sell')}} 蜂蜜</div>
    </div>

    <div class="field">
      <van-field class="user_info" label="提现到微信钱包" readonly>
        <div class="wx_avatar" slot="icon" v-if="ishidden">
          <img class="user_avatar" :src="info.headimgurl" alt="">
          <span class="user_nickname">{{info.nickname}}</span>
        </div>
        <div class="wx_avatar" slot="icon" v-else >
          <router-link to="account_security" class="user_msg">
            <p>去绑定</p>
          </router-link>
        </div>
      </van-field>
      <van-field class="disabled" v-model="money" type="number" label="提现金额(元)" placeholder="请输入提现金额">
        <span slot="icon" class="all_btn" @click="allBtn">全部</span>
      </van-field>
    </div>

    <div class="tip">
      <p>温馨提示：</p>
      <p>1.只支持整数金额提现</p>
      <p>2.每天最多提现3次，每次最低1元，最高100元</p>
      <p>3.可提现时间为7:00至23:00</p>
    </div>

    <div class="btn" @click="handleWithdraw">确认提现</div>

  </div>

</template>

<script>
  import { mapState } from 'vuex'
  import { getStore, setStore } from '@/utils/utils'
  let Base64 = require('js-base64').Base64
  export default {
    name: 'me_withdraw',

    data () {
      return {
        money: '',

        isBindWx: false,

        info: {},

        user: {},

        ishidden: false
      }
    },
    computed: {
      ...mapState({
        active: state => state.account.account_active,
        sellExchange: state => state.sellExchange,
        buyExchange: state => state.buyExchange,
        userInfo: state => state.userInfo
      }),

      curRMB () {
        return this.active * this.sellExchange
      }
    },

    methods: {
      // 获取账户信息
      getAccountInfo () {
        if (this.active) return false
        this.$store.dispatch('getUserAccInfo')
      },

      // 用户账户绑定情况
      getUserBindDetail () {
        this.$api.getUserBindDetail()
          .then(data => {
            console.log(data)
            if (data.status) {
              this.isBindWx = !!data.data.user_login.find(it => it.auth_server === 1 && it.credential_web_openid)
              this.user = data.data.user_login
              for(let i=0; i< this.user.length; i++) {
                if(this.user[i].auth_server === 1 && this.user[i].nickname !== '' && this.user[i].headimgurl !== '') {
                  this.ishidden = true
                  this.info = this.user[i]
                  // this.info.nickname = Base64.decode(this.info.nickname)
                }
              }
              
              setStore('isBind', 3)
              if (this.isBindWx) {
                setStore('isBindWx', 1)
              } else {
                setStore('isBindWx', 2)
              }
              // setTimeout(() => {
              //   this.$api.wechatLogin()
              // }, 0);

            } else {
              this.$toast(data.msg)
            }
          })
      },

      activeTip () {
        this.$dialog.alert({
          title: '提现规则说明',
          message: `1. 可提现金额=总资产-发布冻结金额-新用户话购卡余额<br/>
                    2. 发布冻结金额=“我的发布”中已上架内容的预算余额之和<br/>
                    3. 新用户话购卡余额=新用户话购卡面额-通话和购物抵扣蜂蜜之和，余额小于0的按0计算`
        }).then(() => {
          // on close
        });
      },

      // 全部提现
      allBtn () {
        const active = String(this.curRMB)
        this.money = active.includes('.') ? active.split('.')[0] : active
      },

      handleWithdraw () {
        const reg = /^[1-9]\d*$/;
        let amount = this.money
        if (amount == '') {
          this.$toast('请输入提现金额')
          return false
        } else if (!reg.test(amount)) {
          this.$toast('只支持整数金额提现')
          return false
        } else if (Number(amount) > 50) {
          this.$toast('可提现金额不能超过50元')
          return false
        } else if (Number(amount) > Number(this.curRMB)) {
          this.$toast('可提现金额不足')
          return false
        }

        // 提现提示
        // this.$dialog.confirm({
        //   title: '是否提现',
        //   message: `<p>确认提现 ${amount} 元 </p><p> 淘商城购物可抵 ${amount / this.sellExchange * 10} 元</p>`,
        //   confirmButtonText: '去淘商城',
        //   cancelButtonText: '确定'
        // }).then(() => {
        //   this.$router.push('mall_index')
        // }).catch(() => {
        this.$toast.loading({
          mask: true,
          duration: 0,
          message: '处理中...'
        });
        this.$api.withdrawWx({ amount })
          .then(data => {
            console.log('提现金额 ==>', data)
            if (data.status) {
              this.$toast.success('提现成功')
              setTimeout(() => {
                this.$router.push('me_account')
              }, 2000);
            } else {
              if (data.response_code == 10404) {
                this.$dialog.confirm({
                  title: '温馨提示',
                  message: '您未绑定微信号，是否立即绑定微信账号？'
                }).then(() => {
                  setStore('isBind', 3)
                  setTimeout(() => {
                    this.$api.wechatLogin()
                  }, 0);

                }).catch(() => {
                  this.$toast('放弃绑定')
                });
              }
              this.$toast.fail(data.msg)
            }
          })
        // });
      },

      handleBindOtherLogin (code, type) {
        const isBindWx = getStore('isBindWx') || '2'
        this.$store.dispatch('handleBindOtherLogin', { code, type, isBindWx: Number(isBindWx) === 1 })
          .then(data => {
            if (data) {
              this.info = data
              setStore('isBindWx', 2)
              setStore('isBind', 0)
              this.$router.replace('account_withdraw')
            }
          })

        // })
      },
    },
    created () {
      this.getAccountInfo()
      const code = this.$route.query.code
      const type = this.$route.query.type
      if (code && type) {
        this.handleBindOtherLogin(code, type)
      } else {
        this.getUserBindDetail()
      }
    }
  }
</script>

<style lang="scss">
  .account_withraw {
    .header {
      padding-top: 0.533333rem;
      height: 8.413333rem;
      box-sizing: border-box;
      background: linear-gradient(90deg, #ff7d46 0%, #ff4b4b 100%),
        linear-gradient(#ff4c4c, #ff4c4c);
      color: #fff;
      font-size: 0.64rem;
      text-align: center;
    }

    .van-field__clear,
    .van-field__right-icon {
      min-width: 50px;
    }

    .user_info {
      .van-field__clear,
      .van-field__right-icon {
        min-width: 170px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .use_title {
      color: rgba(255, 255, 255, 0.6);
      margin-top: 20px;
    }
    .use_num {
      margin-top: 10px;
      font-size: 1.76rem;
    }
    .user_mic {
      margin: 7px;
      font-size: 0.853333rem;
      color: rgba(255, 255, 255, 0.8);
    }
    .exchange {
      margin: 10px auto;
      padding: 0.106667rem;
      width: 44%;
      border-radius: 20px;
      color: rgba($color: #fff, $alpha: 0.8);
      background: rgba(255, 66, 58, 0.6);
    }
    .van-cell {
      padding: 15px;
    }
    .user_info {
      .van-cell {
        padding: 10px 15px;
      }
    }
    .user_avatar {
      margin-right: 5px;
      width: 35px;
      height: 35px;
      border-radius: 100%;
    }
    .user_nickname {
      position: relative;
      top: 6px;
      color: #888;
    }

    .van-field .van-cell__title {
      max-width: 110px;
    }

    .all_btn {
      color: #ff4c4c;
    }

    .tip {
      margin-top: 15px;
      padding: 15px;
      font-size: 13px;
      color: #666;
    }
    .btn {
      margin: 15px auto;
      width: 92%;
      height: 50px;
      text-align: center;
      line-height: 50px;
      border-radius: 4px;
      background: #ff4c4c;
      font-size: 0.96rem;
      letter-spacing: 2px;
      color: #fff;
    }

    .active_tip {
      position: relative;
      top: 3px;
      font-size: 14px;
    }
  }
</style>
