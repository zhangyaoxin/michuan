<template>
  <div class="login set_pw">
    <van-field v-model="pw" :type="isHiddenPw?'password':'text'" label="密码" placeholder="请输入6-20位密码" @click-icon="isHiddenPw=!isHiddenPw">
      <img class="pw_icon" slot="icon" :src="isHiddenPw?eyeIcon:eyeIconHl" alt="">
    </van-field>

    <van-field v-model="againPw" :type="isHiddenPwAgain?'password':'text'" label="确认密码" placeholder="请再输一次" @click-icon="isHiddenPwAgain=!isHiddenPwAgain">
      <img class="pw_icon" slot="icon" :src="isHiddenPwAgain?eyeIcon:eyeIconHl" alt="">
    </van-field>

    <div class="set_pw_tip">设置密码后您可以使用“密码登录”</div>

    <div class="login_btn" :class="{'btn_hl':isValidPw&&isValidAgainPw}" @click="confirmSetPw">设置</div>

  </div>
</template>

<script>
  import eyeIcon from '@/assets/images/eye_icon.png'
  import eyeIconHl from '@/assets/images/eye_icon_hl.png'

  import { validate } from '@/assets/js/validate'
  import md5 from 'md5'
  export default {
    name: 'set_pw',
    components: {},
    data () {
      return {
        eyeIcon,
        eyeIconHl,

        isHiddenPw: true,
        isHiddenPwAgain: true,

        pw: '',
        againPw: '',
      }
    },
    computed: {
      isValidPw () {
        return validate({ pw: { val: this.pw } })
      },

      isValidAgainPw () {
        return validate({ pw: { val: this.againPw, oldPw: this.pw } })
      }
    },
    methods: {
      confirmSetPw () {
        const res = validate({ pw: { val: this.againPw, oldPw: this.pw, isMsg: true } })
        if (!res) return false
        const params = { new_password: md5(this.pw) }
        const result = this.$store.dispatch('editUserInfo', params)
        if (result) {
          this.$router.go(-1)
        }
      },
    }
  }
</script>

<style lang="scss">
  @import "../../../assets/css/login";
  .set_pw {
    .set_pw_tip {
      margin: 0.906667rem 0 0;
      text-align: center;
      color: #999;
      font-size: 0.746667rem;
    }

    .login_btn {
      margin-top: 0.266667rem;
    }
  }
</style>
