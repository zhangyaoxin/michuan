<template>
  <div class="login edit_pw">
    <div class="change_pw_tip">您已绑定手机号{{curTel}}, 请点击“获取验证码”,</div>

    <div class="login_main">
      <van-field v-model="code" type="password" placeholder="请输入验证码">
        <div class="verify_btn btn_hl" slot="button" @click="gitVerifyCode" v-if="!showReminderTime">获取验证码</div>
        <div class="verify_timer" slot="button" v-else>重新发送({{reminderTime}}s)</div>
      </van-field>

      <van-field v-model="pw" :type="isHiddenPw?'password':'text'" placeholder="请输入6-20位密码" @click-icon="isHiddenPw=!isHiddenPw">
        <img class="pw_icon" slot="icon" :src="isHiddenPw?eyeIcon:eyeIconHl" alt="">
      </van-field>

      <van-field v-model="againPw" :type="isHiddenPwAgain?'password':'text'" placeholder="请再输一次" @click-icon="isHiddenPwAgain=!isHiddenPwAgain">
        <img class="pw_icon" slot="icon" :src="isHiddenPwAgain?eyeIcon:eyeIconHl" alt="">
      </van-field>

      <div class="login_btn" :class="{'btn_hl':isValidPw&&isValidAgainPw&&isValidCode}" @click="confirmEditPw">确定修改</div>
    </div>

    <captcha-code :isCaptchaCode.sync="isCaptchaCode" :tel="tel" @changeCaptcha="isCaptchaCode=$event"></captcha-code>
  </div>
</template>

<script>
  import eyeIcon from '@/assets/images/eye_icon.png'
  import eyeIconHl from '@/assets/images/eye_icon_hl.png'

  import captchaCode from '@@/captcha_code'

  import { mapState } from 'vuex'
  import { getStore, setStore } from '@/utils/utils'
  import { validate } from '@/assets/js/validate'
  export default {
    name: 'edit_tel',
    components: {
      captchaCode
    },
    data () {
      return {
        eyeIcon,
        eyeIconHl,

        isHiddenPw: true,
        isHiddenPwAgain: true,
        curTel: '',
        tel: '',
        code: '',
        pw: '',
        againPw: '',

        isCaptchaCode: false,
      }
    },
    computed: {
      ...mapState({
        showReminderTime: state => state.showReminderTime,
        reminderTime: state => state.reminderTime,
      }),

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
      gitVerifyCode () {
        // this.$store.dispatch('gitVerifyCode', { phone: this.tel }) 
        const res = validate({ tel: { val: this.tel, isMsg: true } })
        if (res) {
          this.isCaptchaCode = true
        }
      },

      confirmEditPw () {
        const res = validate({ code: { val: this.code, isMsg: true }, pw: { val: this.againPw, oldPw: this.pw, isMsg: true } })
        if (!res) return false
        const params = { new_password: md5(this.pw), sms_code: this.code }
        const result = this.$store.dispatch('editUserInfo', params)
        if (result) {
          this.$router.go(-1)
        }
      }
    },
    created () {
      const phone = this.$route.query.tel
      console.log(phone)
      const befor = phone.slice(0, 3)
      const after = phone.slice(-4, 11)
      this.tel = phone
      this.curTel = befor + '****' + after
      console.log(befor, after)
    }
  }
</script>

<style lang="scss">
  @import "../../../assets/css/login";

  .login.edit_pw {
    background: #fff;
    height: 100%;

    .login_main {
      margin-top: 2.666667rem;
    }

    .change_pw_tip {
      position: absolute;
      left: 0;
      top: 0;
      box-sizing: border-box;
      background: #f4f4f4;
      padding-left: 0.8rem;
      height: 3.36rem;
      line-height: 3.36rem;
      color: #999;
      font-size: 0.746667rem;
      width: 100%;
    }
  }
</style>
