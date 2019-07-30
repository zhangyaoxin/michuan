<template>
  <div>
    <div class="ad_list_warp">
    <van-pull-refresh v-model="isLoadRefresh" @refresh="refreshList">
      <van-list v-model="isLoading" :finished="isFinished" @load="pullList" :immediate-check="false">
        <div class="home_ad_item van-hairline--bottom" :class="{'has_read':$route.name==='home'&&item.has_read===1}" v-for="(item,index) in adList" :key="index">
          <div class="ad_user_wrap">
            <!-- <router-link v-if="!item.merchant" :to="{path:'me_index',query:{id:item.user_id}}" class="ad_user_info">
              <div class="ad_user_avatar">
                <img :src="item.writer.thumbnail|filterImg('avatar')" alt="">
              </div>
              <div class="ad_user_nickname">{{item.writer.nickname}}</div>
              <img class="ad_user_img" src="./../assets/images/arrow.png" alt="">
            </router-link>
            <a v-else :href="'http://h5.bvcio.com/mc_b/shop.html?shopId=' + item.merchant.hashID + '&token='+ item.token" class="ad_user_info">
              <div class="ad_user_avatar">
                <img :src="item.merchant.logo" alt="">
              </div>
              <div class="ad_user_nickname">{{item.merchant.title}}</div>
              <img class="ad_user_img" src="./../assets/images/arrow.png" alt="">
            </a> -->

            <!-- <div class="ad_user_attent" :class="{'attent':item.is_concern===1}" @click="attentBtn(item.is_concern,item.writer.id,index)" v-if="userId!=item.writer.id">
              <div class="attent_icon"></div>
              <div>{{item.is_concern===1?'已关注':'关注'}}</div>
            </div> -->
          </div>

          <router-link :to="{path:'ad_details',query:{id:item.id}}" class="ad_info" @click="jumpRoute">
            <div class="ad_desc">
              <div class="ad_title" style="-webkit-box-orient: vertical;-moz-box-orient: vertical;box-orient: vertical;">{{item.title||'无题'}}</div>
              <div class="ad_title sub_title" style="-webkit-box-orient: vertical;-moz-box-orient: vertical;box-orient: vertical;">{{item.sub_title}}</div>
            </div>
            <div class="ad_img">
              <img :src="item.thumbnail.url|filterImg" alt="">
            </div>
          </router-link>

          <div class="ad_time">
            <span>{{item.created_at|filterTime}}</span>
            <span>浏览 {{item.total_browse_count}}</span>
            <span>分享 {{item.total_share_count}}</span>
            <div class="package" v-if="item.reward.length>0">红包</div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <div class="nothing_wrap" :class="{'me_nothing':$route.name==='me_index'}" v-if="nothing">
      <img class="nothing_icon" src="../assets/images/nothing.png" alt="">
      <p class="fans_title">暂无内容～</p>
    </div>
    <!-- 滚动到顶部 -->
    <go-top></go-top>
  </div>
  <div class="texts" v-if="isDi">我是有底线的</div>
  </div>
</template>

<script>  
  import goTop from '@@/go_top'
  import { mapState } from 'vuex'
  import { getStore } from '@/utils/utils'
  let Base64 = require('js-base64').Base64
  export default {
    name: 'ad_list',
    components: { goTop },
    props: {
      searchCond: Object,
      api: {
        type: String,
        default: 'getAdList'
      }
    },
    data () {
      return {
        page: 1,

        isLoadRefresh: false,
        isLoading: false,
        isFinished: false,

        adList: [],

        isDi: false,

        isOwn: false,

        nothing: false,
        areaNum: '',
        token: ''
      }
    },
    computed: {
      ...mapState({
        isLogin: state => state.isLogin,
        userId: state => state.userInfo.id
      }),
      isSearchPath () {
        return this.$route.name === 'search'
      },
    },
    methods: {
      // 获取广告列表
      getAdList () {
        const page = this.page
        const api = this.api
        if(!this.areaNum) {
          this.areaNum = getStore('area_num', 'localStorage')
          console.log(1)
        }
        if(!this.areaNum) {
         this.areaNum = 100000
         console.log(2)
        }
        if (page === 1) this.adList = []
        const own_article = 0
        const params = {
          page,
          status: 4,
          own_article: 0,
          areaNum: this.areaNum,
          ...this.searchCond
        }

        if (this.isOwn) {
          params.own_article = 0
        }

        this.$api[api](params)
          .then(data => {
            console.log('获取广告列表 ==>', data)
            this.isLoadRefresh = false
            this.isLoading = false
            if (data.status) {
              // setTimeout(() => {
              //   if (data.data.data.length === 0) {
              //     this.nothing = true
              //   } else {
              //     this.nothing = false
              //   }
              // }, 3000);

              if(data.data.data.length > 3) {
                this.isDi = true
              }
              data.data.data.map(it => {
                  it.thumbnail = JSON.parse(it.thumbnail) || {}
                })
                this.adList.push(...data.data.data)
                this.token = getStore('token','localStorage')
                this.adList[0].token = this.token
                console.log(this.adList)
                if (data.data.total / data.data.per_page <= page) {
                  this.isFinished = true
                } else {
                  this.isFinished = false
                }
            }
          })
          .catch(err => {
            this.isLoadRefresh = false
            this.isLoading = false
            this.isFinished = true
          })

      },

      refreshList () {
        this.page = 1
        console.log('下拉刷新')
        this.isLoadRefresh = true
        this.getAdList()
      },

      pullList () {
        console.log('上拉加载')
        this.page++
        this.isLoading = true
        this.getAdList()
      },

      getBrowseHistory () {
        this.isLoadRefresh = false
        this.isLoading = false
        this.isFinished = true
        const history = getStore('browseHistory', 'localStorage')
        if (history) {
          const list = JSON.parse(history)
          list.map(it => {
            it.thumbnail = JSON.parse(it.thumbnail) || {}
          })
          this.adList = list
        } else {
          this.adList = []
        }

      },

      computBalance (balance, pre) {
        return parseInt((Number(balance) / Number(pre)) * 100)
      },

      // 关注
      async attentBtn (isAtten, id, i) {
        if (!this.isLogin) {
          this.$router.push('login')
          return false
        }
        const type = isAtten === 0 ? 1 : 0
        const concern_id = this.userId
        const concerned_id = id
        const res = await this.$store.dispatch('changeAttent', { concern_id, concerned_id, type })
        if (res) {
          this.adList[i].is_concern = type
          this.$emit('changeEvent', id)
          type === 1 ? this.$toast('关注成功') : this.$toast('取消关注')
        }

      },
    },
    created() {
      this.areaNum = this.$route.query.area_num
    }
  }
