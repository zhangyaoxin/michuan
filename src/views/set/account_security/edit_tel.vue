<template>
  <div class="login edit_tel">
    <div class="change_main">
      <van-field v-model="tel" clearable placeholder="请输入您的手机号"></van-field>

      <van-field v-model="code" type="password" placeholder="请输入验证码">
        <div class="verify_btn" :class="{'btn_hl':isValidTel}" slot="button" @click="gitVerifyCode" v-if="!showReminderTime">获取验证码</div>
        <div class="verify_timer" slot="button" v-else>重新发送({{reminderTime}}s)</div>
      </van-field>

      <div class="login_btn" :class="{'btn_hl':isValidTel&&isValidCode}" @click="confirmEditTel">确认更换</div>
    </div>
    <captcha-code :isCaptchaCode.sync="isCaptchaCode" :tel="tel" @changeCaptcha="isCaptchaCode=$event"></captcha-code>
  </div>
</template>

<script>
  import captchaCode from '@@/captcha_code'
  import { mapState } from 'vuex'
  import { validate } from '@/assets/js/validate'
  import { setStore, getStore } from '@/utils/utils'
  export default {
    name: 'edit_tel',
    components: {
      captchaCode
    },
    data () {
      return {
        tel: '',
        code: '',
        isCaptchaCode: false,
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

      confirmEditTel () {
        const res = validate({ tel: { val: this.tel, isMsg: true }, code: { val: this.code, isMsg: true } })
        if (!res) return false
        const params = {
          new_phone: this.tel,
          sms_code: this.code
        }

        const result = this.$store.dispatch('editUserInfo', params)
        if (result) {
          this.$store.dispatch('SignOut')
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "../../../assets/css/login";
</style>
