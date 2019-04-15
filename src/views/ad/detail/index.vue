<template>
  <div class="ad_details">
    <!-- 广告基本信息 -->
    <div class="view_header">
      <div class="ad_title" style="-webkit-box-orient: vertical;-moz-box-orient: vertical;box-orient: vertical;">{{info.title||'无题'}}</div>
      <div class="ad_title sub_title" style="-webkit-box-orient: vertical;-moz-box-orient: vertical;box-orient: vertical;">{{info.sub_title||'暂无摘要'}}</div>

      <div class="ad_info">
        <div class="put_time">{{info.created_at}} 发布</div>
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
        <router-link :to="{path:'me_index',query:{id:info.user_id}}" class="put_user_info">
          <div class="user_avatar">
            <img :src="info.writer.thumbnail|filterImg('avatar')" alt="">
          </div>

          <div class="user_nickname">{{info.writer.nickname}}</div>

          <!-- <div class="user_level">Lv1</div>

          <div class="user_badge">
            <img src="https://via.placeholder.com/19x23/ff4b4b" alt="">
          </div>
          <div class="user_badge">
            <img src="https://via.placeholder.com/19x23/ff4b4b" alt="">
          </div> -->
        </router-link>

        <!-- 别人的广告 -->
        <router-link :to="{path:'me_index',query:{id:info.user_id}}" class="user_attent" v-if="userId!=info.user_id">
          <div>Ta的主页</div>
        </router-link>

        <!-- 自己的广告 -->
        <div class="user_attent" @click="underShelf(info.id)" v-if="userId==info.user_id">
          <div>下架编辑</div>
        </div>
      </div>
    </div>

    <!-- 广告封面 -->
    <div class="ad_cover van-hairline--top" v-if="info.thumbnail.url">
      <img :src="info.thumbnail.url|filterImg" alt="">
    </div>

    <!-- 优惠券 -->
    <card-coupon :info="info"></card-coupon>

    <!-- 广告详情 -->
    <div class="ad_detail" v-if="info.content">
      <div class="content" v-html="info.content"></div>
    </div>

    <!-- 传播明细 我的影响力 -->
    <browse-user-list :title="userId==info.user_id?'传播明细':'我的影响力'" api="getMyInfluenceList" :curAdId="curAdId"></browse-user-list>

    <!-- 用券明细 -->
    <browse-user-list title="用券明细" api="getMyCouponList" :curAdId="curAdId" v-if="userId==info.user_id&&info.coupon.length"></browse-user-list>

    <!-- 蜜传二维码 -->
    <div class="qr_code_wrap">
      <img src="../../../assets/images/me_about.png" alt="">
    </div>

    <!-- 奖励浮窗 -->
    <reward-wrap :isGetAward="isGetAward" v-if="Number(info.pre_bvt)"></reward-wrap>

    <!-- 底部悬浮框 -->
    <float-box></float-box>

  </div>
</template>

<script>
  import browseUserList from './user_list'
  import cardCoupon from './card_coupon'
  import rewardWrap from './reward_wrap'
  import floatBox from './bottom_float_box'

  import wx from 'wx'

  import { mapState } from 'vuex'
  import { getStore, setStore } from '@/utils/utils'

  export default {
    name: 'ad_details',
    props: {},
    components: { browseUserList, cardCoupon, rewardWrap, floatBox },
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
      }
    },
    computed: {
      ...mapState({
        userId: state => state.userInfo.id,
        h5BaseUrl: state => state.h5BaseUrl
      }),
      isNotPreview () {
        return this.$route.name !== 'ad_preview'
      }
    },
    methods: {
      // 获取广告详情
      getAdDetails () {
        const id = this.curAdId
        const user_id = this.userId
        const share_id = this.shareUserId
        this.$api.getAdDetails({ id, user_id, share_id })
          .then(data => {
            if (data.status) {
              if (data.data.status === 4 || data.data.user_id == user_id) {
                this.handleBrowseHistory(data.data)
                this.info = data.data
                this.info.thumbnail = JSON.parse(this.info.thumbnail) || {}
                const content = this.parseContent(JSON.parse(this.info.content) || [])
                this.info.content = content
                this.isGetAward = this.info.get_browse_award === 0 || data.data.user_id == user_id

                const shareUrl = this.h5BaseUrl + 'statics/tranfer_page.html' + '?lyle=ad_details?id=' + this.info.id + '&share_id=' + user_id

                this.$store.dispatch('setShareInfo', {
                  id: this.info.id,
                  title: this.info.title || '无题',
                  desc: this.info.sub_title || '浏览转发都赚钱',
                  link: shareUrl,
                  imgUrl: 'http://www.oldda.cn/' + this.info.thumbnail.url,
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
        console.log(con)
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
    },

    created () {
      const id = this.$route.query.id
      this.curAdId = id
      console.log(this.curAdId)
      setStore('curAdId', id, 'localStorage')
      this.shareUserId = this.$route.query.share_id
      console.log(this.shareUserId)
      this.$store.dispatch('getShareConfig')
        .then(data => {
          if (data) {
            this.getAdDetails()
          }
        })
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
</style>
