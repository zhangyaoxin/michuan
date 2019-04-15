<template>
  <div class="test">
    <van-uploader :after-read="onRead">
      上传图片
    </van-uploader>
    <img :src="cropImg" alt="">

    <!-- 裁剪图片 -->
    <crop-wrap :isCrop.sync="isCrop" :imgUrl="imgUrl" @cropDown="cropImg = $event"></crop-wrap>
  </div>
</template>

<script>
  import cropWrap from '@@/crop'
  import Compress from '@/assets/js/compress'
  export default {
    name: 'test',
    components: { cropWrap },
    data () {
      return {
        isCrop: false,
        imgUrl: '',
        cropImg: ''
      }
    },
    methods: {
      async onRead ({ file }) {
        const res = await new Compress().compress(file, 0.4, false)
        console.log(res)
        // this.imgUrl = file.content
        // this.isCrop = true
      }
    },
  }
</script>

<style  lang="scss"></style>
