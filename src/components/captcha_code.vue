<template>
  <div class="captcha_code">
    <div id="captcha"></div>
  </div>
</template>

<script>
  export default {
    name: 'captcha_code',
    props: {
      tel: String,
      isCaptchaCode: Boolean
    },
    data () {
      return {
        captchaIns: null,
      }
    },
    watch: {
      isCaptchaCode (n) {
        if (n) {
          this.init()
        }
      }
    },
    methods: {
      init () {
        const that = this
        initNECaptcha({
          captchaId: 'ec14483c8ad6449b8ee031080054081d',
          element: '#captcha',
          mode: 'popup',
          width: 300,
          onReady: function (instance) { },
          onVerify: function (err, data) {
            if (data) {
              that.$store.dispatch('gitVerifyCode', { phone: that.tel, slide_r: data.validate })
            }
          },
          onClose: function () {
            that.$emit('changeCaptcha', false)
          }
        }, function onload (instance) {
          instance.popUp()
        }, function onerror (err) { })
      }
    }
  }
</script>

<style lang="scss"> 
</style>
