<template>
  <div class="ad_details">
    <!-- 广告基本信息 -->
    <div class="view_header">
      <div class="ad_title" style="-webkit-box-orient: vertical;-moz-box-orient: vertical;box-orient: vertical;">{{info.title||'无题'}}</div>
      <div class="ad_title sub_title" style="-webkit-box-orient: vertical;-moz-box-orient: vertical;box-orient: vertical;">{{info.sub_title||'暂无摘要'}}</div>

      <div class="ad_info">
        <div class="put_time">{{info.created_at}}</div>
        <div class="put_browse">
          <span>浏览</span>
          <span>{{info.total_browse_count}}</span>
        </div>
        <div class="put_share">
          <span>分享</span>
          <span>{{info.total_share_count}}</span>
        </div>
      </div>

      <!-- 发布用户 -->
      <div class="put_user_wrap">
        <router-link class="put_user_info" :to="{path:'me_index',query:{id:info.user_id}}" v-if="info.merchant == null">
          <div class="user_avatar">
            <img :src="info.writer.thumbnail|filterImg('avatar')" alt="">
          </div>
          <div class="user_nickname">{{info.writer.nickname}}</div>
          <img style="width: 24px; height:24px;  position: absolute; right: 0; top: 1px;" src="./../../../assets/images/arrow.png" alt="">
        </router-link>
        <a :href="'http://h5.bvcio.com/mc_b/shop.html?shopId='+info.merchant.hashID" class="put_user_info" v-else>
          <div class="user_avatar">
            <img :src="info.merchant.logo" alt="">
          </div>
          <div class="user_nickname">{{info.merchant.title}}</div>
          <img style="width: 24px; height:24px;  position: absolute; right: 0; top: 1px;" src="./../../../assets/images/arrow.png" alt="">
        </a>

          <!-- <div class="user_level">Lv1</div>

          <div class="user_badge">
            <img src="https://via.placeholder.com/19x23/ff4b4b" alt="">
          </div>
          <div class="user_badge">
            <img src="https://via.placeholder.com/19x23/ff4b4b" alt="">
          </div> -->

        <!-- 别人的广告 -->
        <!-- <router-link :to="{path:'me_index',query:{id:info.user_id}}" class="user_attent" v-if="userId!=info.user_id">
          <div>Ta的主页</div>
        </router-link> -->
         <!-- <router-link :to="{path:'me_index',query:{id:info.user_id}}" class="user_attent">
          <div><img style="width: 24px; height:24px" src="./../../../assets/images/arrow.png" alt=""></div>
        </router-link> -->

        <!-- 自己的广告 -->
        <!-- <div class="user_attent" @click="underShelf(info.id)" v-if="userId==info.user_id">
          <div>下架编辑</div>
        </div> -->
      </div>
    </div>

    <!-- 广告封面 -->
    <div class="ad_cover van-hairline--top" v-if="info.thumbnail.url">
      <img :src="info.thumbnail.url|filterImg" alt="">
    </div>

    <!-- 优惠券 -->
    <card-coupon :info="info"></card-coupon>

     <!-- 倒计时 -->
    <div v-if="info.start_time" style="margin-top: 12px;background: #fff; padding: 10px 0; border-bottom: 1px solid #e8e8e8;">
       <countDown
            :start_time="Number(info.start_time)"
            :end_time="Number(info.end_time)" 
            :tipText="'—— 距离活动开始还有 ——'" 
            :tipTextEnd="'—— 距离活动结束还有 ——'"
            :endText="'活动已结束'"
            :dayTxt="'天'"
            :hourTxt="'时'"
            :minutesTxt="'分'"
            :secondsTxt="'秒'"
          ></countDown>
    </div>

    <!-- 广告详情 -->
    <div class="ad_detail" v-if="info.content">
      <div class="content" v-html="info.content"></div>
    </div>

    <!-- 传播明细 我的影响力 -->
    <browse-user-list :title="userId==info.user_id?'传播明细':'我的影响力'" api="getMyInfluenceList" :curAdId="curAdId"></browse-user-list>

    <!-- 用券明细 -->
    <browse-user-list title="用券明细" api="getMyCouponList" :curAdId="curAdId" v-if="userId==info.user_id&&info.coupon.length"></browse-user-list>

    <!-- 蜜传二维码 -->
    <!-- <div class="qr_code_wrap">
      <img src="../../../assets/images/me_about.png" alt="">
    </div> -->

    <!-- 奖励浮窗 -->
    <reward-wrap :isGetAward="isGetAward" v-if="Number(info.pre_bvt)"></reward-wrap>

    <!-- 底部悬浮框 -->
    <!-- <float-box></float-box> -->

    <!-- 播放音频 -->
    <div v-if="info.bgm">
      <span id="musicControl">
        <a id="mc_play" class="on" :class="isMusic ? 'off' : ''" @click="play_music()">
          <audio muted id="music" ref='audio' autoplay="autoplay" preload loop>
            <source :src="'http://res.michuan.online/' + info.bgm" type="audio/ogg">
          </audio>
        </a>
      </span>
    </div>


    <!-- 拨打电话 -->
    <div v-if="info.phone" class="ad_phone">
      <a :href="'tel:' + info.phone">
        <img src="./../../../assets/images/tel.png" alt="">
      </a>
    </div>

    <div class="text">本页面由蜜传提供技术支持</div>
  </div>
