<template>
  <div class="comm_secondary">
    <div class="tab_list">
      <div @click="$router.push({path:'mall_search',query:{search:keyword,type:curType}})">
        <van-search v-model="keyword" shape="round" background="#fff" readonly placeholder="请输入您要找的商品">
          <img slot="left-icon" src="../../../assets/images/mall_search_icon.png" alt="">
        </van-search>
      </div>

      <div class="type van-hairline--top" :class="{'expand':isExpand}">
        <div class="item" :class="{'active':curTypeIndex===index}" v-for="(item,index) in type" :key="index">
          <van-icon :name="isExpand?'arrow-up':'arrow-down'" v-if="item.id===1111" class="ops" @click="isExpand=!isExpand" />
          <span v-else @click="selectType(item,index)"> {{item.label}}</span>
        </div>
      </div>

      <div class="pro_sort">
        <div :class="{'active':curSortIndex==index}" v-for="(item,index) in sortList" :key="index" @click="changeSort(item,index)">{{(curType===1||curType===3)&&item.pddVal===8?item.sub_title:item.title}}</div>
      </div>
    </div>
    <div class="mask" v-if="isExpand"></div>

    <van-pull-refresh class="mall_list" :class="{'list_height':isSearch}" v-model="isLoadRefresh" @refresh="refreshList">
      <van-list v-model="isLoading" :finished="isFinished" @load="pullList" :offset="10">
        <comm-list :list="proList"></comm-list>
      </van-list>
    </van-pull-refresh>

    <div class="nothing_wrap" v-if="!isLoading&&!isLoadRefresh&&proList.length===0">
      <img class="nothing_icon" src="../../../assets/images/no_search.png" alt="">
      <p class="fans_title">暂无搜索商品～</p>
    </div>
  </div>
</template>

<script>
  import commList from './comm_list'
  import { mallUnifiedFormat } from '@/utils/utils'

  export default {
    name: 'comm_secondary',
    components: { commList },
    data () {
      return {
        keywordCid: 0,
        keyword: '',

        curType: 2,
        curHdkType: 0,
        isTianmao: false,
        curApi: 'getTbMallList',

        isExpand: false,
        curTypeIndex: 0,
        type: [
          {
            id: 0,
            label: '全部'
          },
          {
            id: 1,
            label: '女装'
          },
          {
            id: 2,
            label: '男装'
          },
          {
            id: 3,
            label: '内衣'
          },
          {
            id: 4,
            label: '美妆'
          },
          {
            id: 12,
            label: '数码'
          },
          {
            id: 1111,
            label: '操作'
          },
          {
            id: 6,
            label: '鞋品'
          },
          {
            id: 7,
            label: '箱包'
          },
          {
            id: 8,
            label: '儿童'
          },
          {
            id: 9,
            label: '母婴'
          },
          {
            id: 10,
            label: '居家'
          },
          {
            id: 11,
            label: '美食'
          },
          {
            id: 5,
            label: '配饰'
          },
          {
            id: 13,
            label: '家电'
          },
          {
            id: 15,
            label: '车品'
          },
          {
            id: 16,
            label: '文体'
          },
          {
            id: 17,
            label: '宠物'
          }
        ],

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

        isLoadRefresh: false,
        isLoading: false,
        isFinished: false,
        page: 0,
        minId: 1,
        proList: []
      }
    },
    computed: {

    },
    methods: {
      init () {
        const name = this.$route.name
        console.log(name)
        switch (name) {
          case 'tb_list':
            this.curType = 1
            this.curHdkType = 0
            this.curApi = 'getHskMallList'
            // this.isTianmao = false
            break;
          case 'pdd_list':
            this.curType = 2
            this.curApi = 'getPddMallList'
            // this.isTianmao = false
            break;
          case 'tm_list':
            this.curType = 3
            this.curHdkType = 9
            this.curApi = 'getHskMallList'
            // this.isTianmao = true
            break;
          case 'jhs_list':
            this.curType = 4
            this.curHdkType = 4
            this.curApi = 'getHskMallList'
            // this.isTianmao = false
            break;
          case 'dpms_list':
            this.curType = 5
            this.curHdkType = 8
            this.curApi = 'getHskMallList'
            // this.isTianmao = false
            break;
          case '9.9_list':
            this.curType = 6
            this.curHdkType = 2
            this.curApi = 'getHskMallList'
            // this.isTianmao = false
            break;
          default:
            break;
        }

        this[this.curApi]()
      },

      selectType (info, i) {
        this.page = 1
        this.minId = 1
        this.curTypeIndex = i
        this.isExpand = false
        this.keyword = info.label
        this.keywordCid = info.id
        console.log(this.keyword)
        this[this.curApi]()
      },

      changeSort (item, i) {
        this.curSortIndex = i
        this.page = 1
        this.minId = 1
        this[this.curApi]()
      },


      refreshList () {
        this.page = 1
        this.minId = 1
        console.log('下拉刷新')
        this.isLoadRefresh = true
        this[this.curApi]()
      },
      pullList () {
        console.log('上拉加载')
        this.page++
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
            this.isLoadRefresh = false
            this.isLoading = false
            if (data.goods_search_response) {

              const list = mallUnifiedFormat(data.goods_search_response.goods_list, 'pdd')
              console.log('拼多多数据==>', list)
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
          type: this.curHdkType,
          back: 10,
          min_id: this.minId,
          cid: this.keywordCid,
          sort: this.sortList[this.curSortIndex].hdkVal
        }
        this.$api.getHdkMallList(params)
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
    },

    created () {
      this.init()
    }
  }
</script>

<style lang="scss">
  .comm_secondary {
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
    .tab_list {
      position: fixed;
      width: 100%;
      z-index: 999;
      background: #f4f4f4;
    }

    .type {
      display: flex;
      flex-wrap: wrap;
      position: absolute;
      padding: 5px 15px 0;
      box-sizing: border-box;
      height: 40px;
      background: #fff;
      // border: 1px solid #000;
      overflow: hidden;

      .item {
        margin-right: 1.12rem;
        margin-bottom: 15px;
        width: 1.653333rem;
        height: 23px;
        border-bottom: 2px solid transparent;
        text-align: center;
      }

      .item.active {
        border-bottom: 2px solid #ff4c4c;
      }

      .item:nth-child(7).active {
        border-bottom: 2px solid transparent;
      }

      .item:nth-child(7n) {
        margin-right: 0;
      }
    }
    .expand {
      height: 115px;
    }

    .ops {
      position: relative;
      top: 2px;
      font-size: 20px;
    }

    .mall_list {
      padding-top: 125px;
    }
    .list_height {
      padding-top: 70px;
    }

    .pro_sort {
      display: flex;
      justify-content: space-between;
      margin-top: 42px;
      padding: 10px 15px;
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      color: #999;
      div {
        width: 17%;
      }

      .active {
        color: #333;
        font-weight: bold;
      }
    }
    .mask {
      position: fixed;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 998;
    }
    .nothing_wrap {
      top: 40%;
    }
  }
</style>
