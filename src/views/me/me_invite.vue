<template>
  <div class="me_invite">
    <img class="invite_bg" src="../../assets/images/invite_bg.png" alt="">
    <div class="qrCode_wrap">
      <div class="qr_desc">您的专属邀请码123456</div>
      <div class="qrCode">
        <div id="qrcode">
          <img  src="../../assets/images/qrCode.png" alt=""/>
        </div>
      </div>
      <div class="qr_donload">扫码下载蜜传APP</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    components: {},
    data () {
      return {}
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .me_invite{
    position: relative;
  }
  .invite_bg {
    width: 100%;
  }
  .qrCode_wrap {
    position: absolute;
    bottom: 1.613333rem;
    width: 100%;
    text-align: center;
    font-size: 1.12rem;
    color: #f7ff7c;
  }
  #qrcode img {
    width: 100%;
  }
  .qrCode {
    margin: 0.746667rem auto .2rem;
    padding: .453333rem;
    box-sizing: border-box;
    width: 7.466667rem;
    height: 7.573333rem;
    background: #f67767;
    border-radius: .266667rem;
  }
  #qrcode {
    background: #fff;
    padding: 0rem;
    box-sizing: border-box;
  }
  .qr_desc{
    width: 14.613333rem;
    height: 1.973333rem;
    line-height: 1.973333rem;
    border-radius: 2.666667rem;
    background: #f67767;
    color: #fff;
    font-size: 1.12rem;
    margin: 0 auto;
  }
  .qr_donload{
    width: 14.613333rem;
    line-height: 1rem;
    color: #fff;
    font-size: 0.8rem;
    margin: 0 auto;
  }
</style>
