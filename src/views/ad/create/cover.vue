<template>
  <div class="cover_tem">
    <van-uploader class="no_add" :after-read="uploadCover" v-if="!curCoverUrl">
      <img src="../../../assets/images/pur_cover_icon.png" alt="">
      <span>添加封面图片</span>
    </van-uploader>

    <section class="cover_wrap" v-else>
      <div class="editor_ops">
        <div class="editor_ops_item" @click="del">
          <img src="../../../assets/images/editor_del_icon.png" alt="">
          <span>删除</span>
        </div>
        <div class="editor_ops_item" @click="isAddLinkImg = true">
          <img src="../../../assets/images/editor_link_icon.png" alt="">
          <span>链接</span>
        </div>
        <div class="editor_ops_item">
          <van-uploader :after-read="uploadCover">
            <img src="../../../assets/images/editor_replace_icon.png" alt="">
            <span>替换</span>
          </van-uploader>
        </div>
      </div>
      <img :src="curCoverUrl|filterImg" alt="">
    </section>

    <!-- 裁剪 -->
    <!-- <crop-wrap :isCrop.sync="isCrop" :imgUrl="cropImg" :aspectRatio="aspectRatio" @cropDown="curCoverUrl = $event"></crop-wrap> -->

    <!-- 链接 -->
    <img-link :isAddLinkImg.sync="isAddLinkImg" :curImgLink="curCoverLink" @editLink="curCoverLink=$event"></img-link>
  </div>
</template>

<script>
  import cropWrap from '@@/crop'
  import imgLink from '@@/ad_put/add_img_link'

  import { mapState } from 'vuex'

  export default {
    name: 'cover',
    components: { cropWrap, imgLink },
    data () {
      return {
        // isCrop: false,
        // cropImg: '',
        // aspectRatio: 3 / 2,

        isAddLinkImg: false,
      }
    },
    computed: {
      curCoverUrl: {
        get () {
          return this.$store.state.ad.thumbnail.url
        },
        set (val) {
          this.$store.commit('changeAd', { type: 'thumbnail', stype: 'url', val })
        }
      },
      curCoverLink: {
        get () {
          return this.$store.state.ad.thumbnail.link
        },
        set (val) {
          this.$store.commit('changeAd', { type: 'thumbnail', stype: 'link', val })
        }
      }
    },

    methods: {
      uploadCover (file) {
        this.$router.replace({ path: 'cover_crop', query: { ...this.$route.query, img: file.content } })
      },

      del () {
        this.curCoverUrl = ''
      }
    },
    created () { },

  }
</script>

<style  lang="scss">
  .cover_tem {
    padding: 0.8rem;
    background: #fff;
    .no_add {
      box-sizing: border-box;
      width: 100%;
    }
  }
  // 封面
  .cover_wrap {
    position: relative;
    img {
      width: 100%;
    }
  }
</style>
