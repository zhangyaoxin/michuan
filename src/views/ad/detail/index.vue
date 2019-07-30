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
        <a :href="'http://h5.bvcio.com/mc_b/shop.html?shopId=' + info.merchant.hashID + '&token='+ this.token" class="put_user_info" v-else>
          <div class="user_avatar">
            <img :src="info.merchant.logo" alt="">
          </div>
          <div class="user_nickname">{{info.merchant.sub_title}}</div>
          <img style="width: 24px; height:24px;  position: absolute; right: 0; top: 1px;" src="./../../../assets/images/arrow.png" alt="">
        </a>
        <!-- 拨打电话 -->
        <!-- <div v-if="info.phone" class="ad_phone"> -->
          <a :href="'tel:' + info.phone" v-if="info.phone" class="ad_phone">
            <!-- <img src="./../../../assets/images/tel.png" alt=""> -->
          </a>
        <!-- </div> -->

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
    <div v-if="info.start_time && info.start_time != 0" style="margin-top: 12px;background: #fff; padding: 10px 0; border-bottom: 1px solid #e8e8e8;">
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
    <reward-wrap :isGetAward="isGetAward" v-if="info.reward.length>0"></reward-wrap>

    <!-- 底部悬浮框 -->
    <!-- <float-box></float-box> -->
    <!-- 领取优惠劵 -->
    <couponWarp v-if="info.reward.length == 0 && info.coupon.length > 0"></couponWarp>
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


    <div class="text">本页面由蜜传提供技术支持</div>
     <!-- 浮动条 -->
     <div class="float_bar">
       <router-link :to="{path: '/newMap'}" class="float_home">
         <img src="./../../../assets/images/redhome.png" alt="">
         <div>首页</div>
       </router-link>
       <router-link style="margin-left: 5px" :to="{path: '/hall'}" class="float_home">
         <img src="./../../../assets/images/redpackage.png" alt="">
         <div>抢红包</div>
       </router-link>
       <div class="float_box">
        <router-link :to="{path:'me_index',query:{id:info.user_id}}" v-if="info.merchant == null" class="float_ta">
         <img src="./../../../assets/images/Ta.png" alt="">
         <span>Ta的主页</span>
        </router-link>
        <a :href="'http://h5.bvcio.com/mc_b/shop.html?shopId=' + info.merchant.hashID + '&token='+ this.token" v-else class="float_ta">
         <img src="./../../../assets/images/Ta.png" alt="">
         <span>Ta的主页</span>
        </a>
        <div @click="isShareTip=true" v-if="info.reward.length>0" class="float_share">
          <img src="./../../../assets/images/shareh.png" alt="">
          <span>分享赚蜂蜜</span>
        </div>
        <div @click="isShareTips=true" v-else class="float_share">
          <img src="./../../../assets/images/shareh.png" alt="">
          <span>分享给好友</span>
        </div>
       </div>
     </div>
     <van-popup v-model="isShareTip" position="top" :close-on-click-overlay="false" class="share_tip_wrap">
      <img style="width:291px; margin: auto;margin-top:10px;display: block;" src="../../../assets/images/share_tip_title.png" alt="">
      <img style="display: block;width:99px;margin:40px auto;" src="../../../assets/images/share_tip_btn.png" alt="" @click="isShareTip=false">
    </van-popup>
    <van-popup v-model="isShareTips" position="top" :close-on-click-overlay="false" class="share_tip_wrap">
      <img style="width:291px; margin: auto;margin-top:10px;display: block;" src="../../../assets/images/share_tips_title.png" alt="">
      <img style="display: block;width:99px;margin:40px auto;" src="../../../assets/images/share_tips_btn.png" alt="" @click="isShareTips=false">
    </van-popup>
  </div>
</template>

<script>
  import countDown from './countdown'
  import browseUserList from './user_list'
  import cardCoupon from './card_coupon'
  import rewardWrap from './reward_wrap'
  import floatBox from './bottom_float_box'
  import couponWarp from './coupon_wrap'
  import wx from 'wx'
  let Base64 = require('js-base64').Base64
  import { mapState } from 'vuex'
  import { browserVersions, getStore, setStore } from '@/utils/utils'
