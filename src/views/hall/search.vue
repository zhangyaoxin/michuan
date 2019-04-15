<template>
  <div class="hall_search">
    <form action="handleSearch">
      <van-search v-model="search" shape="round" background="#fff" placeholder="请输入搜索关键词" autofocus show-action @search="handleSearch">
        <img slot="left-icon" src="../../assets/images/mall_search_icon.png" alt="">
        <div slot="action" @click="handleSearch">搜索</div>
      </van-search>
    </form>

    <!-- 搜索历史记录 -->
    <div class="search_history">
      <div class="search_top">
        <div class="search_title">历史记录</div>
        <div>
          <van-icon name="delete" @click="emptyHistory" />
        </div>
      </div>
      <div class="history_list">
        <div class="history_item" v-for="(item,index) in historyList" :key="index" @click="selectSearch(item)">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { setStore, getStore, removeStore } from '@/utils/utils'
  export default {
    name: 'search',
    components: {},
    data () {
      return {
        search: '',

        isSearch: false,

        searchCond: {},

        // 搜索历史记录
        historyList: [],

      }
    },
    computed: {

    },
    watch: {
      $route (n) {
        this.handleFun()
      }
    },
    methods: {
      handleSearch () {
        const search = this.search
        if (search) {
          this.historyList.unshift(search)
          this.historyList = [...new Set(this.historyList)]
          // 历史记录最多储存10个
          if (this.historyList.length >= 10) {
            this.historyList.length = 10
          }
          setStore('historyHallSearch', this.historyList, 'localStorage')
        }
        this.$router.replace({ path: 'search_result', query: { search: search } })
      },

      selectSearch (search) {
        this.search = search
        this.handleSearch()
      },

      // 清空历史记录
      emptyHistory () {
        this.historyList = []
        removeStore('historyHallSearch', 'localStorage')
      },


      // handleFun () {
      //   this.historyList = getStore('historyList') && JSON.parse(getStore('historyList')) || []

      //   const search = this.$route.query.search
      //   if (search) {
      //     if (!this.historyList.includes(search)) {
      //       this.historyList.unshift(search)
      //     }
      //     // 历史记录最多储存10个
      //     if (this.historyList.length >= 10) {
      //       this.historyList.length = 10
      //     }
      //     setStore('historyList', this.historyList)
      //     this.search = search
      //     this.getSearchData()
      //   } else {
      //     this.isSearch = true
      //   }
      // },

      // handleCancel () {
      //   this.isSearch = false
      //   this.$router.push('home')
      // },

      // // 搜索
      // handleSearch () {
      //   const params = this.search
      //   if (!params.trim()) {
      //     this.$toast('请输入搜索内容')
      //     this.search = ''
      //   } else {
      //     const querySearch = this.$route.query.search
      //     this.$router.push({ path: 'search', query: { search: params } })
      //     if (querySearch === params) {
      //       this.handleFun()
      //     }
      //   }
      // },

      // // 选择历史记录
      // selectHistory (info) {
      //   this.search = info
      //   const querySearch = this.$route.query.search
      //   this.$router.push({ path: 'search', query: { search: info } })
      //   if (querySearch === info) {
      //     this.handleFun()
      //   }
      // },

      // // 清空历史记录
      // emptyHistory () {
      //   this.historyList = []
      //   window.sessionStorage.removeItem('historyList')
      // },

      // // 获取搜索数据
      // getSearchData () {
      //   this.isSearch = false
      //   const id = this.userId
      //   console.log('获取搜索数据')
      //   this.searchCond.keyword = this.search
      //   this.lockFun = false
      //   this.$nextTick(() => {
      //     this.$refs.adList.page = 1
      //     this.$refs.adList.getAdList()
      //   })

      //   this.$api.getSearchUser(id, { keyword: this.search, limit: 4 })
      //     .then(data => {
      //       if (data.status) {
      //         this.memberList = data.data.data
      //       }
      //     })
      // }
    },

    created () {
      this.search = this.$route.query.search
      this.historyList = (getStore('historyHallSearch', 'localStorage') && JSON.parse(getStore('historyHallSearch', 'localStorage'))) || []
    },
    mounted () {
      const input = document.querySelector('.van-field__control')
      input.focus()
    }
  }
</script>

<style  lang="scss">
  @import "../../assets/css/var";

  .hall_search {
    .van-field__left-icon {
      margin-top: 5px;
      margin-right: 4px;
      width: 14px;
      height: 14px;
      img {
        width: 100%;
      }
    }

    .search_history {
      padding: 0.533333rem 0.8rem;
      font-size: 0.746667rem;
      color: #666;
      background: #fff;
    }

    .search_top {
      display: flex;
    }

    .search_title {
      flex: 1;
    }

    .history_list {
      display: flex;
      flex-wrap: wrap;
      margin-top: 0.533333rem;
    }

    .history_item {
      margin-right: 0.533333rem;
      margin-top: 0.533333rem;
      padding: 0.213333rem 0.533333rem;
      background: #f4f4f4;
      color: #666;
      border-radius: 1.066667rem;
    }
  }
</style>
