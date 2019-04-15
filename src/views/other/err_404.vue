<template>
  <div class="err_404">
    <div class="find">
      <p>您浏览的页面被发到火星上啦！</p>
      <router-link to="feed_back">反馈到蜜传客服</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'err_404',
    components: {},
    data () {
      return {}
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .err_404{
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-size: 73% 100%;
    background: url(../../assets/images/nopage.png);
    background-repeat: no-repeat;
    background-size: cover;
    margin: 0;
    padding: 0;
  }
  .find p{
      color: #fff;
      font-weight: bold;
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 62%;
      font-size: 14px;
      font-weight: normal;
  }
  .find a{
      position: absolute;
      bottom:51%;
      left:25%;
      font-size:16px;
      color:#29265c;
      display: block;
      background: url(../../assets/images/buttonY.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 181px;
      height: 48px;
      line-height: 41px;
      text-align: center;
  }
</style>
