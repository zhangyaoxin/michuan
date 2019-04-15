<template>
  <div class="mall_search">
    <form action="handleSearch">
      <van-search v-model="search" shape="round" show-action background="#fff" placeholder="请输入您要找的商品" @search="handleSearch">
        <img slot="left-icon" src="../../assets/images/mall_search_icon.png" alt="">
        <div slot="action" @click="handleSearch">搜索</div>
      </van-search>
    </form>

    <div class="hot_search">
      <div class="title">热门搜索</div>
      <div class="hot_wrap">
        <div class="hot_item" v-for="(item,index) in hotList" :key="index" @click="selectSearch(item.keyword)">{{item.keyword}}</div>
      </div>
    </div>

    <div class="hot_search">
      <div class="title history_title">
        <div class="title_txt">历史记录</div>
        <div class="history_del">
          <van-icon name="delete" @click="emptyHistory" />
        </div>
      </div>
      <div class="hot_wrap">
        <div class="hot_item" v-for="(item,index) in historyList" :key="index" @click="selectSearch(item)">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { setStore, getStore, removeStore } from '@/utils/utils'
  export default {
    name: 'mall_search',
    components: {},
    data () {
      return {
        isAutofocus: false,
        search: '',

        hotList: [],

        historyList: [],

        curType: 0,
      }
    },
    methods: {
      // 获取热门搜索
      getHotSearchMall () {
        this.$api.getHotSearchMall()
          .then(data => {
            console.log(data)
            if (data.code === 1) {
              this.hotList = data.data.slice(0, 10)
              console.log(this.hotList, 'ooooooooooo')
            }
          })
      },

      handleSearch () {
        const search = this.search
        if (search) {
          this.historyList.unshift(search)
          this.historyList = [...new Set(this.historyList)]
          // 历史记录最多储存10个
          if (this.historyList.length >= 10) {
            this.historyList.length = 10
          }
          setStore('historyMallSearch', this.historyList, 'localStorage')
        }
        this.$router.replace({ path: 'search_secondary', query: { search: search, type: this.curType } })
      },

      selectSearch (search) {
        this.search = search
        this.handleSearch()
      },

      // 清空历史记录
      emptyHistory () {
        this.historyList = []
        removeStore('historyMallSearch', 'localStorage')
      }
    },
    created () {
      this.search = this.$route.query.search
      this.curType = this.$route.query.type
      this.getHotSearchMall()
      this.historyList = getStore('historyMallSearch', 'localStorage') && JSON.parse(getStore('historyMallSearch', 'localStorage')) || []
    },
    mounted () {
      const input = document.querySelector('.van-field__control')
      input.focus()
    }
  }
</script>

<style  lang="scss">
  .mall_search {
    height: 100%;
    background: #fff;

    .van-search {
      border-bottom: 1px solid #f4f4f4;
    }
    .van-field__left-icon {
      margin-top: 5px;
      margin-right: 4px;
      width: 14px;
      height: 14px;
      img {
        width: 100%;
      }
    }
    .hot_search {
      margin-left: 15px;
      padding-top: 15px;
      border-bottom: 1px solid #f4f4f4;
    }
    .hot_search:last-child {
      border-bottom: none;
    }
    .title {
      font-size: 15px;
      color: #333;
    }
    .history_title {
      display: flex;
      align-items: center;
    }
    .hot_wrap {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
    }
    .hot_item {
      margin-right: 10px;
      margin-bottom: 15px;
      padding: 0 10px;
      border-radius: 30px;
      background: #f4f4f4;
      color: #666;
    }
    .title_txt {
      flex: 1;
    }

    .history_del {
      position: relative;
      top: 3px;
      right: 15px;
    }
  }
</style>
