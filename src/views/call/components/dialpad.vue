<template>
  <div>
    <van-popup class="dialpad_wrap" v-model="show" position="bottom" :lock-scroll="false" :overlay="false">
      <div class="header">
        <div class="duration" v-if="!isLogin">
          <!-- <span>未登录,</span> -->
          <router-link to="login">立即登陆</router-link>
        </div>
        <div class="duration" v-else>可通话时长 <span>{{balance||0}}</span> 分钟</div>
        <div class="exchange">(资费:1蜂蜜/分钟)</div>
        <div class="rule" @click="isShowRuleMd =true">规则</div>
      </div>
      <div class="main">
        <div class="item" v-for="(item,index) in list" :key="index" @click="handleClick($event,item.num)">
          <div class="item_num">{{item.num}}</div>
          <div class="item_str" v-if="index===0">
            <img style="width: 18px; margin-top: 6px;" src="../../../assets/images/num1_icon.png" alt="">
          </div>
          <div class="item_str" v-else>{{item.str}}</div>
        </div>

        <div class="item ops" @click="copy">粘贴</div>
        <div class="item ops call_btn" @click="handleCall">
          <div class="call_btn_bg">
            <i class="iconfont">&#xe744;</i>
          </div>
        </div>
        <div class="item ops" @click="del">
          <i class="iconfont ops_del">&#xe627;</i>
        </div>
      </div>
    </van-popup>

    <!-- 规则弹窗 -->
    <van-popup class="dialpad_rule_wrap" v-model="isShowRuleMd" overlay-class="rule_md">
      <div>1. VIP账户中的蜂蜜都可以用于通话。</div>
      <div>2. 通话资费为每分钟1蜂蜜，不足1分钟的按1分钟计算</div>
      <div>3. 蜜传采用回拨方式通话，呼叫对方号码后，您将收到一个专线来电，接听即可通话</div>
      <div>4. 拨打本地固定电话时需要加区号。暂不支持400电话和特殊号码，例如110、120等</div>
      <div class="rule_btn" @click="isShowRuleMd =false">确定</div>
    </van-popup>

    <!-- 粘贴提示弹窗 -->
    <van-popup class="dialpad_rule_wrap" v-model="isShowPasteMd">
      <div>您的浏览器不支持主动粘贴功能，如需粘贴，请手动长按下面输入框，并选择粘贴</div>
      <div style="margin-top:10px;">
        <van-field v-model="pasteData" />
      </div>
      <div class="rule_btn" @click="confirmPaste(pasteData)">完成</div>
    </van-popup>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { setStore } from '@/utils/utils'
  export default {
    name: 'dialpad_wrap',
    props: {
      isShowDialpad: Boolean,
      curPhone: String
    },
    data () {
      return {
        show: true,
        list: [
          {
            num: '1',
            str: '∞'
          },
          {
            num: '2',
            str: 'ABC'
          }, {
            num: '3',
            str: 'DEF'
          }, {
            num: '4',
            str: 'GHI'
          }, {
            num: '5',
            str: 'JKL'
          }, {
            num: '6',
            str: 'MNO'
          }, {
            num: '7',
            str: 'PQRS'
          }, {
            num: '8',
            str: 'TUV'
          }, {
            num: '9',
            str: 'WXYZ'
          }, {
            num: '*',
            str: '(P)'
          }, {
            num: '0',
            str: '+'
          }, {
            num: '#',
            str: '(w)'
          }
        ],

        phone: [],
        userInfo: {},

        curRange: null,


        isShowRuleMd: false,

        pasteData: '',
        isShowPasteMd: false,

        timer: null
      }
    },
    computed: {
      ...mapState({
        balance: state => parseInt(state.account.account_cashgift),
        isLogin: state => state.isLogin,
        isShowDialpadMd: state => state.isShowDialpadMd
      }),
    },

    watch: {
      phone (n) {
        this.$emit('changePhone', n.join(''))
      },
      curPhone (n) {
        this.phone = n.split('')
      },
    },
    methods: {
      // 获取用户信息
      async getUserInfo () {
        const { data } = await this.$store.dispatch('getUserInfo')
        console.log(data)
        this.userInfo = data
        setStore('userInfo', data)
      },

      // 获取账户信息
      getAccountInfo () {
        if (this.balance) return false
        this.$store.dispatch('getUserAccInfo')
      },

      handleClick (e, num) {
        this.phone.push(num)
      },

      copy (e) {
        const cilp = window.navigator.clipboard
        if (!cilp) {
          this.isShowPasteMd = true
          return false
        }
        console.log(cilp)
        cilp.readText()
          .then(data => {
            const reg = /^[0-9]\d*$/
            if (!reg.test(data)) {
              this.$toast('请粘贴手机号码')
              return false
            }
            this.phone.push(...data.split(''))
          })
      },

      confirmPaste (num) {
        console.log(num)
        const reg = /^[0-9]\d*$/
        if (num && !reg.test(num)) {
          this.$toast('请粘贴手机号码')
          return false
        }
        this.phone = num.split('')
        this.isShowPasteMd = false
      },

      handleCall () {
        this.$emit('handleCall')
      },

      del () {
        this.phone.pop()
      },

    },
    created () {
      if (this.isLogin) {
        // this.getUserInfo()
        setTimeout(() => {
          this.getAccountInfo()
        }, 1000);
      }
    },
    mounted () {
      window.addEventListener('paste', (e) => {
        e.preventDefault();
        let text = e.clipboardData.getData("text/plain");
        const num = text.replace(/-/g, '')
        this.pasteData = num
      })
    },

  }
