<template>
  <div class="msg_detail">
    <van-pull-refresh v-model="isLoadRefresh" @refresh="refreshList">
      <van-list v-model="isLoading" :finished="isFinished" @load="pullList" :immediate-check="false">
        <div class="item" v-for="(item,index) in msgList" :key="index">
          <div class="item_info van-hairline--bottom">
            <div class="top">
              <div class="title">{{item.title}}</div>
              <div class="time">{{item.created_at}}</div>
            </div>
            <div class="bottom">{{item.content}}</div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <div class="nothing_wrap" v-if="nothing">
      <img class="nothing_icon" src="../../../assets/images/noNews.png" alt="">
      <p class="fans_title">暂时没有消息</p>
      <p>No news for the time being</p>
    </div>

    <!-- 滚动到顶部 -->
    <go-top></go-top>
  </div>
</template>

<script>
  import goTop from '@@/go_top'

  export default {
    name: 'msg_detail',
    components: { goTop },
    data () {
      return {
        page: 0,
        msgList: [],

        isLoadRefresh: false,
        isLoading: false,
        isFinished: false,

        nothing: false
      }
    },
    methods: {
      // 获取消息类别下的消息列表
      getMsgTypeDetail () {
        const page = this.page
        if (page === 1) this.msgList = []
        const type = this.curType
        this.$api.getMsgTypeDetail(type)
          .then(data => {
            this.isLoading = false
            this.isLoadRefresh = false
            console.log('获取消息类别下的消息列表 ==>', data)
            if (data.status) {
              this.msgList.push(...data.data.data)
              if (data.data.total / data.data.per_page <= page) {
                this.isFinished = true
              } else {
                this.isFinished = false
              }

              if (this.msgList.length === 0) {
                this.nothing = true
              }else {
                this.nothing = false
              }
            } else {
              this.isLoadRefresh = false
              this.isLoading = false
              this.isFinished = true
              this.$toast(data.msg)
            }
          })
          .catch(err => {
            this.isLoadRefresh = false
            this.isLoading = false
            this.isFinished = true
          })
      },

      refreshList () {
        this.page = 1
        console.log('下拉刷新')
        this.isLoadRefresh = true
        this.getMsgTypeDetail()
      },
      pullList () {
        console.log('上拉加载')
        this.page++
        this.getMsgTypeDetail()
      },

      // 一键已读
      getMsgReadAll () {
        const type = this.curType
        this.$api.getMsgReadAll(type)
          .then(data => {
            console.log(data)
          })
      }
    },
    created () {
      const type = this.$route.query.type
      this.curType = type
      this.getMsgTypeDetail()
      this.getMsgReadAll()
    }
  }
</script>

<style scoped lang="scss">
  .msg_detail {
    .item {
      padding-left: 0.8rem;
      background: #fff;
    }

    .item_info {
      padding: 0.8rem 0.8rem 0.8rem 0;
      color: #999;
      font-size: 12px;
    }

    .top {
      display: flex;
      align-items: center;
    }

    .title {
      flex: 1;
      font-size: 16px;
      color: #333;
    }
  }
</style>
