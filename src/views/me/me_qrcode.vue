<template>
  <div class="me_qrcode_wrap">
    <div class="me_qrcode">
      <div class="qrcode_user">
        <div class="user_nickname">{{userInfo.nickname}}</div>
        <div class="user_avatar">
          <img :src="userInfo.thumbnail|filterImg" alt="">
        </div>
      </div>

      <div class="qrcode_wrap">
        <div id="qrcode"> </div>
        <div class="mc_logo">
          <img src="http://www.oldda.cn/Fua890ivOlU-OmCxVfGh57H0AAdG" alt="">
        </div>
      </div>

      <div class="qrcode_mc">微信扫一扫 看我的蜜传主页</div>
    </div>

    <div class="tip">长按保存二维码</div>
  </div>
</template>

<script>
  import html2canvas from '@@@/html2canvas.min.js'
  import { mapState, mapGetters } from 'vuex'
  export default {
    name: 'me_qrcode',
    components: {},
    data () {
      return {}
    },
    computed: {
      ...mapState({
        h5BaseUrl: state => state.h5BaseUrl,
        userInfo: state => state.userInfo
      }),
    },
    methods: {
      async createdImg () {
        const res = await this.drawCanvas(document.querySelector('.me_qrcode'))
        const url = await this.canvasResizeToFile(res, 1)

        const img = await this.fileToDataUrl(url)
        const imgWrap = document.createElement('img')
        imgWrap.src = img
        imgWrap.onload = () => {
          document.querySelector('.me_qrcode').innerHTML = ''
          document.querySelector('.me_qrcode').appendChild(imgWrap)
          document.querySelector('.me_qrcode').style.border = 'none'
        }
      },

      //将传入值转为整数
      parseValue (value) {
        return parseInt(value, 10);
      },
      // 根据window.devicePixelRatio获取像素比
      DPR () {
        if (window.devicePixelRatio && window.devicePixelRatio > 1) {
          return window.devicePixelRatio;
        }
        return 1;
      },

      //绘制canvas
      async  drawCanvas (selector) {
        // 获取想要转换的 DOM 节点
        // const dom = document.querySelector(selector);
        const dom = selector
        const box = window.getComputedStyle(dom);
        // DOM 节点计算后宽高
        const width = this.parseValue(box.width);
        const height = this.parseValue(box.height);
        // 获取像素比
        const scaleBy = this.DPR();
        // 创建自定义 canvas 元素
        const canvas = document.createElement('canvas');

        // 设定 canvas 元素属性宽高为 DOM 节点宽高 * 像素比
        canvas.width = width * scaleBy;
        canvas.height = height * scaleBy;
        // 设定 canvas css宽高为 DOM 节点宽高
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        // 获取画笔
        const context = canvas.getContext('2d');

        // 将所有绘制内容放大像素比倍
        context.scale(scaleBy, scaleBy);

        // 将自定义 canvas 作为配置项传入，开始绘制
        return await html2canvas(dom, { canvas, useCORS: true });
      },

      // Canvas ==> File
      canvasResizeToFile (canvas, quality) {
        return new Promise(resolve => {
          return canvas.toBlob(file => {
            resolve(file)
          }, 'image/jpeg', quality)
        })
      },

      // File ==> dataUrl
      fileToDataUrl (file) {
        return new Promise(resolve => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function () {
            resolve(this.result)
          }
        })
      }
    },
    created () { },
    mounted () {
      const url = this.h5BaseUrl + '/#/me_index?id=' + this.userInfo.id
      console.log(url, 'urlurlurlrulrulrulurlurlurlurlurl')
      const qrcode = new QRCode(document.getElementById("qrcode"), {
        width: 253,
        height: 253
      });
      qrcode.makeCode(url);
      this.createdImg()
    }
  }
</script>

<style lang="scss">
  .me_qrcode_wrap {
    padding-top: 50px;
    height: 100%;
    box-sizing: border-box;
    background: #fff;
    .me_qrcode > img {
      width: 100%;
    }
    .me_qrcode {
      margin: 0 auto 20px;
      width: 316px;
      box-shadow: 0px 0px 20px 0px rgba(51, 51, 51, 0.08);
      border-radius: 8px;
      border: solid 1px #e8e8e8;
    }

    .qrcode_user {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 30px 12px 30px;
      font-size: 18px;
      color: #000;
      border-bottom: 0.053rem solid #e8e8e8;
    }

    .user_avatar {
      width: 47px;
      height: 47px;
      border-radius: 100%;
      overflow: hidden;
    }

    .user_avatar img {
      width: 100%;
    }

    .qrcode_wrap {
      position: relative;
      width: 310px;
      height: 310px;
    }

    #qrcode {
      width: 253px;
      height: 253px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .mc_logo {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 65px;
      height: 65px;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.6);
      text-align: center;
      line-height: 106px;
    }
    .mc_logo img {
      margin-top: 5px;
      width: 55px;
      height: 55px;
    }

    .qrcode_mc {
      border-top: 0.053rem solid #e8e8e8;
      padding: 20px 0;
      text-align: center;
      font-size: 12px;
      color: #000;
    }
    .tip {
      font-size: 18px;
      text-align: center;
    }
  }
</style>