import user from '../../../api/user';
  export default {
    name: 'ad_details',
    props: {},
    components: { browseUserList, couponWarp, cardCoupon, rewardWrap, floatBox, countDown },
    data () {
      return {
        shareUserId: '',
        curAdId: '',
        isShareTip: false,
        isShareTips: false,
        // 广告详情
        info: {
          user_id: -1,
          coupon: [],
          thumbnail: {},
          writer: {},
          reward: []
        },
        wechatSel: false,
        wechatUrl: '',

        // 是否显示奖励浮窗
        isShowReward: false,
        ShareImg: '',
        // 是否自动上架
        isAutoShelf: true,

        isGetAward: false,
        isMusic: false,
        token: ''
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
            this.token = getStore('token','localStorage')
            if (data.status) {
              if (data.data.status === 4 || data.data.user_id == user_id) {
                this.handleBrowseHistory(data.data)
                this.info = data.data
                // this.info.writer.nickname = Base64.decode(this.info.writer.nickname)
                console.log(this.info)
                console.log(this.info.userShareTimes)
                this.info.thumbnail = JSON.parse(this.info.thumbnail) || {}
                const content = this.parseContent(JSON.parse(this.info.content) || [])
                this.info.content = content
                this.isGetAward = this.info.get_browse_award === 0 || data.data.user_id == user_id 
                console.log(this.isGetAward)
                const host = "http://h5.bvcio.com/api";
                const appId = "wx19bdb96099591fef";
                // const shareUrl = window.location.href.split('#')[0] + '/#/ad_details?id=' +this.info.id + '&share_id=' + user_id
                const shareUrl = this.h5BaseUrl + '?#/ad_details?id=' +this.info.id + '&share_id=' + user_id
                const adviseId = this.info.id
                if(this.info.share_img) {
                  this.ShareImg = 'http://res.michuan.online/' + this.info.share_img
                } else {
                  this.ShareImg = 'http://res.michuan.online/Ft4gl6oUhaakOGdX88nHF0qMH4MF'
                }
                const shareData = {
                  title: this.info.title || '无题',
                  desc: this.info.sub_title || '浏览转发都赚钱',
                  link: shareUrl,
                  imgUrl: this.ShareImg
                }
                console.log(shareData,'11111111111111')
                const wxCallbacks = {
                  //分享成功
                  confirm : function(resp) {
			              shareSuccessCb(adviseId)
                  },
                }
                var _url = encodeURIComponent(location.href.split("#")[0]);
                $.ajax({
                  type: "post",
                  url: host + "/wechat/jssdk/config/" + appId + "?url=" + _url,
                  dataType: "json",
                  headers: {
                    "mc-token": localStorage.token,
                    platform: 2
                  },
                  success: function(res) {
                    wx.config(res);
                    wx.ready(function() {
                      wx.onMenuShareAppMessage({
                        title: shareData.title,
                        desc: shareData.desc,
                        link: shareData.link,
                        imgUrl: shareData.imgUrl,
                        success: function () {
                          console.log('成功')
                          $.ajax({
                            type: "get",
                            url: host + "/count_share?adv_id=" + adviseId,
                            dataType: "json",
                            headers: {
                              "mc-token": localStorage.token,
                              platform: 2
                            },
                            success: function(res) {
                              console.log(res,'12')
                            }
                          })
                        }
                      })
                      wx.onMenuShareTimeline({
                        title: shareData.title,
                        link: shareData.link,
                        imgUrl: shareData.imgUrl,
                        success: function () {
                          console.log('成功')
                          $.ajax({
                            type: "get",
                            url: host + "/count_share?adv_id=" + adviseId,
                            dataType: "json",
                            headers: {
                              "mc-token": localStorage.token,
                              platform: 2
                            },
                            success: function(res) {
                              console.log(res,'12')
                            }
                          })
                        }
                      })
                    })
                  },
                 error: function(res) {}
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

      getQueryString(name) {//根据字段看网址是否拼接&字符串
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
          return unescape(r[2]);
        return null;
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
      setStore('curAdId', id, 'localStorage')
      this.shareUserId = this.$route.query.share_id
      const from = this.getQueryString('from');
      if (from) {//假如拼接上了
        window.location.href = this.h5BaseUrl + '#/ad_details?id=' + this.curAdId + '&share_id=' + this.shareUserId 
      }
      // if(!this.isLogin) {
      //   const redirect_uri = encodeURIComponent(document.location.toString())
      //   window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx19bdb96099591fef&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=wechat#wechat_redirect`
      //    const formatUrl = window.location.search.split('?').pop().split('&')
      //    let arr = []
      //    for (let it of formatUrl) {
      //      arr.push(it.split('='))
      //    }
      //    const map = new Map(arr)
      //    const value = decodeURIComponent(map.get('label'))
      //    const loginType = map.get('state') || this.$route.query.state
      //    const code = map.get('code') || this.$route.query.code
      //    const platform = browserVersions().mobile || browserVersions().iPad ? 2 : 3
      //   if (loginType) {
      //   this.wechatLogin(code)
      //   }
      // }
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
    padding-bottom: 60px;
  }
  .ad_phone {
    position: absolute;
    right: 1.133333rem;
    top: 12px;
    width: 24px;
    height: 24px;
    transform: translateY(-50%);
    z-index: 999;
    background-image: url('./../../../assets/images/tel.png');
    background-size: contain;
  }
  #musicControl {
    position:fixed;
    right: 1.3rem;
    top: 180px;
    transform:translateY(-50%);
    margin-top:0;
    display:inline-block;
    z-index: 999;
  }
  .on {
    display: inline-block;
    width: 37px;
    height: 37px;
    border-radius: 37px;
    overflow: hidden;
    // background-position: 4px center !important;
    background: url('./../../../assets/images/music.png') no-repeat;
    background-size: contain;
    z-index: 999;
  }
 .off {
    display: inline-block;
    width: 37px;
    height: 37px;
    border-radius: 37px;
    overflow: hidden;
    background: url('./../../../assets/images/music_del.png') no-repeat ;
    background-size: contain;
    z-index: 999;
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

  .float_bar {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    background-color: #fff;
    box-shadow: 1px -3px 20px rgba($color: #000000, $alpha: 0.1)
  }
  .float_home {
    display: inline-block;
    width: 40px;
    height: 50px;
    margin-left: 15px;
    img {
      width: 1.173333rem;
      height: 1.173333rem;
      margin-left: 9px;
      margin-top: 5px;
    }
    div {
      text-align: center;
      font-size: 10px;
    }
  }
  .float_box {
    position: absolute;
    top: 5px;
    right: 15px;
    width: 240px;
  }
  .float_ta {
    display: inline-block;
    width: 115px;
    height: 40px;
    line-height: 40px;
    border-radius: 20px 0 0 20px;
    margin-right: -5px;
    background: -webkit-linear-gradient(left,#fbba58,#fc9523); /* Safari 5.1 - 6 */
    background: -o-linear-gradient(right,#fbba58,#fc9523); /* Opera   11.1 - 12*/
    background: -moz-linear-gradient(right,#fbba58,#fc9523); /* Firefox   3.6 - 15*/
    background: linear-gradient(to right, #fbba58, #fc9523); /* 标准的语法 */
    img {
      width: 16px;
      height: 14px;
      margin-left: 20px;
      margin-right: 5px;
      margin-top: 13px;
    }
    span {
      color: #fff;
    }
  }
  .float_share {
    display: inline-block;
    width: 125px;
    height: 40px;
    line-height: 40px;
    border-radius: 0 20px 20px 0;
    background: -webkit-linear-gradient(left,#fc5154,#ff2d2f); /* Safari 5.1 - 6 */
    background: -o-linear-gradient(right,#fc5154,#ff2d2f); /* Opera   11.1 - 12*/
    background: -moz-linear-gradient(right,#fc5154,#ff2d2f); /* Firefox   3.6 - 15*/
    background: linear-gradient(to right, #fc5154, #ff2d2f); /* 标准的语法 */
    img {
      width: 14px;
      height: 14px;
      margin-left: 16px;
      margin-right: 5px;
      margin-top: 13px;
    }
    span {
      color: #fff;
    }
  }
  .share_tip_wrap {
     background: transparent;
   }
   .van-modal {
     background-color: rgba(0, 0, 0, 0.8);
   }
</style>
