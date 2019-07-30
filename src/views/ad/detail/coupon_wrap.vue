<template>
  <div class="reward_md">
    <van-circle class="reward_circle" v-model="currentRate" :speed=" time ? '20':'100' " size="2.56rem" color="#ff4c4c" layer-color="#f4f4f4" :stroke-width="60">
      <!-- -->
      <img class="reward_bg" :class="{'reward_animation':isRewarding&&stopRewarding}" src="../../../assets/images/reward_bg.png" alt="">
    </van-circle>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { isWechatrBrowse, getStore, setStore } from '@/utils/utils'
export default {
  data () {
    return {
      curAdId: '',
      curShareUserId: '',
      currentRate: 0,
      isRewarding: false,
      sstopRewarding: false,
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.isLogin
    }),
  },
  methods: {
    getCoupon () {
      const params = {
        adID: this.curAdId,
        sharerID: this.curShareUserId
      }
      this.$api.getDeatailsCoupon(params,this.curAdId,this.curShareUserId)
      .then(data => {
        console.log(data)
      })
    }
  },
  created () {
     this.curAdId = this.$route.query.id
     this.curShareUserId = this.$route.query.share_id
     // 是否是微信浏览器
     this.isWechatrBrowse = isWechatrBrowse()
   },
   mounted () {
     let FromRoute = getStore('FromRoute')
     let from = JSON.parse(FromRoute)
     if(from.path === "login") {
       this.time = false
       console.log(this.time,'djsahfjhfjahjjds')
     }
     this.timer = setTimeout(() => {
       this.isShareMd = true
       this.isRewarding = true
       if (!this.isLogin) {
         this.$dialog.confirm({
           message: '您还未登陆，登录后获得奖励红包',
           showCancelButton: true,
           confirmButtonText: this.isWechatrBrowse ? '微信登录' : '立即登录'
         }).then(() => {
           if (this.isWechatrBrowse) {
             const path = {
               path: 'ad_details',
               query: {
                 id: this.curAdId
               }
             }
             setStore('fromPath', path)
             this.$nextTick(() => {
               this.$api.wechatLogin()
             })
           } else {
             this.$router.push('login')
           }
         }).catch(() => {
           this.isRewarding = false
         });
       } else {
         this.getCoupon()
       }
     }, 5000)
   },
   beforeDestroy () {
     clearTimeout(this.timer)
   }
}
</script>

<style lang="scss">
  .reward_md {
    position: fixed;
    bottom: 5.333333rem;
    right: 0.8rem;
    width: 2.986667rem;
    height: 2.986667rem;
    border-radius: 100%;
    background: #fff;
    box-shadow: 0 0 0.533333rem 0 rgba(255, 76, 76, 0.2);

    .reward_circle {
      margin: 0.186667rem !important;
      z-index: 999;
    }

    .reward_bg {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 1.226667rem;
      height: 1.546667rem;
      transform: translate(-50%, -50%);
    }

    .reward_bg.reward_animation {
      animation: rewardBg 0.1s ease-in-out infinite;
    }

  }
</style>


