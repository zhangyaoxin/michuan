<template>
  <div class="me_browse">
    <ad-list ref="adList" :searchCond="searchCond" @changeEvent="getMyBrowse"></ad-list>
  </div>
</template>

<script> 
  import adList from '@@/ad_list'

  import { mapState } from 'vuex'
  export default {
    name: 'me_browse',
    props: {},
    components: { adList },
    data () {
      return {
        searchCond: {
          my_browse: 1
        },
      }
    },
    computed: {
      ...mapState({
        isLogin: state => state.isLogin
      }),
    },
    methods: {
      getMyBrowse () {
        if (this.isLogin) {
          this.$nextTick(() => {
            this.$refs.adList.page = 1
            this.$refs.adList.getAdList()
          })
        } else {
          this.$refs.adList.getBrowseHistory()
        }
      }
    },
    mounted () {
      this.getMyBrowse()
    }
  }
</script>

<style lang="scss">
  .me_browse {
    .ad_list_warp .nothing_wrap {
      top: 35%;
    }
  }
</style>
