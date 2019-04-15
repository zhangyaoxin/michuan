<template>
  <div class="put_user_wrap van-hairline--bottom">
    <router-link :to="{path:'me_index',query:{id:7}}" class="put_user_info">
      <div class="user_avatar">
        <img src="https://via.placeholder.com/16/ff4b4b" alt="">
      </div>

      <div class="user_nickname">Lyle</div>

      <div class="user_level">Lv1</div>

      <div class="user_badge">
        <img src="https://via.placeholder.com/19x23/ff4b4b" alt="">
      </div>
      <div class="user_badge">
        <img src="https://via.placeholder.com/19x23/ff4b4b" alt="">
      </div>

      <!-- 预览或自己广告看不见关注 v-if="Number(memberId)!==Number(adInfo.member_id)"-->
      <div class="user_attent" :class="{'attent':isAttentUser}" @click="attentBtn" v-if="isNotPreview">
        <div>Ta的主页</div>
      </div>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'detail_user',
    components: {},
    data () {
      return {}
    },
    methods: {},
  }
</script>

<style lang="scss">
  @import "../../../assets/css/var";

  /* 用户信息 */
  .put_user_wrap {
    display: flex;
    align-items: center;
    padding-bottom: 0.533333rem;
    padding-right: 0.8rem;

    .put_user_info {
      display: flex;
      align-items: center;
    }

    .put_user_info > div {
      margin-right: 0.426667rem;
    }

    .put_user_info > div:last-child {
      margin-right: 0;
    }

    .user_avatar {
      width: 0.853333rem;
      height: 0.853333rem;
      border-radius: 0.106667rem;
      overflow: hidden;
    }

    .user_avatar img {
      width: 100%;
    }

    .user_nickname {
      max-width: 5rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.746667rem;
      color: #333;
    }

    .user_level {
      padding: 0 0.213333rem;
      height: 0.853333rem;
      line-height: 0.853333rem;
      background: #bbbfc7;
      color: #fff;
      font-size: 0.64rem;
      border-radius: 0.106667rem;
    }

    .user_badge {
      width: 1.013333rem;
      height: 1.226667rem;
    }

    .user_badge img {
      width: 100%;
    }

    .user_attent {
      display: flex;
      align-items: center;
      margin-left: auto;
      color: $mc_color;
      font-size: 0.64rem;
    }

    .user_attent.attent {
      color: #999;
    }
  }
</style>
