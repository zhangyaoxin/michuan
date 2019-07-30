<template>
  <div class="mc_swipe">
    <div class="header">
      <div class="search" @click="$router.push('mall_search')">
        <van-search v-model="search" shape="round" background="#fff" readonly placeholder="请输入您要找的商品">
          <img slot="left-icon" src="../../../assets/images/mall_search_icon.png" alt="">
        </van-search>
      </div>

      <div class="msg" @click="$router.push('me_msg')">
        <div class="msg_num" v-if="unreadMsgCount">{{unreadMsgCount|filterMsgNum}}</div>
      </div>
    </div>

    <!-- 轮播 -->
    <van-swipe class="swipe_wrap" :autoplay="3000">
      <van-swipe-item v-for="(item,index) in swipeList" :key="index">
        <a :href="item.link_url">
          <img class="swipe_img" :src="item.picture|filterImg" />
        </a>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
  export default {
    name: 'mc_swipe',
    components: {},
    data () {
      return {
        swipeList: [],
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
    },
    created () {
      this.getSwipe()
    }
  }
</script>

<style lang="scss">
  @import "../../../assets/css/var";

  .mc_swipe {
    .header {
      display: flex;
      align-items: center;
      position: fixed;
      top: 0;
      padding: 0.533333rem 0.8rem;
      width: 100%;
      box-sizing: border-box;
      z-index: 999;
      background: #fff;
    }
    .search {
      flex: 1;
    }

    .van-search {
      padding: 0;
    }
    .van-search__content {
      background-color: #f4f4f4;
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
    .msg {
      position: relative;
      margin-left: 0.8rem;
      width: 1.28rem;
      height: 1.28rem;
      background: url("../../../assets/images/message.png");
      background-size: 1.28rem;
    }

    .msg_num {
      position: absolute;
      top: -0.32rem;
      left: 10px;
      height: 15px;
      line-height: 15px;
      padding: 0.053333rem 0.213333rem;
      background: rgba(255, 75, 75, 0.9);
      color: #fff;
      font-size: 0.64rem;
      -webkit-transform: scale(0.75);
      transform: scale(0.75);
      border-radius: 0.32rem;
    }

    /* 轮播 */
    .van-swipe__indicator--active {
      background-color: $mc_color;
    }

    .swipe_wrap {
      padding-top: 3.12rem;
      // height: 6.133333rem;
      background: #fff;
    }

    .swipe_img {
      width: 100%;
      height: 100%;
    }
  }
</style>
