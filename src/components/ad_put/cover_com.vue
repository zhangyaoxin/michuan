<template>
  <div class="cover_com">
    <!-- 裁剪 -->
    <crop-wrap :isCrop.sync="isCrop" :imgUrl="cropImg" :aspectRatio="aspectRatio" @cropDown="curCoverUrl = $event"></crop-wrap>
  </div>
</template>

<script>
  import cropWrap from '@@/crop'
  export default {
    name: 'cover_com',
    components: { cropWrap },
    data () {
      return {
        isCrop: false,
        cropImg: '',
        aspectRatio: 3 / 2,
      }
    },
    computed: {
      curCoverUrl: {
        get () {
          return this.$store.state.ad.thumbnail.url
        },
        set (val) {
          this.$store.commit('changeAd', { type: 'thumbnail', stype: 'url', val })
          const query = this.$route.query
          delete query.img
          this.$router.replace({ path: 'create_ad', query: { ...query, isEdit: true } })
        }
      },
    },
    methods: {},
    created () {
      this.cropImg = this.$route.query.img
      this.isCrop = true
    }
  }
</script>

<style scoped lang="scss">
</style>
