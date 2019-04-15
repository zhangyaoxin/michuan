<template>
  <van-popup class="crop_wrap" v-model="isCropMd" position="right" :overlay="false">
    <div class="img_wrap">
      <img id="crop_img" :src="imgUrl" alt="">
    </div>
    <div class="crop_scale">
      <i class="iconfont" @click="scale(-1)">&#xe614;</i>
      <i class="iconfont" @click="scale(1)">&#xe615;</i>
    </div>
    <div class="crop_btn">
      <div @click="cancelCrop">取消</div>
      <div style="width=18px;"> <i class="iconfont">&#xe606;</i></div>
      <div @click="handleCrop">确定</div>
    </div>
  </van-popup>
</template>

<script> 
  import Compress from '@/assets/js/compress'
  export default {
    name: 'crop_wrap',
    components: {},
    props: {
      isCrop: Boolean,
      imgUrl: String,
      isCover: {
        type: Boolean,
        default: false
      },
      aspectRatio: {
        type: Number,
        val: NaN
      }
    },
    data () {
      return {
        cropper: null
      }
    },
    computed: {
      isCropMd: {
        get () {
          if (this.isCrop) {
            setTimeout(() => {
              this.initCrop()
            }, 0);
          }
          return this.isCrop
        },
        set (val) {
          this.$emit('update:isCrop', val)
          if (!val) {
            this.cropper.destroy()
          }
        }
      }
    },

    methods: {
      initCrop () {
        console.log(this.isCover, 'isCoverisCover')
        const image = document.querySelector('#crop_img')
        console.log(image)
        this.cropper = new Cropper(image, {
          // 属性
          viewMode: 2,       // 0 1 2 3 
          dragMode: 'move',  // cropper move
          aspectRatio: this.aspectRatio,  // 宽高比 
          autoCrop: true,
          autoCropArea: 1, // 自动裁剪区域大小（百分比）
          background: false, // 网格背景
          // 事件
          ready: () => {
            console.log('初始化成功')
          },
          cropstart: function () {
            // console.log(11111111)
          },
          cropmove: function () {
            // console.log(22222222)
          },
          cropend: function () {
            // console.log(333333333)
          },
          cropper: function () {
            // console.log(44444444)
          },
          zoom: function () {
            // console.log(5555555)
          }
        });
      },
      // 缩放
      scale (type) {
        const { scaleX, scaleY } = this.cropper.getData()
        if (type === -1 && scaleX <= 1) return false
        const x = scaleX + type
        const y = scaleX + type
        this.cropper.scale(x, y)
      },

      cancelCrop () {
        if (this.$route.name === 'cover_crop') {
          const query = this.$route.query
          console.log(query, 'opopopopopoopopopo')
          delete query.img
          this.$router.replace({ path: 'create_ad', query: { ...query, isEdit: true } })
        } else {
          this.isCropMd = false
        }
      },

      handleCrop () {
        console.log('裁剪')
        this.cropper.getCroppedCanvas({ fillColor: '#fff' }).toBlob(async blob => {
          const compressRes = await new Compress().compress(blob, 0.4, false)
          const res = await this.$store.dispatch('upLoadQIniu', blob)
          this.$emit('cropDown', res)
          this.isCropMd = false
        })

      }
    },
  }
</script>

<style lang="scss">
  .crop_wrap {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    .img_wrap {
      width: 100%;
      height: 100%;
    }
    .cropper-modal {
      opacity: 0.9;
    }
    .crop_scale {
      position: absolute;
      bottom: 65px;
      left: 15px;
      z-index: 999;
      .iconfont {
        margin-right: 25px;
      }
    }
    .iconfont {
      color: #fff;
      font-size: 18px;
    }
    .crop_btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: absolute;
      bottom: 0;
      padding: 0 15px;
      width: 100%;
      height: 48px;
      text-align: center;
      box-sizing: border-box;
      color: #fff;
    }
  }
</style>
