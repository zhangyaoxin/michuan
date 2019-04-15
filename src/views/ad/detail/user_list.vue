<template>
  <div class="browse_user_list">
    <van-list v-model="isLoading" :finished="isFinished" :offset="10" @load="pullList" :immediate-check="false">
      <div class="title_border_left">
        <div>{{title}}(人)</div>
        <div class="reward_desc_count" v-if="title === '用券明细'">
          <div>用券人数 {{sentCouponCount}}</div>
        </div>
        <div class="reward_desc_count" v-else>
          <div>浏览 {{browseCount}}</div>
          <div>分享 {{shareCount}}</div>
          <div>被抢 {{robCount}}</div>
          <div class="rob_icon" @click="robTip">
            <van-icon name="question-o" />
          </div>
        </div>
      </div>
      <div class="reward_desc_list" :class="{'max_height':isMaxHeight}">
        <div v-for="(item,index) in userList" :key="index">
          <div class="reward_desc_item van-hairline--bottom">

            <router-link :to="{path:'me_index',query:{id:item.user_id||item.user.id}}" class="reward_user_avatar">
              <img :src="item.user.thumbnail|filterImg('avatar')" alt="">
            </router-link>

            <div class="reward_user_info">
              <div class="reward_user_desc">
                <router-link :to="{path:'me_index',query:{id:7}}" class="reward_user_nickname">{{item.user.nickname}}
                </router-link>
                <div class="reward_user_num">{{item.type_name}}</div>
                <div class="reward_user_num" v-if="title === '用券明细'">{{item.type===1?Number(item.amount)+' 元':Number(item.amount)+' 折'}}</div>
                <!-- <div class="reward_user_num">{{item.trade_num|filterFm}} 蜂蜜</div> -->
              </div>

              <div class="reward_time_type">
                <div class="reward_time">{{item.time}}</div>
                <div class="reward_type" v-if="title === '用券明细'">分享次数 {{item.share_times}}</div>
                <!-- <div class="reward_type">{{item.type_name}}</div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-list>

    <div class="see_more" @click="isMaxHeight=!isMaxHeight" v-if="userList.length>2">
      <span>{{isMaxHeight?'点击查看更多':'点击收起'}}</span>
      <van-icon class="see_more_arrow" :class="{'see_more_arrow_top':!isMaxHeight}" name="arrow" />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'browse_user_list',
    props: {
      title: String,
      api: String,
      curAdId: Number
    },
    data () {
      return {
        page: 1,

        isMaxHeight: true,

        isLoading: false,
        isFinished: false,

        userList: [],

        browseCount: 0,
        shareCount: 0,
        robCount: 0,
        sentCouponCount: 0
      }
    },
    computed: {
      ...mapState({
        userId: state => state.userInfo.id,
        isLogin: state => state.isLogin
      })
    },
    methods: {
      // 获取用户列表
      getUserList () {
        if (!this.isLogin) return false
        const page = this.page
        const api = this.api
        const id = this.curAdId
        const user_id = this.userId
        if (page === 1) {
          this.userList = []
        }
        console.log(user_id, id, api, this.title, 'llllllllllllll')
        this.$api[api]({ id, user_id, page })
          .then(data => {
            console.log(api + '获取用户列表 ==>', data)
            if (data.status) {
              const { browse_count, lists, rob_count, share_count, sent_coupon_count } = data.data.data.data
              console.log(lists, 'lolololoololo')
              if (api === 'getMyCouponList') {
                lists.data.map(it => {
                  it.user = it.user_info
                  it.time = it.created_at
                })
              }

              this.userList.push(...lists.data)
              this.browseCount = browse_count
              this.shareCount = share_count
              this.robCount = rob_count
              this.sentCouponCount = sent_coupon_count

              if (lists.total / lists.per_page <= page) {
                this.isFinished = true
              } else {
                this.isFinished = false
              }
            }
          })
      },

      pullList () {
        this.isLoading = false
        if (!this.isMaxHeight) {
          console.log(this.type)
          console.log('滚动加载')
        }
      },

      robTip () {
        this.$dialog.alert({
          title: '什么是“被抢”',
          message: '分享蜜传悬赏任务链接给您的朋友，但是您的朋友在此之前已经浏览过并且获得了浏览收益，您将无法获得收益，因为分享收益被更早分享的人抢走了；越早分享，越能避免被抢，赶快行动吧！'
        }).then(() => { });
      },
    },
    created () {
      this.getUserList()
    }
  }
</script>

<style lang="scss">
  .browse_user_list {
    margin: 0.533333rem 0;
    background: #fff;
    padding: 0.8rem;

    .title_border_left {
      display: flex;
    }

    .max_height {
      max-height: 6.5rem;
      overflow: hidden;
    }

    .reward_desc_count {
      display: flex;
      align-items: center;
      margin-left: 0.533333rem;
      font-weight: normal;
      color: #666;
      font-size: 0.746667rem;
      margin-left: auto;
      div {
        margin-left: 10px;
      }
      .rob_icon {
        margin-left: 5px;
        height: 21px;
        color: #ff4c4c;
      }
    }

    .reward_desc_item {
      display: flex;
      align-items: center;
      padding: 0.533333rem 0.533333rem 0.533333rem 0;
      font-size: 0.746667rem;
      line-height: 0.96rem;
    }

    .reward_user_avatar {
      margin-right: 0.533333rem;
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 0.213333rem;
      overflow: hidden;
    }

    .reward_user_avatar img {
      width: 100%;
    }

    .reward_user_info {
      flex: 1;
    }

    .reward_user_desc {
      display: flex;
    }

    .reward_user_nickname {
      flex: 1;
      max-width: 8rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .reward_user_num {
      margin-left: auto;
      color: #ff4c4c;
      font-weight: 600;
    }

    .reward_time_type {
      display: flex;
      color: #999;
    }

    .reward_time {
      flex: 1;
      font-size: 0.64rem;
    }

    .reward_type {
      font-size: 0.64rem;
    }

    .see_more {
      padding-right: 0.8rem;
      height: 2.666667rem;
      line-height: 2.666667rem;
      text-align: center;
      font-size: 0.746667rem;
      color: #c4c4c4;
      font-weight: 600;
    }

    .see_more_arrow {
      transform: rotate(90deg) translate(1px, -2px);
      font-size: 12px;
    }

    .see_more_arrow_top {
      transform: rotate(-90deg) translate(-1px, 2px);
    }
  }
</style>