</script>

<style  lang="scss">
  @import "../assets/css/var";

  .texts {
    font-size: 14px;
    color: #999;
    text-align: center;
    padding: 10px 0;
  }

  .van-hairline--bottom {
    border-color: #e8e8e8;
  }

  .ad_list_warp {
    padding-left: 0.8rem;
    font-size: 0.746667rem;
    background: #fff;

    .home_ad_item {
      padding: 0.8rem 0.8rem 0.8rem 0;
    }
    .has_read .ad_title {
      color: #999;
    }

    .ad_user_wrap {
      transform: translateZ(0);
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 0.533333rem;
    }

    .ad_user_info {
      display: flex;
      align-items: center;
    }

    .ad_user_info > div {
      margin-left: 4px;
    }

    .ad_user_wrap .ad_user_avatar {
      margin-left: 0;
      width: 18px;
      height: 18px;
      line-height: 18px;
      border-radius: 18px;
      border: 1px solid #e8e8e8;
      overflow: hidden;
    }

    .ad_user_avatar img {
      width: 100%;
      height: 100%;
    }

    .ad_user_nickname {
      max-width: 6.4rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .ad_user_img {
      width: 1.28rem;
      height: 1.28rem;
      position: absolute;
      right: 0;
      top: 1px;
      // margin-left: 9.8rem;
    }

    .ad_user_level {
      padding: 0 0.213333rem;
      height: 0.853333rem;
      line-height: 0.853333rem;
      font-size: 0.64rem;
      color: #fff;
      background: #bbbfc7;
      border-radius: 0.106667rem;
    }

    .ad_user_wrap .ad_user_attent {
      display: flex;
      align-items: center;
      margin-left: auto;
      color: $mc_color;
    }

    .attent_icon {
      margin-right: 0.106667rem;
      width: 0.533333rem;
      height: 0.533333rem;
      background: url("../assets/images/home_attent.png");
      background-size: 0.533333rem;
    }

    .ad_user_wrap .ad_user_attent.attent {
      color: #999;
    }

    .ad_user_attent.attent .attent_icon {
      margin-right: 0.206667rem;
      margin-top: 0.106667rem;
      width: 0.633333rem;
      height: 0.51rem;
      background: url("../assets/images/attention.png");
      background-size: 0.633333rem;
    }

    .ad_info {
      display: flex;
      transform: translateZ(0);
    }

    .ad_desc {
      flex: 1;
    }

    .ad_title {
      line-height: 20px;
      font-size: 0.906667rem;
      color: #000;
      font-weight: bold;
      display: -webkit-box;
      display: -moz-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      -webkit-box-orient: vertical;
      -moz-box-orient: vertical;
      box-orient: vertical;
      -webkit-line-clamp: 2;
      -moz-line-clamp: 2;
    }
    .sub_title {
      margin-top: 5px;
      width: 11.466667rem;
      font-size: 0.64rem;
      font-weight: normal;
      line-height: 14px;
      color: #333;
    }

    .ad_img {
      margin-left: 1.066667rem;
      width: 5.6rem;
      height: 3.733333rem;
      border: 1px solid #f4f4f4;
      background: #f4f4f4;
      overflow: hidden;
    }

    .ad_img img {
      width: 100%;
    }

    .ad_progress_wrap {
      display: flex;
      align-items: center;
      margin-top: 0.533333rem;
      font-size: 0.64rem;
      color: #666;
    }

    .ad_progress {
      flex: 1;
      margin-left: 0.533333rem;
    }

    .ad_badge,
    .ad_time {
      transform: translateZ(0);
      margin-top: 0.2rem;
      font-size: 0.64rem;
      color: #666;
    }

    .ad_badge span,
    .ad_time span {
      margin-right: 0.533333rem;
    }

    .ad_time {
      color: #a2a6ad;
    }

    .package {
      line-height: 14px;
      display: inline-block;
      color: #ff3c3e;
      border: 1px solid #ff3c3e;
      padding: 0 5px;
      border-radius: 15px;
    }

    .nothing_wrap {
      top: 45%;
    }
    .me_nothing {
      top: 50%;
    }
  }
</style>
