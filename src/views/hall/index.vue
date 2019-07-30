<template>
  <div class="home">
    <!-- <div class="header"> -->
    <div class="home_top">
      <div class="home_search" @click="$router.push('hall_search')">
        <van-search v-model="search" background="#fff" shape="round" readonly placeholder="请输入搜索关键词">
          <img slot="left-icon" src="../../assets/images/mall_search_icon.png" alt="">
        </van-search>
      </div>
      <!-- <div class="home_msg" @click="$router.push('me_msg')">
        <div class="msg_num" v-if="unreadMsgCount">{{unreadMsgCount|filterMsgNum}}</div>
      </div> -->
    </div>

    <!-- 轮播 -->
    <van-swipe class="swipe_wrap" :autoplay="3000">
      <van-swipe-item v-for="(item,index) in swipeList" :key="index">
        <a :href="item.link_url">
          <img class="swipe_img" :src="item.picture|filterImg" />
        </a>
      </van-swipe-item>
    </van-swipe>
    <!-- </div> -->

    <!-- 广告tab -->
    <!-- <div class="home_tab_wrap">
      <van-tabs v-model="curTab" sticky>
        <van-tab title="热门推荐"></van-tab>
        <van-tab title="我的发布"></van-tab>
      </van-tabs>
    </div> -->

    <!-- 广告列表 -->
    <ad-list ref="adList" :searchCond="searchCond"></ad-list>

    <!-- 下载app -->
    <!-- <div class="down_app_wrap" v-if="isAndroid">
      <a href="http://h5.bvcio.com/d">
        <span>下载App</span>
      </a>
    </div> -->

    <!-- <div class="money" @click="buildMoney">
      <div class="money_title">红包攻略</div>
    </div> -->

  </div>
</template>

<script>
  import adList from '@@/ad_list'
  import goTop from '@@/go_top'
  import { mapState } from 'vuex'
  import { browserVersions } from '@/utils/utils'
  export default {
    name: 'home',
    props: {},
    components: { adList, goTop },
    data () {
      return {
        isAndroid: false,

        curTab: 0,
        searchCond: {},

        swipeList: [],
      }
    },
    computed: {
      ...mapState({
        isLogin: state => state.isLogin,
        userId: state => state.userInfo.id,
        h5BaseUrl: state => state.h5BaseUrl,
        unreadMsgList: state => state.unreadMsgList
      }),
      unreadMsgCount () {
        const list = this.unreadMsgList
        let num = 0
        for (let it in list) {
          num += Number(list[it])
        }
        return num
      }
    },
    watch: {
      curTab (n) {
        console.log(n)
        this.getAdList(n)
      }
    },
    methods: {
      // 获取轮播图列表
      getSwipe () {
        this.$api.getCarousel()
          .then(data => {
            if (data.status) {
              this.swipeList = data.data.data
            }
          })
      },
      buildMoney () {
        this.$router.push('hall_money')
      },
      // 获取广告列表
      getAdList (type = 0) {
        console.log(this.userId)
        this.searchCond.user_id = ''
        if (type == 1) {
          if (!this.isLogin) {
            this.$router.push('login')
            return false
          }
          this.searchCond.user_id = this.userId
        }
        this.$refs.adList.page = 0
        this.$nextTick(() => {
          this.$refs.adList.getAdList()
        })
      },

    },

    created () {
      this.getSwipe()
      this.isAndroid = browserVersions().android

      console.log(this.isLogin, '<==是否登录')
      if (this.isLogin) {
        this.$store.dispatch('getUserMsgList')
      }
    },
    mounted () {
      this.getAdList();
      window.addEventListener("scroll", this.handleScroll);
    },

    destroyed () {
      window.removeEventListener("scroll", this.handleScroll);
    }

  }
</script>

<style lang="scss">
  @import "../../assets/css/var";
  .home {
    padding-bottom: 2.666667rem;

    .van-field__left-icon {
      margin-top: 5px;
      margin-right: 4px;
      width: 14px;
      height: 14px;
      img {
        width: 100%;
      }
    }

    .home_top {
      display: flex;
      align-items: center;
      position: fixed;
      top: 0;
      width: 100%;
      box-sizing: border-box;
      z-index: 999;
      background: #fff;
    }
    .home_search {
      width: 100%;
    }

    // 广告tab
    .home_tab_wrap {
      position: -webkit-sticky;
      position: -moz-sticky;
      position: sticky;
      top: 50px;
      margin-top: 0.533333rem;
      background: #fff;
      z-index: 999;
    }
    .van-tab {
      font-size: 0.8rem;
    }

    .van-tab--active {
      color: $mc_color;
      // font-weight: bold;
    }

    .van-tabs__line {
      background: transparent;
    }

    .integrated_list_wrap {
      width: 100%;
      // height: 200px;
      background: #fff;
    }

    .integrated_active {
      color: $mc_color;
    }

    .down_app_wrap {
      position: fixed;
      bottom: 6.4rem;
      right: 0.8rem;
      width: 50px;
      height: 50px;
      line-height: 16px;
      text-align: center;
      background: #fff;
      border-radius: 100%;
      box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.22);
      a {
        position: relative;
        top: 10px;
        color: #ff4c4c;
      }
    }

    /* 轮播 */
    .van-swipe__indicator--active {
      background-color: $mc_color;
    }

    .swipe_wrap {
      margin-top: 54px;
      height: 6.133333rem;
      background: #fff;
    }

    .swipe_img {
      width: 100%;
      height: 100%;
    }

    .money {
      position: fixed;
      top: 300px;
      right: 0;
      width: 35px;
      height: 88px;
      background-color: #f75260;
      border-radius: 10% 0 0 10%;
      z-index: 99;
    }
    .money_title {
      writing-mode: tb-rl;
      font-size: 16px;
      text-align: center;
      margin: 12px auto;
      color: #fff;
      line-height: 1;
    }
  }
</style>
