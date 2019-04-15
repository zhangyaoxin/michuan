<template>
  <div class="invite_share">
    <div class="share_header">
      <div class="share_avatar">
        <img :src="headicon">
      </div>
      <div class="share_nickname">
        <div class="share_num">
          昵称:{{nickname}} <span class="col_ff4b4b">邀请码{{invite_num}}</span>
        </div>
        <p>我正在使用蜜传赚蜂蜜,邀请您也来试试!</p>
      </div>
    </div>
    <div class="share_section">
      <img src="../../assets/images/share_bg.png" alt="" />
      <div id="qrcode">
        <img src="/static/img/qrCode.cc247df.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'invite_share',
    components: {},
    data () {
      return {
        headicon: "http://thirdwx.qlogo.cn/mmopen/vi_32/0Jq4diagPd9fiaPXhic7JDggfw3YMdMGicibZRVduZF1lqak8p8ONkFEDJwaeYYK5rk0MKB0iaPdRGH4wFGQzWP3ASrQ/132",
        nickname: '巨熊爱吃草',
        invite_num: '123456',
      }
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .share_header {
    display: flex;
    align-items: center;
    height: 4.8rem;
    background: #fff;
    padding: 0 0.8rem;
  }
  .share_avatar {
    width: 3.733333rem;
    height: 3.733333rem;
    border: 0.106667rem solid #fff;
    border-radius: 100%;
    overflow: hidden;
  }
  .share_avatar img {
    width: 100%;
    height: 100%;
  }
  .share_nickname {
    margin-left: 0.32rem;
    color: #333;
    font-size: 0.853333rem;
  }
  .share_nickname p {
    font-size: 0.746667rem;
    color: #999;
  }
  .col_ff4b4b {
    color: #ff4b4b;
    font-size: 0.746667rem;
  }
  .share_section img {
    width: 100%;
  }
  #qrcode {
    background: #fff;
    padding: 0rem;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 5.066667rem;
    height: 5.066667rem;
    position: absolute;
    bottom: 4.5rem;
    left: 2.5em;
  }
  #qrcode img {
    width: 100%;
  }
  .share_num {
    font-size: 0.8rem;
    font-weight: bold;
  }
</style>
