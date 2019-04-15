<template>
  <div class="download">
    <div class="top"></div>

    <div class="button">
      <div class="android" v-if="isAndroid">
        <div class="btn" v-if="isWxBrowse">
          <img src="../../assets/images/android_icon.png" alt="">
          <span @click="isDownloadTip=true">android版下载</span>
        </div>

        <a class="btn" :href="link" v-else>
          <img src="../../assets/images/android_icon.png" alt="">
          <span>android版下载</span>
        </a>

        <div class="slogan">
          <div class="slogan_icon slogan_left"></div>
          <div>赚钱省钱上蜜传</div>
          <div class="slogan_icon slogan_right"></div>
        </div>
      </div>

      <div class="ios" v-else>
        <div class="btn">
          <img src="../../assets/images/ios_icon.png" alt="">
          <router-link to="home">直接打开蜜传</router-link>
        </div>

        <div class="qrcode_warp">
          <div class="qrcode">
            <img src="../../assets/images/download_mc.png" alt="">
          </div>

          <div class="tip">
            <p>为了方便您下次访问</p>
            <p>请长按识别二维码关注“蜜传”公众号</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 下载提示 -->
    <van-popup v-model="isDownloadTip" position="top" :close-on-click-overlay="false" class="download_tip_wrap">
      <img style="width:291px; margin: auto;margin-top:10px;display: block;" src="../../assets/images/download_tip_title.png" alt="">
      <img style="display: block;width:99px;margin:40px auto;" src="../../assets/images/download_tip_btn.png" alt="" @click="isDownloadTip=false">
    </van-popup>
  </div>
</template>

<script>
  import { browserVersions, isWechatrBrowse } from '@/utils/utils'

  export default {
    name: 'download',
    components: {},
    data () {
      return {
        isIos: false,
        isAndroid: false,
        isWxBrowse: false,

        link: '',

        isDownloadTip: false
      }
    },
    methods: {
      // 获取app下载链接
      getAppDownloadLink () {
        this.$api.getAppDownloadLink()
          .then(data => {
            console.log('获取app下载链接 ==>', data)
            if (data.status) {
              this.link = data.data.app_download_url
            }
          })

      },
    },
    created () {
      const res = browserVersions()
      this.isIos = res.ios
      this.isAndroid = res.android
      this.isWxBrowse = isWechatrBrowse()
      if (this.isAndroid) {
        this.getAppDownloadLink()
      }
    }
  }
</script>

<style lang="scss">
  .download {
    padding-top: 40px;
    height: 100%;
    box-sizing: border-box;
    background: #fff;

    .top {
      margin: auto;
      width: 220px;
      height: 192px;
      background: url("../../assets/images/download_logo.png");
      background-size: 220px 192px;
    }

    .button {
      position: relative;
      height: calc(100% - 192px);
      background: #fff5f5 url("../../assets/images/download_bottom_bg.png")
        no-repeat;
      background-size: contain;
    }

    .btn {
      position: absolute;
      top: 40%;
      left: 50%;
      margin-left: -142px;
      width: 284px;
      height: 68px;
      line-height: 68px;
      text-align: center;
      background: #ff4c4c;
      border-radius: 10px;
      font-size: 24px;
      color: #fff;
      a {
        color: #fff;
      }
      img {
        position: relative;
        top: 9px;
        margin-right: 20px;
        width: 48px;
      }
    }
    .ios {
      .btn {
        top: 32%;
      }
      img {
        top: 7px;
      }
    }

    .slogan {
      display: flex;
      align-items: center;
      position: absolute;
      top: 80%;
      left: 50%;
      margin-left: -105px;
      width: 210px;
      font-size: 20px;
      color: #ff4c4c;
    }
    .slogan_icon {
      margin: 0 9px;
      width: 17px;
      height: 25px;
      background: url("../../assets/images/slogan_left.png");
      background-size: 17px 25px;
    }
    .slogan_right {
      background: url("../../assets/images/slogan_right.png");
      background-size: 17px 25px;
    }

    .qrcode_warp {
      position: absolute;
      top: 58%;
      left: 50%;
      width: 272px;
      margin-left: -136px;
    }

    .qrcode {
      margin: auto;
      width: 116px;
      height: 116px;
      img {
        width: 100%;
      }
    }

    .tip {
      margin-top: 10px;
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      color: #000;
    }

    .download_tip_wrap {
      background: transparent;
    }
    .van-modal {
      background-color: rgba(0, 0, 0, 0.8);
    }
  }
</style>
