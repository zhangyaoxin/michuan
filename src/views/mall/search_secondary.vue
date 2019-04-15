<template>
  <div class="search_secondary">
    <div class="tab_list">
      <div @click="$router.push({path:'mall_search',query:{search:keyword,type:curType}})">
        <van-search v-model="keyword" shape="round" background="#fff" readonly placeholder="请输入您要找的商品">
          <img slot="left-icon" src="../../assets/images/mall_search_icon.png" alt="">
        </van-search>
      </div>

      <div class="tab" v-if="curType===0">
        <van-tabs v-model="curTab" @click="handleTab">
          <van-tab title="淘宝"> </van-tab>
          <van-tab title="天猫"> </van-tab>
          <van-tab title="拼多多"> </van-tab>
        </van-tabs>
      </div>

      <div class="pro_sort van-hairline--bottom">
        <div :class="{'active':curSortIndex==index}" v-for="(item,index) in sortList" :key="index" @click="changeSort(item,index)">{{(curType===1||curType===3)&&item.pddVal===8?item.sub_title:item.title}}</div>
      </div>
    </div>

    <van-pull-refresh class="mall_list" :style="{'padding-top':curType===0?'145px':'100px'}" v-model="isLoadRefresh" @refresh="refreshList">
      <van-list v-model="isLoading" :finished="isFinished" @load="pullList" :offset="100">
        <comm-list :list="proList" :curHdkType="curHdkType"></comm-list>
      </van-list>
    </van-pull-refresh>

    <div class="nothing_wrap" v-if="!isLoading&&!isLoadRefresh&&proList.length===0">
      <img class="nothing_icon" src="../../assets/images/no_search.png" alt="">
      <p class="fans_title">暂无搜索商品～</p>
    </div>
  </div>
</template>

