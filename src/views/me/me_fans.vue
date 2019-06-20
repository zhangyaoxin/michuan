<template>
  <div class="me_fans">
    <user-list ref="user_list" :params="params"></user-list>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { setPagesTitle } from '@/utils/utils'
  import userList from '@@/user_list'
  export default {
    name: 'me_fans',
    components: { userList },
    data () {
      return {
        params: {
          id: '',
          api: 'getUserFansList'
        }
      }
    },
    computed: {
      ...mapState({
        userId: state => state.userInfo.id
      }),
    },
    methods: {},
    mounted () {
      const id = this.$route.query.id || this.userId
      if (id != this.userId) {
        const name = this.$route.query.nickname + '的粉丝'
        setPagesTitle(name)
      }
      this.params.id = id
      this.$refs.user_list.page = 1
      this.$refs.user_list.curType = 2
      this.$nextTick(() => {
        this.$refs.user_list.getUserList()
      })
    }
  }
</script>

<style lang="scss">
  .no_fans_wrap {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translateX(-50%);
    width: 9.013333rem;
    font-size: 0.746667rem;
    color: #999;
    text-align: center;
    background: #f4f4f4;
  }

  .nothing_icon {
    width: 100%;
    height: 9.093333rem;
  }

  .fans_title {
    margin-top: 1.333333rem;
    margin-bottom: 0.693333rem;
    color: #666;
    font-size: 0.853333rem;
  }
</style>
