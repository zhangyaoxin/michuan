<template>
  <div class="user_list_tem">
    <van-pull-refresh v-model="isLoadRefresh" @refresh="refreshList">
      <van-list v-model="isLoading" :finished="isFinished" @load="pullList" :immediate-check="false">
        <div class="user_item van-hairline--bottom" v-for="(item,index) in userList" :key="index">

          <router-link :to="{path:'me_index',query:{id:item.users.id}}" class="user_avatar">
            <img :src="item.users.thumbnail|filterImg('avatar')" alt="">
          </router-link>

          <router-link :to="{path:'me_index',query:{id:item.users.id}}" class="user_info">
            <div class="user_nickname">{{item.users.nickname}}</div>
            <div class="user_desc">
              <!-- <div class="user_level font_size_10">{{item.badges[0]|filterLevel}}</div> -->
              <span class="user_num">粉丝 {{item.fans_total_fans}}</span>
            </div>
          </router-link>

          <div class="user_btn_wrap">
            <router-link to="login" class="user_btn" v-if="!isLogin">关注</router-link>

            <div class="user_btn" :class="{'attent':item.is_concern===1}" v-if="isLogin&&item.is_concern!==-1" @click="attentBtn(item.is_concern,item.users.id,index)">{{item.is_concern===1?'已关注':'关注'}}</div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <div class="no_fans_wrap" v-if="nothing">
      <div v-if="curType===1">
        <img class="nothing_icon" src="../assets/images/no_attent.png" alt="">
        <p class="fans_title">暂无关注的好友~</p>
        <p>No attention friends</p>
      </div>

      <div v-if="curType===2">
        <img class="nothing_icon" src="../assets/images/no_fans.png" alt="">
        <p class="fans_title">暂无粉丝关注您～</p>
        <p>No fans follow you</p>
      </div>
    </div>

    <!-- 滚动到顶部 -->
    <go-top></go-top>
  </div>
</template>

<script>

  import goTop from '@@/go_top'
  import { mapState } from 'vuex'
  import { getStore } from '@/utils/utils'
  export default {
    name: 'user_list',
    components: { goTop },
    props: {
      params: Object
    },
    data () {
      return {
        curId: '',
        curApi: '',
        curType: 1,

        page: 1,
        isLoading: false,
        isFinished: false,
        isLoadRefresh: false,

        userList: [],

        nothing: false
      }
    },
    filters: {
      filterLevel (obj) {
        return obj ? obj.name : 'Lv0'
      },
      filterBadge (obj, type) {
        if (obj && obj.thumbnail) return obj.thumbnail
        return type
      }
    },
    computed: {
      ...mapState({
        isLogin: state => state.isLogin,
        userId: state => state.userInfo.id
      })
    },
    methods: {
      refreshList () {
        console.log('下拉刷新')
        this.isLoadRefresh = true
        this.page = 1
        this.getUserList()
      },

      pullList () {
        console.log('上拉加载')
        this.page++
        this.$emit('pullUpLoad', this.page)
        this.getUserList()
      },

      // 获取关注或粉丝列表
      getUserList () {
        // 搜索中需要传keyword
        const { api, id, keyword } = this.params
        const page = this.page
        if (page === 1) this.userList = []
        console.log(api, id)
        this.$api[api](id, { page, keyword })
          .then(data => {
            this.isLoadRefresh = false
            this.isLoading = false
            if (data.status) {
              // if (!keyword) {
              for (let it of data.data.data) {
                const { concerns, fans } = it
                it.users = concerns || fans || it
              }
              // }

              console.log(data.data.data)

              this.userList.push(...data.data.data)
              if (data.data.total / data.data.per_page <= page) {
                this.isFinished = true
              } else {
                this.isFinished = false
              }

              if (this.userList.length === 0) {
                this.nothing = true
              } else {
                this.nothing = false
              }
            }
          })
          .catch(err => {
            this.isLoadRefresh = false
            this.isLoading = false
            this.isFinished = true
          })
      },

      // 关注或取消关注
      async attentBtn (isAtten, id, i) {
        console.log(isAtten)
        const type = isAtten === 0 ? 1 : 0
        const concern_id = this.userId
        const concerned_id = id
        const res = await this.$store.dispatch('changeAttent', { concern_id, concerned_id, type })
        if (res) {
          this.userList[i].is_concern = type
        }
      }
    },

    created () { }
  }
</script>

<style lang="scss">
  @import "../assets/css/var";

  .user_list_tem {
    background: #fff;
    .user_item {
      display: flex;
      align-items: center;
      padding: 0.533333rem 0.8rem;
    }

    .user_avatar {
      margin-right: 0.533333rem;
      width: 2.133333rem;
      height: 2.133333rem;
      border-radius: 100%;
      background: #f4f4f4;
      overflow: hidden;
    }

    .user_avatar img {
      width: 100%;
    }

    .user_info {
      flex: 1;
    }

    .user_desc {
      display: flex;
      align-items: center;
      font-size: 0.64rem;
      color: #999;
    }

    .user_nickname {
      width: 11rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 0.853333rem;
    }

    .user_level {
      margin-right: 0.533333rem;
      font-size: 0.64rem;
      height: 0.96rem;
      line-height: 0.96rem;
      padding: 0 0.413333rem;
      background: #f4f4f4;
      border-radius: 0.106667rem;
    }

    .user_btn {
      display: block;
      width: 3.2rem;
      height: 1.333333rem;
      line-height: 1.333333rem;
      box-sizing: border-box;
      padding-left: 1.42rem;
      font-size: 0.64rem;
      background: $mc_color url("../assets/images/attention_add.png") no-repeat
        22% 50%;
      background-size: 0.64rem;
      color: #fff;
      border-radius: 0.106667rem;
    }

    .user_btn.attent {
      background: #fff url("../assets/images/attention.png") no-repeat 7% 50%;
      background-size: 0.64rem;
      padding-left: 1rem;
      border: 0.053333rem solid #999;
      color: #999;
    }

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
  }
</style>