</template>

<script>
  import countDown from './countdown'
  import browseUserList from './user_list'
  import cardCoupon from './card_coupon'
  import rewardWrap from './reward_wrap'
  import floatBox from './bottom_float_box'
  import wx from 'wx'
  let Base64 = require('js-base64').Base64
  import { mapState } from 'vuex'
  import { browserVersions, getStore, setStore } from '@/utils/utils'
  export default {
    name: 'ad_details',
    props: {},
    components: { browseUserList, cardCoupon, rewardWrap, floatBox, countDown },
    data () {
      return {
        shareUserId: '',
        curAdId: '',
        // 广告详情
        info: {
          user_id: -1,
          coupon: [],
          thumbnail: {},
          writer: {}
        },

        // 是否显示奖励浮窗
        isShowReward: false,

        // 是否自动上架
        isAutoShelf: true,

        isGetAward: false,
        isMusic: false,
      }
    },
    computed: {
      ...mapState({
        userId: state => state.userInfo.id,
        h5BaseUrl: state => state.h5BaseUrl,
        isLogin: state => state.isLogin
      }),
      isNotPreview () {
        return this.$route.name !== 'ad_preview'
      }
    },
    methods: {
      play_music () {
        this.isMusic = true
        this.$refs.audio.pause()
      },
      // 获取广告详情
      getAdDetails () {
        const id = this.curAdId
        const user_id = this.userId
        const share_id = this.shareUserId
        const params = {
              adID: id,
              user_id: user_id, 
              share_id, share_id,
        }
        this.$api.getAdDetails(params,id)
          .then(data => {
            if (data.status) {
              if (data.data.status === 4 || data.data.user_id == user_id) {
                this.handleBrowseHistory(data.data)
                this.info = data.data
                // this.info.writer.nickname = Base64.decode(this.info.writer.nickname)
                console.log(this.info)
                this.info.thumbnail = JSON.parse(this.info.thumbnail) || {}
                const content = this.parseContent(JSON.parse(this.info.content) || [])
                this.info.content = content
                this.isGetAward = this.info.get_browse_award === 0 || data.data.user_id == user_id
                // const shareUrl = this.h5BaseUrl + 'statics/tranfer_page.html' + '?lyle=ad_details?id=' + this.info.id + '&share_id=' + user_id
                const shareUrl = this.h5BaseUrl + '#/ad_details?id=' + this.info.id + '&share_id=' + user_id
                console.log(shareUrl)
                this.$store.dispatch('setShareInfo', {
                  id: this.info.id,
                  title: this.info.title || '无题',
                  desc: this.info.sub_title || '浏览转发都赚钱',
                  link: shareUrl,
                  imgUrl: 'http://res.michuan.online/' + this.info.thumbnail.url,
                })
              } else {
                this.$router.replace('task_end')
              }
            } else {
              if (data.response_code == 100) {
                this.$router.replace('task_end')
              }
            }
          })
      },
      parseContent (con) {
        let html = ''
        for (let it of con) {
          if (it.type == 1) {
            const { align, bold, size, color } = it.className
            html += `<div class="box-text ${align} ${bold} ${size}" style="color:${color}">${it.content}</div>`
          } else if (it.type == 2) {
            const href = it.link || 'javascript:;'
            html += `<a class="box-img" href="${href}"><img src="${this.$store.state.qiniuBaseUrl + it.url}" /></a>`
          } else if (it.type == 3) {
            html += `<div class="box-video"><video controls src="${this.$store.state.qiniuBaseUrl + it.url}" ></video></div>`
          } else if (it.type == 4) {
            const content = it.content
            const links = it.links
            const reg = /<\*(.*?)\*>/g
            let i = 0
            let aHtml = content
            let match
            while (match = reg.exec(aHtml)) {
              aHtml = aHtml.replace(match[0], `<a href="${links[i]}">${match[1]}</a>`)
              i++
            }
            const { align, bold, color, size } = it.className
            html += `<div class="box-text ${align} ${bold} ${size}}" styl="color:${color}">${aHtml}</div>`
          }
        }
        return html
      },

      // 下架编辑
      underShelf (id) {
        this.$dialog.confirm({
          message: '确认要下架编辑此广告吗？'
        })
          .then(() => {
            const params = {
              status: 5
            }
            this.$api.editAdInfo(params, id)
              .then(data => {
                this.$router.push({ path: '/create_ad', query: { id } })
              })
          })
      },

      handleBrowseHistory (data) {
        const history = getStore('browseHistory', 'localStorage')
        const historyList = history ? JSON.parse(history) : []
        historyList.unshift(data)
        if (historyList.length >= 20) {
          historyList.length = 20
        }

        setStore('browseHistory', historyList, 'localStorage')
      },
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
            this.$store.commit('changeAd', {type: 'isLogin',value: true})
          }
        })
      },
    },

    created () {
      const id = this.$route.query.id
      this.curAdId = id
      console.log(this.curAdId)
      setStore('curAdId', id, 'localStorage')
      this.shareUserId = this.$route.query.share_id
      console.log(this.shareUserId)
      if(!this.isLogin) {
        const redirect_uri = encodeURIComponent(document.location.toString().replace('/#/ad_details?id=' + id, ''))
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx19bdb96099591fef&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=wechat#wechat_redirect`
         const formatUrl = window.location.search.split('?').pop().split('&')
         let arr = []
         for (let it of formatUrl) {
           arr.push(it.split('='))
         }
         const map = new Map(arr)
         const value = decodeURIComponent(map.get('label'))
         const loginType = map.get('state') || this.$route.query.state
         const code = map.get('code') || this.$route.query.code
         const platform = browserVersions().mobile || browserVersions().iPad ? 2 : 3
        if (loginType) {
        this.wechatLogin(code)
        }
        //  const params = {
        //    login_platform: platform,
        //    login_location: '南京',
        //  }
        //  this.$api.wechat(params, code)
        //  .then(data => {
        //    console.log(data)
        //     if(data.status) {
        //       setStore('token', data.data.token, 'localStorage')
        //       this.$store.commit('changeAd', {type: 'isLogin',value: true})
        //     }
        //   })
      }
      // this.$store.dispatch('getShareConfig')
      //   .then(data => {
      //     if (data) {
      //       this.getAdDetails()
      //     }
      //   })
      this.getAdDetails()
    },
    mounted () { }
  }
