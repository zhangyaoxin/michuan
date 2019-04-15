<template>
  <div class="user_ad_list">
    <ad-list ref="adList" :searchCond="searchCond"></ad-list>
  </div>
</template>

<script>
  import adList from '@@/ad_list'
  import { mapState } from 'vuex'
  import { setPagesTitle } from '@/utils/utils'
  export default {
    name: 'user_ad_list',
    components: { adList },
    data () {
      return {
        searchCond: {}
      }
    },
    computed: {
      ...mapState({
        userId: state => state.userInfo.id
      }),
    },
    methods: {},
    mounted () {
      let id = this.$route.query.id || this.userId
      const name = this.$route.query.nickname + '的发布'
      if (id !== this.userId) {
        setPagesTitle(name)
      }
      this.searchCond = {
        user_id: id,
      }
      this.$nextTick(() => {
        this.$refs.adList.page = 1
        this.$refs.adList.getAdList()
      })
    }
  }
</script>

<style lang="scss">
  .user_ad_list {
    .ad_list_warp .nothing_wrap {
      top: 35%;
    }
  }
</style>
