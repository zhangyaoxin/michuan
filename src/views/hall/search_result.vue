<template>
  <div class="search_result">
    <div class="home_top">
      <div class="home_search" @click="$router.push('hall_search')">
        <van-search v-model="search" background="#fff" shape="round" readonly placeholder="请输入搜索关键词">
          <img slot="left-icon" src="../../assets/images/mall_search_icon.png" alt="">
        </van-search>
      </div>
    </div>

    <div class="search_user van-hairline--top" v-if="memberList.length">
      <div class="result_top">
        <div class="title">相关用户</div>
        <router-link :to="{path:'more_search_user',query:{search:keyword}}" class="more">
          <span>更多</span>
          <van-icon name="arrow" />
        </router-link>
      </div>

      <div class="result_main">
        <router-link :to="{path:'me_index',query:{id:item.id}}" class="user_item" v-for="(item,index) in memberList" :key="index">
          <div class="user_avatar">
            <img :src="item.thumbnail|filterImg('avatar')" alt="">
          </div>
          <div class="user_nickname">{{item.nickname}}</div>
        </router-link>
      </div>
    </div>

    <div class="search_ad search_ad" style="margin-top:.533333rem;">
      <div class="result_top">
        <div class="title">相关发布</div>
      </div>
      <ad-list ref="adList" :searchCond="searchCond"></ad-list>
    </div>
  </div>
</template>

<script>
  import adList from '@@/ad_list'
  import { mapState } from 'vuex'
  export default {
    name: 'search_result',
    components: { adList },
    data () {
      return {
        keyword: '',
        // 搜索用户
        memberList: [],
        searchCond: {}
      }
    },
    computed: {
      ...mapState({
        userId: state => state.userInfo.id
      }),
    },
    methods: {
      // 获取搜索数据
      getSearchData () {
        const id = this.userId
        console.log('获取搜索数据')
        this.searchCond.keyword = this.keyword
        this.$nextTick(() => {
          this.$refs.adList.page = 1
          this.$refs.adList.getAdList()
        })

        this.$api.getSearchUser(id, { keyword: this.keyword, limit: 4 })
          .then(data => {
            if (data.status) {
              this.memberList = data.data.data
            }
          })
      }
    },
    created () {
      this.keyword = this.$route.query.search

      this.getSearchData()
    }
  }
</script>

<style  lang="scss">
  .search_result {
    background: #fff;

    .search_user,
    .search_ad {
      padding: 0.8rem;
    }

    .search_user {
      margin-top: 45px;
    }

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

    .result_top {
      display: flex;
      align-items: center;
    }

    .title {
      flex: 1;
      position: relative;
      padding-left: 0.533333rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #333;
    }

    .title::before {
      content: "";
      display: block;
      position: absolute;
      top: 6px;
      left: 0;
      width: 0.106667rem;
      height: 0.8rem;
      background: #65d0cd;
    }

    .more {
      color: #999;
      font-size: 0.64rem;
    }

    .more i {
      position: relative;
      top: 0.053333rem;
    }

    .result_main {
      display: flex;
      /* justify-content: space-around; */
      margin-top: 0.8rem;
    }

    .user_item {
      margin: 0 0.213333rem;
      width: 4.32rem;
      height: 5.12rem;
      background: #f4f4f4;
      border-radius: 0.213333rem;
      font-size: 0.64rem;
      color: #333;
      text-align: center;
    }

    .user_avatar {
      margin-top: 0.8rem;
      margin-left: 1.066667rem;
      margin-bottom: 0.693333rem;
      width: 2.133333rem;
      height: 2.133333rem;
      border-radius: 100%;
      overflow: hidden;
    }

    .user_avatar img {
      width: 100%;
      height: 100%;
    }

    .user_nickname {
      margin: 0 auto;
      overflow: hidden;
      white-space: nowrap;
      width: 74%;
    }
    .ad_list_warp {
      padding-left: 0;
    }
  }
</style>