</script>

<style lang="scss">
  @import "../../../assets/css/ad_details";
  .ad_details {
    .box-text {
      padding-bottom: 10px;
    }
  }
  .text {
    font-size: 14px;
    color: #999;
    text-align: center;
    background: #fff;
    padding: 10px 0;
  }
  .ad_phone {
    position: fixed;
    right: .8rem;
    top: 56%;
    transform: translateY(-50%);
    a {
      display: inline-block;
      width: 1.866667rem;
      height: 1.866667rem;
      border-radius: 1.866667rem;
      background-color: rgba($color: #26c73d, $alpha: .5);
      img {
        margin-left: .373333rem;
        margin-top: .426667rem;
        width: 1.1rem;
        height: 1.1rem;
      }
    }
  }
  #musicControl {
    position:fixed;
    right: .8rem;
    top:50%;
    transform:translateY(-50%);
    margin-top:0;
    display:inline-block;
  }
  .on {
    display: inline-block;
    width: 1.866667rem;
    height: 1.866667rem;
    border-radius: 1.866667rem;
    overflow: hidden;
    background-position: 4px center !important;
    background: url('./../../../assets/images/music.png') no-repeat rgba($color: #000000, $alpha: .4);
    background-size: 70%;
  }
 .off {
    display: inline-block;
    width: 1.866667rem;
    height: 1.866667rem;
    border-radius: 1.866667rem;
    overflow: hidden;
    background: url('./../../../assets/images/music_del.png') no-repeat rgba($color: #000000, $alpha: .4);
    background-size: 89%;
  }
  #musicControl a audio{
    width:100%;
    height:56px;
  }
  #musicControl a.stop {
    background-position: left bottom;
  }
  #musicControl a.on {
     background-position: 0px 1px;
  }
  #music_play_filter{
    width:100%;
    height:100%;
    overflow:hidden;
    position:fixed;
    top:0;
    left:0;   
  }
  
</style>
