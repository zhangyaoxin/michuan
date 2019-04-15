<template>
  <div class="ad_manage">
    <!-- tab列表 -->
    <div class="tab_list">
      <van-tabs v-model="curTab" sticky>
        <van-tab v-for="(item,index) in statusList" :title="item.title" :key="index"></van-tab>
      </van-tabs>
    </div>

    <!-- 广告列表 -->
    <van-pull-refresh v-model="isLoadRefresh" @refresh="refreshList">
      <van-list v-model="isLoading" :finished="isFinished" @load="pullList">
        <div class="ad_list">
          <div class="ad_item" v-for="(item,index) in adList" :key="index">
            <div class="ad_info">
              <router-link :to="{path:'ad_details',query:{id:item.id}}" class="ad_base">
                <div class="ad_title" style="-webkit-box-orient: vertical;-moz-box-orient: vertical;box-orient: vertical;">{{item.title||'无题'}}</div>
                <div class="ad_title ad_summary" style="-webkit-box-orient: vertical;-moz-box-orient: vertical;box-orient: vertical;">{{item.sub_title}}</div>
              </router-link>
              <div class="ad_cover">
                <img :src="item.thumbnail.url|filterImg" alt="">
              </div>
            </div>

            <div class="ad_time">
              <div>{{item.created_at|filterTime}}</div>
              <div>
                <img src="../assets/images/browse_icon.png" alt="">
                <span>{{item.total_browse_count | filterViewsNum}}</span>
              </div>
              <div><img src="../assets/images/share_icon.png" alt="">
                <span>{{item.total_share_count | filterViewsNum}}</span>
              </div>
            </div>

            <div class="ad_badge" v-if="item.type!==0">
              <div>累计发放 {{item.total_sent_bvt|filterFm}} 蜂蜜</div>
              <div>预算余额 {{item.left_pre_bvt|filterFm}} 蜂蜜</div>
              <div v-if="item.type===1">浏览奖励 {{item.browse_bvt|filterFm}} 蜂蜜</div>
              <div v-if="item.type===1">分享奖励 {{item.share_bvt|filterFm}} 蜂蜜</div>
              <div v-if="item.type===2">红包总额 {{item.amount|filterFm}} 个</div>
              <div v-if="item.type===2">剩余红包 {{item.left_amount|filterFm}} 个</div>
            </div>

            <div class="ad_ops van-hairline--top">
              <div @click="handleOps(it,item)" v-for="(it,ix) in statusList[curTab].ops" :key="ix">{{it.label}}</div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <div class="nothing_wrap" v-if="nothing">
      <img class="nothing_icon" src="../assets/images/nothing.png" alt="">
      <p class="fans_title">暂无内容～</p>
      <p>no content yet</p>
    </div>

    <!-- 新建发布按钮 -->
    <router-link to="create_ad" replace class="create_btn">
      <i class="iconfont">&#xe626;</i>
      <div class="created_title">添加发布</div>
    </router-link>

    <!-- 新增预算 -->
    <add-buget :isAddBudget.sync="isAddBudget" :curAdId="curAdId"></add-buget>

    <!-- 滚动到顶部 -->
    <go-top></go-top>
  </div>
</template>

