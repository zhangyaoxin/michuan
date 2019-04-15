<template>
  <div class="related_users">
    <user-list ref="user_list" :params="params"></user-list>
  </div>
</template>

<script>
  import userList from '@@/user_list'

  import { mapState } from 'vuex'
  import { setPagesTitle } from '@/utils/utils'
  export default {
    name: '',
    components: { userList },
    data () {
      return {
        params: {
          id: '',
          keyword: '',
          api: 'getSearchUser'
        }
      }
    },
    computed: {
      ...mapState({
        userId: state => state.userInfo.id
      }),
    },
    mounted () {
      const keyword = this.$route.query.search
      const name = '搜索' + keyword + '相关用户'
      setPagesTitle(name)
      console.log(this.userId, 'this.userIdthis.userIdthis.userId')
      this.params.id = this.userId
      this.params.keyword = keyword
      this.$refs.user_list.page = 1
      this.$nextTick(() => {
        this.$refs.user_list.getUserList()
      })
    }
  }
</script>

<style scoped lang="scss">
</style>