<script>
  import commList from './components/comm_list'
  import { mallUnifiedFormat, setPagesTitle } from '@/utils/utils'
  export default {
    name: 'search_secondary',
    components: { commList },
    data () {
      return {
        curTab: 0,
        curType: 2,
        isTianmao: false,

        keyword: '',

        curApi: 'getHskMallList',
        curSortIndex: 0,
        sortList: [
          {
            title: '综合排序',
            pddVal: 0,
            tbVal: 0,
            hdkVal: 0
          },
          {
            title: '价格最低',
            pddVal: 3,
            tbVal: 'price',
            hdkVal: 1
          },
          {
            title: '优惠最大',
            sub_title: '关注最高',
            pddVal: 8,
            tbVal: 'tk_total_sales',
            hdkVal: 3,
          },
          {
            title: '销量最多',
            pddVal: 6,
            tbVal: 'total_sales',
            hdkVal: 4
          }
        ],

        page: 1,
        proList: [],
        isLoadRefresh: false,
        isLoading: false,
        isFinished: false,

        minId: 1,

        curType: 0,
        curHdkType: 0,
      }
    },
    methods: {
      init () {
        const type = this.curType
        console.log(type)
        let title = ''
        switch (Number(type)) {
          case 1:
            this.curHdkType = 0
            this.curApi = 'getHskMallList'
            title = '淘宝'
            break;
          case 2:
            this.curApi = 'getPddMallList'
            title = '拼多多'
            break;
          case 3:
            this.curHdkType = 9
            this.curApi = 'getHskMallList'
            title = '天猫'
            break;
          case 4:
            this.curHdkType = 4
            this.curApi = 'getHskMallList'
            title = '聚划算'
            break;
          case 5:
            this.curHdkType = 8
            this.curApi = 'getHskMallList'
            title = '大牌秒杀'
            break;
          case 6:
            this.curHdkType = 2
            this.curApi = 'getHskMallList'
            title = '9.9包邮'
            break;
          default:
            break;
        }
        setPagesTitle(title)
        this[this.curApi]()
      },

      handleTab (i) {
        this.page = 1
        if (i === 0) {
          this.curHdkType = 0
          this.curApi = 'getHskMallList'
        } else if (i === 1) {
          this.curHdkType = 9
          this.curApi = 'getHskMallList'
        } else if (i === 2) {
          this.curApi = 'getPddMallList'
        }
        this[this.curApi]()
      },


      changeSort (item, i) {
        this.curSortIndex = i
        this.minId = 1
        this.page = 1
        this[this.curApi]()
      },

      // 获取拼多多数据
      getPddMallList () {
        const page = this.page
        if (page === 0) return false
        if (page === 1) this.proList = []
        const params = {
          page,
          keyword: this.keyword,
          sort_type: this.sortList[this.curSortIndex].pddVal
        }
        this.$api.getPddMallList(params)
          .then(data => {
            console.log("获取拼多多数据==>", data);
            if (data.goods_search_response) {
              this.isLoadRefresh = false
              this.isLoading = false
              const list = mallUnifiedFormat(data.goods_search_response.goods_list, 'pdd')
              this.proList.push(...list)
              if (data.goods_search_response.total_count === 0) {
                this.isFinished = true
              }
            } else {
              this.isLoadRefresh = false
              this.isLoading = false
              this.isFinished = true
            }
          });
      },

      // 获取淘宝数据
      getTbMallList () {
        console.log(12323123)
        const page = this.page
        if (page === 0) return false
        if (page === 1) this.proList = []
        const params = {
          page_no: page,
          q: this.keyword,
          sort: this.sortList[this.curSortIndex].tbVal,
        }
        const cats = [16, 1512, 50002766, 1625, 30, 14, 50006843, 25, 50010728, 50010788, 50008165, 50008075, 50011699, 50013886, 50006842, 50013864, 50002768, 50011740, 50010404, 50012100, 50014812, 1801, 26, 21, 16, 50020808, 50016349, 1625, 50025705, 50020275, 50006843, 1512, 50006842, 50013864, 50011699, 50008141, 50010404, 30, 50012082, 50010788, 50008163, 50012029, 1801, 35, 50022517, 16, 1512, 50002766, 1625, 30, 14, 50006843, 25, 50010728, 50010788, 50008165, 50008075, 50011699, 50013886, 50006842, 50013864, 50002768, 50011740, 50010404, 50012100, 50014812, 1801, 26, 21, 16, 50020808, 50016349, 1625, 50025705, 50020275, 50006843, 1512, 50006842, 50013864, 50011699, 50008141, 50010404, 30, 50012082, 50010788, 50008163, 50012029, 1801, 35, 50022517, 30, 25, 50010728]
        //  new Date().getDate()
        const date = new Date().getDate()
        // const remainder = date % 10
        const remainder = date * 3 - 3
        const cat = cats.slice(remainder, remainder + 3).join(',')
        if (params.q) {
          delete params.cat
        } else {
          delete params.q
          params.cat = cat
        }
        if (params.sort === 'price') {
          params.sort = params.sort + '_asc'
        } else {
          if (params.sort !== 0) {
            params.sort = params.sort + '_des'
          } else {
            delete params.sort
          }
        }
        if (this.isTianmao) {
          params.is_tmall = true
        }
        console.log(32334343)
        this.$api.getTbMallList(params)
          .then(data => {
            this.isLoadRefresh = false
            this.isLoading = false
            if (data.tbk_dg_material_optional_response) {
              const list = mallUnifiedFormat(data.tbk_dg_material_optional_response.result_list.map_data, 'tb')
              console.log(list, 'opopopopp')
              this.proList.push(...list)
            } else {
              this.isLoadRefresh = false
              this.isLoading = false
              this.isFinished = true
            }
          })
      },

      // 获取好单库数据
      getHskMallList () {
        const page = this.page
        if (page === 0) return false
        if (page === 1) this.proList = []
        const params = {
          keyword: encodeURIComponent(this.keyword),
          type: this.curHdkType,
          back: 10,
          min_id: this.minId,
          cid: this.keywordCid,
          sort: this.sortList[this.curSortIndex].hdkVal
        }
        this.$api.getHdkSearchList(params)
          .then(data => {
            this.isLoadRefresh = false
            this.isLoading = false
            if (data.code === 1) {
              if (this.minId !== data.min_id) {
                this.minId = data.min_id
                const list = mallUnifiedFormat(data.data, 'hdk', this.curType)
                console.log('list =>', list)
                this.proList.push(...list)
              }
            } else {
              this.isLoadRefresh = false
              this.isLoading = false
              this.isFinished = true
            }
          })
        console.log(params, 'opopopop')
      },

      refreshList () {
        this.page = 1
        console.log('下拉刷新')
        this.isLoadRefresh = true
        this[this.curApi]()
      },
      pullList () {
        console.log('上拉加载')
        this.page++
        this[this.curApi]()
      },
    },
    created () {
      this.keyword = this.$route.query.search
      this.curType = this.$route.query.type || 0

      this.init()
    }
  }
</script>

<style  lang="scss">
  .search_secondary {
    height: 100%;
    .van-search__content {
      background-color: #f4f4f4;
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
    .van-tabs__nav {
      background: #f4f4f4;
    }
    .van-tab {
      font-size: 16px;
    }
    .van-tab--active {
      color: #ff4c4c;
    }

    .van-tabs__line {
      bottom: 20px;
      height: 2px;
    }
    .van-hairline--top-bottom::after {
      border-bottom-width: 0;
    }

    .tab_list {
      position: fixed;
      width: 100%;
      z-index: 999;
      background: #f4f4f4;
    }

    .mall_list {
      padding-top: 145px;
    }
    .pro_sort {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
      padding: 10px 15px;
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      background: #fff;
      div {
        width: 17%;
      }

      .active {
        color: #000;
        font-weight: bold;
      }
    }
    .nothing_wrap {
      top: 40%;
    }
  }
</style>