<script>
  import addBuget from '@@/ad_put/add_budget'

  import goTop from '@@/go_top'
  import { mapState } from 'vuex'
  export default {
    name: 'ad_manage',
    components: { addBuget, goTop },
    data () {
      return {
        curTab: 1,
        statusList: [
          {
            title: '草稿箱',
            status: 0,
            ops: [
              {
                label: '删除',
                click: 'del'
              },
              {
                label: '复制创建',
                click: 'copyCreate'
              },
              {
                label: '立即上架',
                click: 'shelf'
              },
              {
                label: '编辑',
                click: 'editor'
              },
            ]
          },

          {
            title: '已上架',
            status: 4,
            ops: [
              {
                label: '立即下架',
                click: 'lowerShelf'
              },
              {
                label: '复制创建',
                click: 'copyCreate'
              },
              {
                label: '追加预算',
                click: 'addBudget'
              },
            ]
          },
          {
            title: '已下架',
            status: 7,
            ops: [
              {
                label: '删除',
                click: 'del'
              },
              {
                label: '复制创建',
                click: 'copyCreate'
              },
              {
                label: '立即上架',
                click: 'shelf'
              },
              {
                label: '编辑',
                click: 'editor'
              },
            ]
          }
        ],

        page: 0,

        isLoadRefresh: false,
        isLoading: false,
        isFinished: false,

        curAdId: '',
        adList: [],

        isAddBudget: false,

        nothing: false
      }
    },
    computed: {
      ...mapState({
        userId: state => state.userInfo.id
      }),
      curAdStatus () {
        return this.statusList[this.curTab].status
      }
    },
    watch: {
      curTab () {
        this.page = 1
        this.getAdList()
      }
    },
    methods: {
      // 获取广告列表
      getAdList () {
        const page = this.page
        const user_id = this.userId
        const status = this.curAdStatus
        if (page === 1) this.adList = []
        this.$api.getAdList({ page, user_id, status, own_article: 1 })
          .then(data => {
            console.log('获取广告列表 ==>', data)
            this.isLoadRefresh = false
            this.isLoading = false
            if (data.status) {
              data.data.data.map(it => {
                it.thumbnail = JSON.parse(it.thumbnail) || {}
              })
              this.adList.push(...data.data.data)

              if (data.data.total / data.data.per_page <= page) {
                this.isFinished = true
              } else {
                this.isFinished = false
              }

              if (this.adList.length === 0) {
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

      refreshList () {
        this.page = 1
        console.log('下拉刷新')
        this.isLoadRefresh = true
        this.getAdList()
      },
      pullList () {
        console.log('上拉加载')
        this.page++
        this.getAdList()
      },

      handleOps (ops, item) {
        console.log(item)
        this[ops.click](item)
      },

      // 编辑
      editor (item) {
        this.$router.push({ path: '/create_ad', query: { id: item.id } })
      },

      // 追加预算
      addBudget (item) {
        this.curAdId = String(item.id)
        this.isAddBudget = true
      },

      // 上架
      shelf (item) {
        this.$dialog.confirm({
          message: '确认上架？'
        })
          .then(() => {
            const params = {
              status: 4
            }
            this.$api.editAdInfo(params, item.id)
              .then(data => {
                this.curTab = 1
              })
          })
      },

      // 下架
      lowerShelf (item) {
        this.$dialog.confirm({
          message: '确认下架？'
        })
          .then(() => {
            const params = {
              status: 5
            }
            this.$api.editAdInfo(params, item.id)
              .then(data => {
                this.curTab = 2
              })
          })
      },

      // 删除
      del (item) {
        this.$dialog.confirm({
          title: '删除',
          message: '删除后无法恢复，已分享的页面也无法打开，确认删除？'
        })
          .then(() => {
            this.$api.delAdInfo(item.id)
              .then(data => {
                this.getAdList()
                this.$emit('handleDelNum')
              })
          })
          .catch(() => { });
      },

      copyCreate (item) {
        this.$router.push({ path: '/create_ad', query: { id: item.id, isCopy: true } })
      }
    },
    created () {
      const type = this.$route.query.type || 4
      this.curTab = this.statusList.findIndex(it => it.status == type)
    }
  }
</script>

<style lang="scss">
  .ad_manage {
    img {
      width: 100%;
    }

    .van-tabs--line .van-tabs__wrap {
      height: 46px;
    }
    .van-tab {
      line-height: 46px;
      font-size: 16px;
    }
    .van-tab--active {
      font-weight: bold;
    }

    .tab_list {
      position: fixed;
      top: 0;
      width: 100%;
      // box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.2);
      z-index: 9;
    }
    .ad_list {
      margin-bottom: 2.933333rem;
      padding-top: 44px;
    }
    .ad_item {
      margin-bottom: 0.533333rem;
      padding-left: 0.8rem;
      background: #fff;
    }

    .ad_info {
      display: flex;
      padding: 0.8rem 0.8rem 0 0;
    }
    .ad_base {
      flex: 1;
      margin-right: 1.066667rem;
    }
    .ad_title {
      line-height: 1.1rem;
      font-size: 0.906667rem;
      color: #333;
      font-weight: bold;
      display: -webkit-box;
      display: -moz-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      -webkit-box-orient: vertical;
      -moz-box-orient: vertical;
      box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .ad_summary {
      width: 11.466667rem;
      font-size: 0.64rem;
      font-weight: normal;
      line-height: 14px;
      color: #6c7580;
    }
    .ad_cover {
      width: 5.6rem;
      height: 3.733333rem;
      background: #ccc;
      overflow: hidden;
    }

    .ad_time {
      display: flex;
      font-size: 0.64rem;
      color: #aebbcb;
      div {
        margin-right: 15px;
      }
      img {
        position: relative;
        top: 7px;
        width: 15px;
        height: 10px;
      }
    }
    .ad_badge {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;
      font-size: 12px;
      color: #b6b6b6;
      line-height: 14px;
      div {
        width: 50%;
      }
    }

    .ad_ops {
      padding: 0.8rem 0.8rem 0.8rem 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      div {
        padding: 0px 12px;
        line-height: 22px;
        border-radius: 22px;
        border: 1px solid #d8d8d8;
        color: #6c7580;
      }
    }

    .create_btn {
      position: fixed;
      bottom: 4.213333rem;
      right: 0.8rem;
      width: 55px;
      height: 55px;
      text-align: center;
      line-height: 61px;
      border-radius: 100%;
      background-color: #ff4c4c;
      box-shadow: 0px 0px 20px 0px rgba(255, 75, 75, 0.6);
    }

    .iconfont {
      font-size: 30px;
      color: #fff;
    }
    .created_title {
      line-height: 0px;
      font-size: 12px;
      color: #ff4c4c;
      font-weight: bold;
    }
  }
</style>
