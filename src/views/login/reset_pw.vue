<template>
  <div class="login">
    <div v-if="$route.name==='valid_tel'">
      <van-field v-model="tel" type="tel" placeholder="请填写手机号码"></van-field>
      <div class="login_btn" :class="{'btn_hl':isValidTel}" @click="validTel">下一步</div>
    </div>

    <div v-if="$route.name==='reset_pw'">
      <van-field v-model="code" placeholder="请输入验证码">
        <div class="verify_btn" :class="{'btn_hl':isValidTel}" slot="button" @click="gitVerifyCode" v-if="!showReminderTime">获取验证码</div>
        <div class="verify_timer" slot="button" v-else>重新发送({{reminderTime}}s)</div>
      </van-field>

      <van-field v-model="pw" :type="isHiddenPw?'password':'text'" placeholder="请输入6到14位新密码" @click-icon="isHiddenPw=!isHiddenPw">
        <img class="pw_icon" slot="icon" :src="isHiddenPw?eyeIcon:eyeIconHl" alt="">
      </van-field>

      <van-field v-model="againPw" :type="isHiddenPwAgain?'password':'text'" placeholder="请输入再次确认新密码" @click-icon="isHiddenPwAgain=!isHiddenPwAgain">
        <img class="pw_icon" slot="icon" :src="isHiddenPwAgain?eyeIcon:eyeIconHl" alt="">
      </van-field>

      <div class="login_btn" :class="{'btn_hl':isValidTel&&isValidPw&&isValidAgainPw&&isValidCode}" @click="confirmReset">重置</div>
    </div>
    <captcha-code :isCaptchaCode.sync="isCaptchaCode" :tel="tel" @changeCaptcha="isCaptchaCode=$event"></captcha-code>
  </div>
</template>

<script> 
  import eyeIcon from '@/assets/images/eye_icon.png'
  import eyeIconHl from '@/assets/images/eye_icon_hl.png'
  import md5 from 'md5'

  import captchaCode from '@@/captcha_code'

  import { mapState } from 'vuex'
  import { validate } from '@/assets/js/validate'

  export default {
    name: 'reset_pw',
    components: { captchaCode, },
    data () {
      return {
        eyeIcon,
        eyeIconHl,

        tel: '',
        pw: '',
        againPw: '',
        code: '',

        isCaptchaCode: false,

        isHiddenPw: true,
        isHiddenPwAgain: true,
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
      isValidPw () {
        return validate({ pw: { val: this.pw } })
      },
      isValidAgainPw () {
        return validate({ pw: { val: this.againPw, oldPw: this.pw } })
      },
      isValidCode () {
        return validate({ code: { val: this.code } })
      },
    },
    methods: {
      // 验证手机号接口
      validTel () {
        const res = validate({ tel: { val: this.tel, isMsg: true } })
        console.log('验证手机号')
        if (!res) return false

        // this.$router.push({ path: 'reset_pw', query: { tel: this.tel } })
        this.$api.isRegisterTel(this.tel)
          .then(data => {
            console.log('验证手机号是否注册 ==>', data)
            if (data.status) {
              this.$router.push({ path: 'reset_pw', query: { tel: this.tel } })
              this.gitVerifyCode()
            } else {
              this.$toast(data.msg)
            }
          })
      },

      // 发送验证码
      gitVerifyCode () {
        this.isCaptchaCode = true  
      },

      // 忘记密码 重置密码
      confirmReset () {
        const res = validate({ tel: { val: this.tel, isMsg: true }, code: { val: this.code, isMsg: true }, pw: { val: this.pw, isMsg: true }, pw: { val: this.againPw, oldPw: this.pw, isMsg: true } })
        console.log(res)
        if (!res) return false
        this.$api.forgetPw({
          phone: this.tel,
          code: this.code,
          new_password: md5(this.pw),
          confirm_new_password: md5(this.againPw)
        })
          .then(data => {
            console.log('提交新密码 ==>', data)
            if (data.status) {
              this.$router.push('login')
            } else {
              this.$toast(data.msg)
            }
          })
      }
    },
    created () {
      this.tel = this.$route.query.tel
    }
  }
</script>

<style lang="scss">
  @import "../../assets/css/login";
  .login {
    .invite_input {
      padding: 0 0.8rem;
      width: 100%;
      height: 2.133333rem;
      box-sizing: border-box;
      text-align: center;
      border: 0.053333rem solid #e8e8e8;
      border-radius: 1.066667rem;
      font-size: 0.8rem;
    }
    .confirm_btn {
      margin-top: 0.853333rem;
      height: 2.133333rem;
      line-height: 2.133333rem;
      text-align: center;
      border-radius: 1.066667rem;
      background: $mc_color_dark;
      font-size: 0.96rem;
      color: #fff;
      letter-spacing: 0.1rem;
    }
  }
</style>

