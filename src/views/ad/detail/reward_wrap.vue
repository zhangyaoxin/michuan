<template>
  <div class="reward_md">
    <van-circle class="reward_circle" v-model="currentRate" :speed=" time ? '20':'100' " size="2.56rem" color="#ff4c4c" layer-color="#f4f4f4" :stroke-width="60">
      <!-- -->
      <img class="reward_bg" :class="{'reward_animation':isRewarding&&stopRewarding}" src="../../../assets/images/reward_bg.png" alt="">
    </van-circle>

    <transition name="reward">
      <div class="reward_money_wrap" v-if="isRewardMd">
        <div class="reward_money_icon">
          <img src="../../../assets/images/reward_icon.png" alt="">
        </div>
        <div class="reward_money_title"> <span>浏览获得</span>
          <span class="reward_money_num">{{browseReward}}</span>
          <span>蜂蜜</span></div>
      </div>
    </transition>

    <transition name="reward">
      <div class="reward_money_wrap shareMc" :class="{'share_animation':isShareing}" v-if="isShareMd">
        <span class="reward_money_title" @click="isShareTip=true">分享领红包</span>
      </div>
    </transition>

    <!-- 分享提示 -->
    <van-popup v-model="isShareTip" position="top" :close-on-click-overlay="false" class="share_tip_wrap">
      <img style="width:291px; margin: auto;margin-top:10px;display: block;" src="../../../assets/images/share_tip_title.png" alt="">
      <img style="display: block;width:99px;margin:40px auto;" src="../../../assets/images/share_tip_btn.png" alt="" @click="isShareTip=false">
    </van-popup>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { isWechatrBrowse, getStore, setStore } from '@/utils/utils'
  export default {
    name: 'reward_md',
    props: {
      isGetAward: Boolean
    },
    data () {
      return {
        curAdId: '',
        curShareUserId: '',

        isRewarding: false,
        stopRewarding: false,
        isRewardMd: false,

        currentRate: 0,

        browseReward: 0,
        timer: null,
        count: 0,

        isShareTip: false,
        isShareing: false,
        isShareMd: false,

        isWechatrBrowse: false,
        time: true,
      }
    },
    computed: {
      ...mapState({
        isLogin: state => state.isLogin
      }),
    },
    watch: {
      isRewardMd (n) {
        if (n) {
          setTimeout(() => {
            this.isRewardMd = false
          }, 2000);
        }
      },

      isShareMd (n) {
        if (n) {
          setInterval(() => {
            this.isShareing = true
          }, 4000);
        }
      },

      isShareing (n) {
        if (n) {
          setTimeout(() => {
            this.isShareing = false
          }, 1000);
        }
      },

      isRewarding (n) {
        this.stopRewarding = n
      },

      stopRewarding (n) {
        if (n) {
          setTimeout(() => {
            this.stopRewarding = !n
          }, 1000);
        } else {
          setTimeout(() => {
            this.stopRewarding = !n
          }, 2000);
        }
      }
    },
    methods: {
      // 获取广告奖励
      getAdReward () {
        const id = this.curAdId
        const share_id = this.curShareUserId
        this.$api.getAdReward({ id, share_id })
          .then(data => {
            console.log('获取广告奖励 ==>', data)
            if (data.status) {
              this.getAdRewardValue(id)
            } else {
              this.isRewarding = false
            }
          })
      },

      // 查询广告奖励值
      getAdRewardValue (id) {
        console.log(this.count, 'this.count')
        if (this.count > 12) {
          this.isRewarding = false
          return false
        }
        this.$api.getAdRewardValue({ adv_id: id })
          .then(data => {
            console.log('查询广告奖励值 ==>', data)
            if (!data.status) {
              this.count++
              this.timer = setTimeout(() => {
                this.getAdRewardValue(id)
              }, 3000)
            } else {
              if (data.response_code === 200) {
                this.browseReward = Number(data.data)
                this.isRewardMd = true
                this.isShareMd = true
              }
              this.isRewarding = false
            }
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
          if (!this.isGetAward) {
            this.$toast('您已经获取过奖励了')
            this.isRewarding = false
            return false
          }
          this.getAdReward()
        }
      }, 5000)
    },
    beforeDestroy () {
      clearTimeout(this.timer)
    }
  }
</script>

<style lang="scss">
  /* 奖励浮窗 */
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

    .reward_num {
      line-height: 3.2rem;
      font-size: 1.066667rem;
      color: #ff4c4c;
    }

    @keyframes rewardBg {
      0% {
        transform: translate(-50%, -50%) rotate(0);
      }

      25% {
        transform: translate(-50%, -50%) rotate(20deg);
      }

      50% {
        transform: translate(-50%, -50%) rotate(0);
      }

      75% {
        transform: translate(-50%, -50%) rotate(-20deg);
      }

      100% {
        transform: translate(-50%, -50%) rotate(0deg);
      }
    }

    .reward_money_wrap {
      display: flex;
      align-items: center;
      position: fixed;
      left: 50%;
      bottom: 10rem;
      padding-right: 0.693333rem;
      height: 2.346667rem;
      transform: translateX(-50%);
      background: #ff4c4c;
      background-size: 2.266667rem;
      border-radius: 0.533333rem;
    }

    .reward_money_icon {
      width: 2.266667rem;
      height: 2.24rem;
      margin-left: 0.16rem;
      margin-top: -0.3rem;
    }

    .reward_money_icon img {
      width: 100%;
    }

    .reward_money_title {
      flex: 1;
      margin-left: 0.666667rem;
      font-size: 0.853333rem;
      color: #fff;
      white-space: nowrap;
    }

    .reward_money_num {
      color: #ffee72;
    }

    .reward-enter {
      bottom: 4.333333rem;
      right: -10rem;
      transform: scale(0.01) translateX(-50%);
      opacity: 0;
    }

    .reward-enter-active {
      transition: all 0.5s ease;
    }

    .reward-leave-active {
      transition: all 1s ease;
    }

    .reward-leave-to {
      opacity: 0;
    }

    .reward_money_wrap.shareMc {
      left: 77%;
      bottom: 3.8rem;
      height: 1.1rem;
      line-height: 15px;
      border-radius: 3.533333rem;
      transform: none;
    }
    .reward_money_wrap.shareMc .reward_money_title {
      font-size: 0.64rem;
    }

    .share_animation {
      animation: shareBg 1s ease-in-out infinite;
    }

    @keyframes shareBg {
      0% {
        transform: scale(1);
      }

      25% {
        transform: scale(1.3);
      }

      50% {
        transform: scale(1.1);
      }

      75% {
        transform: scale(1.3);
      }

      100% {
        transform: scale(1);
      }
    }

    .share_tip_wrap {
      background: transparent;
    }
    .van-modal {
      background-color: rgba(0, 0, 0, 0.8);
    }
  }
</style>