</script>

<style lang="scss">
  .dialpad_wrap {
    position: relative;
    padding: 15px;
    padding-bottom: 0;
    box-sizing: border-box;
    background: #f4f4f4;

    .header {
      text-align: center;
      line-height: 0.96rem;
      font-size: 0.64rem;
      color: #999;
    }
    .duration {
      font-size: 0.853333rem;
      color: #666;
    }
    .rule {
      position: absolute;
      right: 0;
      height: 24px;
      line-height: 24px;
      text-align: center;
      width: 40px;
      top: 22px;
      border-radius: 12px 0 0 12px;
      background: #d5d5d5;
    }

    .main {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin: auto;
      margin-top: 10px;
      width: 82%;
    }

    .item {
      // border: 1px solid #000;
      padding-top: 9px;
      width: 33.33%;
      height: 60px;
      text-align: center;
      box-sizing: border-box;
      font-size: 12px;
      line-height: 24px;
    }
    .item_num {
      font-size: 32px;
      color: #000;
    }

    .item:not(.ops):active {
      background: #ccc;
      border-radius: 10px;
    }

    .call_btn_bg:active {
      background: #3ba94e;
    }

    .item_str {
      color: #666;
    }

    .ops {
      color: #666;
      font-size: 16px;
    }

    .ops_del {
      font-size: 36px;
      color: #666;
    }

    .call_btn_bg {
      margin-top: -7px;
      margin-left: -7px;
      width: 110px;
      height: 40px;
      line-height: 40px;
      border-radius: 40px;
      background: #4cd964;
    }
    .call_btn i {
      font-size: 28px;
      color: #fff;
    }
  }

  .rule_md {
    background: rgba(0, 0, 0, 0.4);
    z-index: 200005 !important;
  }
  .dialpad_rule_wrap {
    padding: 30px;
    width: 250px;
    background-color: #fff;
    border-radius: 10px;
    color: #333;
    z-index: 200006 !important;
    .rule_btn {
      margin: auto;
      margin-top: 20px;
      width: 250px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      border-radius: 36px;
      background: #ff4c4c;
      color: #fff;
    }
  }
</style>
