<template>
  <div class="account_security">
    <van-cell-group class="cell_group">
      <!-- to="edit_tel" -->
      <van-cell title="手机" is-link>
        <div class="list_icon" slot="icon">
          <img src="../../../assets/images/mobil_icon.png" alt="">
        </div>
        <div>{{info.phone|filterTel}}</div>
      </van-cell>

      <div v-if="filterLoginType(1) === '去绑定'">
        <van-cell title="微信" is-link @click="handleOtherLogin(auth1,1)">
          <div class="list_icon" slot="icon">
            <img src="../../../assets/images/wechat_hl_icon.png" alt="">
          </div>
          <div :class="{'no_bind':auth1}">{{filterLoginType(1)}}</div>
        </van-cell>
      </div>

      <!-- <van-cell title="QQ" is-link @click="handleOtherLogin(auth2,2)">
        <div class="list_icon" slot="icon">
          <img src="../../../assets/images/qq_hl_icon.png" alt="">
        </div>
        <div :class="{'no_bind':auth2}">{{filterLoginType(2)}}</div>
      </van-cell>

      <van-cell title="微博" is-link @click="handleOtherLogin(auth3,3)">
        <div class="list_icon" slot="icon">
          <img src="../../../assets/images/weibo_hl_icon.png" alt="">
        </div>
        <div :class="{'no_bind':auth3}">{{filterLoginType(3)}}</div>
      </van-cell> -->
    </van-cell-group>

    <van-cell-group class="cell_group">
      <van-cell title="登录密码" is-link :to="jumpRoute">
        <div class="list_icon" slot="icon">
          <img src="../../../assets/images/key_icon.png" alt="">
        </div>
        <div :class="{'no_bind':auth4}">{{filterLoginType(4)}}</div>
      </van-cell>
    </van-cell-group>

  </div>
</template>

<script>
  import { setStore } from '@/utils/utils'
import dialpadVue from '../../call/components/dialpad.vue';
  export default {
    name: 'account_security',
    components: {},
    data () {
      return {
        info: {
          user_login: []
        },

        auth1: true,
        auth2: true,
        auth3: true,
        auth4: true,
        show: true
      }
    },
    filters: {
      filterTel (tel) {
        const before = String(tel).slice(0, 3)
        const after = String(tel).slice(-4, 11)
        return before + '****' + after
      },  
    },
    computed: {
      jumpRoute () {
        if (!this.auth4) {
          return { path: 'edit_pw', query: { tel: this.info.phone } }
        } else {
          return { path: 'set_pw' }
        }

      }
    },
    methods: {
      filterLoginType (type) {
        const arr = this.info.user_login
        if (!arr.find(it => it.auth_server === type)) {
          this['auth' + type] = true
          if (type === 4) return '去设置'
          return '去绑定'

        } else {
          if (type === 1 && !arr.find(it => it.credential_unionid)) {
            this['auth' + type] = true
            return '去绑定'
          } 
          else {
            this['auth' + type] = false
            if (type === 4) return '去修改'
            return '解除绑定'
          }
        }
      },

      // 用户账户绑定情况
      getUserBindDetail () {
        this.$api.getUserBindDetail()
          .then(data => {
            if (data.status) {
              this.info = data.data
            } else {
              this.$toast(data.msg)
            }
          })
      },

      handleOtherLogin (isToBind, type) {
        if (isToBind) {
          setStore('isBind', 1)
          this.bindOtherLogin(type)
        } else {
          // this.unbindOtherLogin(type)
        }
      },

      // 绑定
      bindOtherLogin (type) {
        switch (Number(type)) {
          case 1:
            this.$api.wechatLogin()
            break;
          case 2:
            this.$api.qqLogin()
            break;
          case 3:
            this.$api.weiboLogin()
            break;
          default:
            break;
        }
      },

      handleBindOtherLogin (code, type) {
        this.$store.dispatch('handleBindOtherLogin', { code, type })
          .then(data => {
            if (data) {
              console.log(data, 'ppppppppppppppppsdddddghgh')
              this.getUserBindDetail()
              this.$router.replace('account_security')
            }
          })
      },

      // 解绑
      unbindOtherLogin (type) {
        this.$api.unbindOtherLogin({ auth_server: type })
          .then(data => {
            console.log('解绑 ==>', data)
            if (data.status) {
              this.getUserBindDetail()
              this.$toast.success('解绑成功')
            } else {
              this.$toast.fail('解绑失败')
            }
          })
      }
    },
    created () {
      const code = this.$route.query.code
      const type = this.$route.query.type
      if (code && type) {
        this.handleBindOtherLogin(code, type)
      }
      this.getUserBindDetail()

    }
  }
</script>

<style  lang="scss">
  @import "../../../assets/css/var";
  .account_security {
    .cell_group {
      margin-top: 0.533333rem;
    }
    .van-cell {
      font-size: 0.8rem;
      color: #000;
    }
    .van-cell__value {
      color: #999;
    }

    .list_icon {
      margin-right: 0.8rem;
      width: 1.173333rem;
      height: 1.173333rem;
    }
    .list_icon img {
      width: 100%;
    }
    .no_bind {
      color: $mc_color;
    }
  }
</style>
