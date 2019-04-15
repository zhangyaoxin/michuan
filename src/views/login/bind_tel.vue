<template>
  <div class="login bind_tel">
    <div class="bind_tip">关联后您的微信账号和手机账号都可以登录</div>

    <div class="bind_main">
      <van-field v-model="tel" clearable placeholder="请输入您的手机号"></van-field>

      <van-field v-model="code" type="password" placeholder="请输入验证码">
        <div class="verify_btn" :class="{'btn_hl':isValidTel}" slot="button" @click="gitVerifyCode" v-if="!showReminderTime">获取验证码</div>
        <div class="verify_timer" slot="button" v-else>重新发送({{reminderTime}}s)</div>
      </van-field>

      <div class="login_btn" :class="{'btn_hl':isValidTel&&isValidCode}" @click="confirmHandle">确定</div>
    </div>

    <captcha-code :isCaptchaCode.sync="isCaptchaCode" :tel="tel" @changeCaptcha="isCaptchaCode=$event"></captcha-code>
  </div>
</template>

<script> 
  import captchaCode from '@@/captcha_code'

  import { mapState } from 'vuex'
  import { validate } from '@/assets/js/validate'
  import { getStore } from '@/utils/utils'

  export default {
    name: 'bind_tel',
    components: { captchaCode },
    data () {
      return {
        tel: '',
        code: '',

        otherLogin: null,

        isCaptchaCode: false
      }
    },
    computed: {
      ...mapState({
        showReminderTime: state => state.showReminderTime,
        reminderTime: state => state.reminderTime,
      }),
      isValidTel () {
        return validate({ tel: { val: this.tel } })
      },
      isValidCode () {
        return validate({ code: { val: this.code } })
      }
    },
    methods: {
      gitVerifyCode () {
        // this.$store.dispatch('gitVerifyCode', { phone: this.tel })
        const res = validate({ tel: { val: this.tel, isMsg: true } })
        if (res) {
          this.isCaptchaCode = true
        }
      },

      // 绑定手机号
      confirmHandle () {
        const res = validate({ tel: { val: this.tel, isMsg: true }, code: { val: this.code, isMsg: true } })
        console.log(res, this.otherLogin)
        if (!res && !this.otherLogin) return false
        const obj = {
          phone: this.tel,
          sms_code: this.code,
          auth_server: this.otherLogin.auth_server,
          credential_web_openid: this.otherLogin.credential_web_openid,
          credential_unionid: this.otherLogin.credential_unionid,
          nickname: this.otherLogin.nickname,
          headimgurl: this.otherLogin.headimgurl
        }
        console.log('绑定手机参数 ==>', obj)
        this.$api.register(obj)
          .then(data => {
            console.log('绑定手机号 ==>', data)
            if (data.status) {
              // 绑定成功 重新走登录接口
              this.$store.dispatch('login', this.otherLogin)
            } else {
              this.$toast(data.msg)
            }
          })
      }
    },
    created () {
      const otherLogin = JSON.parse(getStore('otherLogin'))
      this.otherLogin = otherLogin
      console.log('获取登录参数 ==>', otherLogin)
    }
  }
</script>

<style lang="scss">
  @import "../../assets/css/login";
  .bind_tip {
    font-size: 0.853333rem;
    font-weight: bold;
    color: #000;
  }
</style>
