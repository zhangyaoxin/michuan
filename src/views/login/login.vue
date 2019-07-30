<template>
  <div class="login">
    <div class="login_type">
      <div class="login_title">{{isPwLogin?'密码登录':'快捷登录'}}</div>
      <div class="login_sub_title" @click="isPwLogin=!isPwLogin">{{isPwLogin?'快捷登录':'密码登录'}}</div>
    </div>

    <div class="login_main">
      <van-field v-model="tel" placeholder="请输入您的手机号"></van-field>

      <!-- 账号密码 -->
      <div v-if="isPwLogin">
        <van-field v-model="pw" :type="isHiddenPw?'password':'text'" placeholder="请输入密码" @click-icon="isHiddenPw=!isHiddenPw">
          <img class="pw_icon" slot="icon" :src="isHiddenPw?eyeIcon:eyeIconHl" alt="">
        </van-field>
        <div class="forget_pw_btn" @click="$router.push('valid_tel')">忘记密码</div>
      </div>

      <!-- 快捷登录 -->
      <div v-else>
        <van-field v-model="code" type="password" placeholder="请输入验证码">
          <div class="verify_btn" :class="{'btn_hl':isValidTel}" slot="button" @click="gitVerifyCode" v-if="!showReminderTime">获取验证码</div>
          <div class="verify_timer" slot="button" v-else>重新发送({{reminderTime}}s)</div>
        </van-field>
        <p></p>
      </div>

      <div class="login_btn" :class="{'btn_hl':isLoginHl}" @click="confirmLogin()">登录</div>
    </div>

    <!-- 第三方登录 -->
    <div class="login_other" v-if="isWechatrBrowse">
      <div class="other_title">
        <div class="line"></div>
        <div>其他登陆</div>
        <div class="line"></div>
      </div>
      <div class="other_list">
        <div class="other_item" @click="otherLogin('wechatLogin')">
          <img src="../../assets/images/wechat_icon.png" alt="">
        </div>

        <!-- <div class="other_item" @click="otherLogin('qqLogin')">
          <img src="../../assets/images/qq_icon.png" alt="">
        </div> -->
        <!-- weiboLogin -->
        <!-- <div class="other_item" @click="otherLogin('weiboLogin')">
          <img src="../../assets/images/weibo_icon.png" alt="">
        </div> -->
      </div>
    </div>

    <!-- 蜜传服务协议 -->
    <div class="login_tip">
      <p>未注册用户登录后自动注册 </p>
      <p>登录即代表同意<span @click="$router.push('mc_protocol')">《蜜传服务协议》</span></p>
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
  import { isWechatrBrowse, browserVersions, getStore, setStore } from '@/utils/utils'
  import { validate } from '@/assets/js/validate'
  export default {
    name: 'login',
    components: { captchaCode },
    data () {
      return {
        eyeIcon,
        eyeIconHl,

        isPwLogin: false,
        isHiddenPw: true,
        isWechatrBrowse: false,

        tel: '',
        pw: '',
        code: '',

        user: {},
        // 三方授权参数
        // 唯一授权id
        credential: '',

        loginLocation: '未知',

        isCaptchaCode: false
      }
    },
    computed: {
      ...mapState({
        showReminderTime: state => state.showReminderTime,
        reminderTime: state => state.reminderTime,
        isLogin: state => state.isLogin,
      }),
      isValidTel () {
        return validate({ tel: { val: this.tel } })
      },
      isValidPw () {
        return validate({ pw: { val: this.pw } })
      },
      isValidCode () {
        return validate({ code: { val: this.code } })
      },

      isLoginHl () {
        if (this.isPwLogin) {
          return this.isValidTel && this.isValidPw
        } else {
          return this.isValidTel && this.isValidCode
        }
      }
    },
    methods: {
      // 获取验证码
      gitVerifyCode () {
        const res = validate({ tel: { val: this.tel, isMsg: true } })
        if (res) {
          this.isCaptchaCode = true
        }
        // this.$store.dispatch('gitVerifyCode', { phone: this.tel })
      },

      // 获取用户地理位置
      getUserLocation () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
        } else {
          console.log('该浏览器不支持获取地理位置。')
        }
      },
      showPosition (pos) {
        console.log(pos, 'pospospospospospos')
        this.$api.getUserLocation(pos.coords.latitude, pos.coords.longitude)
          .then(data => {
            if (data.status) {
              const city = data.location.address_component.city
              this.loginLocation = city
              setStore('loginLocation', city)
            } else {
              this.loginLocation = '南京'
            }
          })
      },
      showError () {
        this.loginLocation = '南京'
      },

      // 确认登录
      confirmLogin ({ openid, unionid, nickname,headimgurl, uesrInfo } = {}, type) {

        const login_platform = browserVersions().mobile || browserVersions().iPad ? 2 : 3


        console.log(openid, uesrInfo, type, nickname, headimgurl, 'ppppppppp')
        let auth_server = this.isPwLogin ? 4 : 5
        if (openid) { auth_server = type }

        let obj = {
          auth_server,
          login_platform,
          login_location: '南京',
          nickname,
          headimgurl,
        }

        if (auth_server === 4 || auth_server === 5) {
          if (this.isPwLogin) {
            // 账户密码登录
            const res = validate({ tel: { val: this.tel, isMsg: true }, pw: { val: this.pw, isMsg: true } })
            if (!res) return false
            obj.phone = this.tel
            obj.credential_pwd = md5(this.pw)
          } else {
            // 快捷登录
            const res = validate({ tel: { val: this.tel, isMsg: true }, code: { val: this.code, isMsg: true } })
            if (!res) return false
            obj.phone = this.tel
            obj.sms_code = this.code
          }
        } else {
          if (!openid) return false
          obj.credential_web_openid = openid
          obj.credential_unionid = unionid
        }
        console.log('登录参数 ==>', obj)
        this.$store.dispatch('login', obj)
      },

      // 微信登录 
      wechatLogin (code) {
        const platform = browserVersions().mobile || browserVersions().iPad ? 2 : 3
        console.log(platform)
        const params = {
          login_platform: platform,
          login_location: '南京',
        }
        this.$api.wechat(params, code)
        .then(data => {
          console.log(data)
          if(data.status) {
            setStore('token', data.data.token, 'localStorage')
            this.$toast('登录成功')
            let fromPath = getStore('fromPath')
            let routePath = {
              path: '/',
              query: {}
            }
            if (fromPath) {
              routePath = JSON.parse(fromPath)
            }
            // if (routePath.path !== 'me') {
            //   const { data } = this.$store.dispatch('getUserInfo')
            //   setStore('userInfo', data)
            // }
            console.log(routePath)
            this.$store.commit('changeAd', {type: 'isLogin',value: true})
           
            this.$router.replace(routePath)
            
          }
        })
      },
      // 第三方登录
      otherLogin (type) {
        const path = getStore('fromPath') && JSON.parse(getStore('fromPath'))
        console.log(path, 'oopopop')
        if (path) {
          path.isOther = true
        }
        setStore('fromPath', path)
        this.$nextTick(() => {
          // this.$api[type]()
          this.$api[type]().then(data => {
             this.user = data
             console.log(this.user)
             obj.nickname = this.user.nickname
             obj.headimgurl = this.user.headimgurl
          })  
        })
      },

      // 第三方登录回调
      otherLoginCallBack (code, type) {
        const otherType = type === 'wechat' ? 1
          : type === 'qq' ? 2
            : type === 'wb' ? 3
              : ''
        // 绑定
        const isBind = getStore('isBind')
        const curAdId = getStore('curAdId')
        console.log(curAdId, 'abc')
        if (isBind === '1') {
          this.$router.replace({ path: 'account_security', query: { code, type } })
          setStore('isBind', 0)
          return false
        } else if (isBind === '2') {
          this.$router.replace({ path: 'account_recharge', query: { code, type } })
          setStore('isBind', 0)
          return false
        } else if (isBind === '3') {
          this.$router.replace({ path: 'transfer_page', query: { code, type, page: 'account_withdraw' } })
          setStore('isBind', 0)
          return false
        } else if (isBind === '4') {
          this.$router.replace({ path: 'ad_details', query: { id: curAdId } })
          setStore('isBind', 0)
          return false
        }

        this.wechatLogin(code)
        // 登录
        // this.$api.otherLoginCallBack(type, code)
        //   .then(data => {
        //     console.log(code)
        //     this.wechatLogin(code)
        //   })
      },

    },
    created () {
      const isBind = getStore('isBind')
      const loginLocation = getStore('loginLocation')
      if (!loginLocation && isBind == '0') {
        this.getUserLocation()
      } else {
        this.loginLocation = loginLocation
      }

      const formatUrl = window.location.search.split('?').pop().split('&')
      let arr = []
      for (let it of formatUrl) {
        arr.push(it.split('='))
      }
      const map = new Map(arr)
      const value = decodeURIComponent(map.get('label'))
      const loginType = map.get('state') || this.$route.query.state
      const code = map.get('code') || this.$route.query.code
      console.log(loginType, code)
      if (loginType) {
        this.otherLoginCallBack(code, loginType)
      }

      // 是否是微信浏览器
      this.isWechatrBrowse = isWechatrBrowse()
    }
  }
</script>


<style lang="scss">
  @import "../../assets/css/login";
</style>
