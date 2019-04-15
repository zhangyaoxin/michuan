 <template>
  <div class="mall_manage">
    <!-- 头部 -->
    <mall-top></mall-top>

    <!-- 类别 -->
    <mall-sort></mall-sort>

    <!-- 超值推荐 -->
    <mall-value-recom></mall-value-recom>

    <!-- 其他产品 -->
    <mall-other></mall-other>

    <!-- 为你推荐 -->
    <mall-you-recom></mall-you-recom>

    <!-- <div class="tab_list">
      <van-tabs v-model="curTab" @click="handleTab">
        <van-tab>
          <div slot="title" class="mall_tab pdd_tab"></div>
        </van-tab>
        <van-tab>
          <div slot="title" class="mall_tab tb_tab"></div>
        </van-tab>
        <van-tab>
          <div slot="title" class="mall_tab tm_tab"></div>
        </van-tab>
      </van-tabs>

      <form class="header" action="handleSearch">
        <van-search class="mall_search" placeholder="请输入关键词搜索" background="#f4f4f4" show-action v-model="keyword" @search="handleSearch">
          <div slot="action" @click="handleSearch">搜索</div>
        </van-search>

        <router-link class="mall_order" to="mall_order">
          <img src="../../assets/images/mall_ord_btn.png" alt="">
        </router-link>
      </form>

      <div class="pro_sort">
        <div :class="{'active':curSortIndex==index}" v-for="(item,index) in sortList" :key="index" @click="changeSort(item,index)">{{(curType===1||curType===3)&&item.pddVal===8?item.sub_title:item.title}}</div>
      </div>
    </div>

    <van-pull-refresh class="mall_list" v-model="isLoadRefresh" @refresh="refreshList">
      <van-list v-model="isLoading" :finished="isFinished" @load="pullList" :offset="100">
        <div class="pro_list">
          <div class="pro_item" v-for="(item,index) in proList" :key="index" @click="handleMallDetail(item)">
            <div class="cover">
              <img :src="item.thumbnail" alt="">
              <div class="pro_sales">销量 {{item.sales}}</div>
            </div>
            <div class="info">
              <div class="title" style="-webkit-box-orient: vertical;-moz-box-orient: vertical;box-orient: vertical;">
                <img class="mall_type" :src="item|filterIcon(icon)" alt="">
                <span>{{item.name}}</span>
              </div>
              <div class="params">
                <span class="price">￥{{Number((item.price - item.price_coupons).toFixed(2))}}</span>
                <span v-if="String(item.price).length<5">{{curType|filterType}} {{item.price}}</span>
                <p style="margin-top:-8px" v-else>{{curType|filterType}} {{item.price}}</p>
              </div>
              <div class="coupon">
                <div class="coupon_icon">券</div>
                <div class="coupon_money">{{item.price_coupons/10}} 蜂蜜抵 ￥{{item.price_coupons}}</div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <div class="nothing_wrap" v-if="!isLoading&&!isLoadRefresh&&proList.length===0">
      <img class="nothing_icon" src="../../assets/images/no_search.png" alt="">
      <p class="fans_title">暂无搜索商品～</p>
    </div>-->

    <go-top></go-top>
  </div>
</template>

<script>
  import mallTop from './components/top'
  import mallSort from './components/sort'
  import mallValueRecom from './components/value_recom'
  import mallOther from './components/other'
  import mallYouRecom from './components/you_recom'

  import goTop from '@@/go_top'

  import { mapState } from 'vuex'
  import { setStore } from '@/utils/utils'
  
  export default {
    name: "mall_index",
    components: { mallTop, mallSort, mallValueRecom, mallOther, mallYouRecom, goTop },
    data () {
      return {
        icon: {
          tbIcon: require('../../assets/images/tb_icon.png'),
          tmIcon: require('../../assets/images/tm_icon.png'),
          pddIcon: require('../../assets/images/pdd_icon.png'),
        },

        curTab: 0,
        curType: 2,
        isTianmao: false,

        keyword: '',

        curApi: 'getPddMallList',
        curSortIndex: 0,
        sortList: [
          {
            title: '综合排序',
            pddVal: 0,
            tbVal: 0
          },
          {
            title: '价格最低',
            pddVal: 3,
            tbVal: 'price'
          },
          {
            title: '优惠最大',
            sub_title: '关注最高',
            pddVal: 8,
            tbVal: 'tk_total_sales'
          },
          {
            title: '销量最多',
            pddVal: 6,
            tbVal: 'total_sales'
          }
        ],

        page: 0,
        proList: [],
        isLoadRefresh: false,
        isLoading: false,
        isFinished: false,
      };
    },
    filters: {
      filterIcon (item, icon) {
        const url = item.item_url || ''
        if (url.includes('item.taobao.com')) {
          return icon.tbIcon
        } else if (url.includes('detail.tmall.com')) {
          return icon.tmIcon
        } else {
          return icon.pddIcon
        }
      },
      filterType (type) {
        switch (Number(type)) {
          case 1:
            return '淘宝价'
            break;
          case 2:
            return '拼多多价'
            break;
          case 3:
            return '天猫价'
            break;
          default:
            break;
        }
      }
    },
    computed: {
      ...mapState({
        h5BaseUrl: state => state.h5BaseUrl,
      })
    },
    watch: {
      '$route': {
        handler (n) {
          this.keyword = n.query.search || ''
          this[this.curApi]()
        },
        immediate: true
      },
    },
    methods: {
      // 参数统一格式
      mallUnifiedFormat (arr = [], type) {
        const data = []
        if (type === 'tb') {
          for (let it of arr) {
            const {
              num_iid: id,
              title: name,
              pict_url: thumbnail,
              zk_final_price: price,
              volume: sales,
              coupon_info: price_coupons,
              coupon_share_url: coupon_link,
              item_url
            } = it

            if (price_coupons.includes('减')) {
              const params = price_coupons.split('减')[1].slice(0, -1)
              data.push({ id, name, thumbnail, price, sales, price_coupons: params, coupon_link, info: it, item_url })
            }
          }
        } else if (type === 'pdd') {
          for (let it of arr) {
            const {
              goods_id: id,
              goods_name: name,
              goods_thumbnail_url: thumbnail,
              min_group_price: price, sold_quantity: sales,
              coupon_discount: price_coupons } = it
            data.push({ id, name, thumbnail, price: price / 100, sales, price_coupons: price_coupons / 100 })
          }
        }

        return data
      },

      debounce (func, wait) {
        let timeout;
        return () => {
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(() => {
            func()
          }, wait);
        }
      },

      handleTab (i) {
        this.page = 1
        if (i === 0) {
          this.curType = 2
          this.curApi = 'getPddMallList'
          this.isTianmao = false
        } else if (i === 1) {
          this.curType = 1
          this.curApi = 'getTbMallList'
          this.isTianmao = false
        } else if (i === 2) {
          this.curType = 3
          this.curApi = 'getTbMallList'
          this.isTianmao = true
        }
        this[this.curApi]()
      },

      handleSearch () {
        this.page = 1
        this.$router.push({ path: 'mall_index', query: { 'search': this.keyword } })
      },

      handleInput () {

      },

      changeSort (item, i) {
        this.curSortIndex = i
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
              const list = this.mallUnifiedFormat(data.goods_search_response.goods_list, 'pdd')
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

        this.$api.getTbMallList(params)
          .then(data => {
            this.isLoadRefresh = false
            this.isLoading = false
            if (data.tbk_dg_material_optional_response) {
              const list = this.mallUnifiedFormat(data.tbk_dg_material_optional_response.result_list.map_data, 'tb')
              this.proList.push(...list)
            } else {
              this.isLoadRefresh = false
              this.isLoading = false
              this.isFinished = true
            }
          })
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

      // 查看商品详情
      handleMallDetail (item) {
        setStore('mallInfo', item, 'localStorage')
        this.$router.push({ path: "/mall_detail", query: { id: item.id, type: this.curType } });
      },
    },
    created () { }
  };
</script>

<style lang="scss">
  // .mall_manage {
  //   display: flex;
  //   flex-direction: column;

  //   .tab_list {
  //     position: fixed;
  //     width: 100%;
  //     z-index: 999;
  //     background: #f4f4f4;
  //   }

  //   .mall_list {
  //     margin-top: 145px;
  //   }

  //   .mall_tab {
  //     position: absolute;
  //     top: 50%;
  //     left: 50%;
  //     margin-left: -37px;
  //     margin-top: -13px;
  //     width: 75px;
  //     height: 26px;
  //   }

  //   .tb_tab {
  //     background: url("../../assets/images/mall_tb.png");
  //     background-size: 75px 26px;
  //   }
  //   .tm_tab {
  //     background: url("../../assets/images/mall_tm.png");
  //     background-size: 75px 26px;
  //   }
  //   .pdd_tab {
  //     background: url("../../assets/images/mall_pdd.png");
  //     background-size: 75px 26px;
  //   }
  //   .van-tabs__line {
  //     height: 0;
  //   }
  //   .van-tab--active {
  //     .tb_tab {
  //       background: url("../../assets/images/mall_tb_hl.png");
  //       background-size: 75px 26px;
  //     }
  //     .tm_tab {
  //       background: url("../../assets/images/mall_tm_hl.png");
  //       background-size: 75px 26px;
  //     }
  //     .pdd_tab {
  //       background: url("../../assets/images/mall_pdd_hl.png");
  //       background-size: 75px 26px;
  //     }
  //   }

  //   .header {
  //     margin-top: 10px;
  //     display: flex;
  //     align-items: center;
  //   }
  //   .mall_search {
  //     width: 280px;
  //     height: 36px;
  //   }
  //   .van-search .van-cell {
  //     padding: 6px 10px;
  //     border-radius: 33px;
  //   }
  //   .van-search__action {
  //     font-size: 16px;
  //     color: #ff4c4c;
  //   }

  //   .mall_order {
  //     margin-right: 15px;
  //     margin-left: auto;
  //     width: 53px;
  //     height: 20px;
  //     font-size: 16px;
  //     color: #ff4c4c;
  //     img {
  //       width: 100%;
  //     }
  //   }
  //   .pro_sort {
  //     display: flex;
  //     justify-content: space-between;
  //     padding: 15px;
  //     text-align: center;
  //     div {
  //       width: 17%;
  //     }

  //     .active {
  //       color: #000;
  //       font-weight: bold;
  //     }
  //   }

  //   .pro_list {
  //     display: flex;
  //     justify-content: space-between;
  //     flex-wrap: wrap;
  //     padding: 0 15px;
  //   }

  //   .pro_item {
  //     margin-bottom: 10px;
  //     width: 48.5%;
  //     border-radius: 4px;
  //     overflow: hidden;
  //   }
  //   .cover {
  //     position: relative;
  //     width: 100%;
  //     height: 165px;
  //     overflow: hidden;
  //     background: #fafafa;
  //     img {
  //       width: 100%;
  //       height: 100%;
  //     }
  //   }
  //   .pro_sales {
  //     position: absolute;
  //     bottom: 0;
  //     left: 0;
  //     padding-left: 6px;
  //     line-height: 18px;
  //     padding-right: 10px;
  //     background: rgba(0, 0, 0, 0.5);
  //     color: #fff;
  //     font-size: 12px;
  //     border-radius: 0 15px 15px 0;
  //   }

  //   .info {
  //     padding: 10px 6px;
  //     background: #fff;
  //   }

  //   .mall_type {
  //     width: 15px;
  //     height: 15px;
  //   }

  //   .title {
  //     height: 32px;
  //     line-height: 16px;
  //     font-size: 14px;
  //     color: #000;
  //     display: -webkit-box;
  //     display: -moz-box;
  //     overflow: hidden;
  //     text-overflow: ellipsis;
  //     word-break: break-all;
  //     -webkit-box-orient: vertical;
  //     -moz-box-orient: vertical;
  //     box-orient: vertical;
  //     -webkit-line-clamp: 2;
  //   }
  //   .params {
  //     font-size: 12px;
  //   }
  //   .price {
  //     margin-right: 10px;
  //     color: #ff4c4c;
  //     font-size: 16px;
  //     font-weight: bold;
  //   }

  //   .coupon {
  //     display: flex;
  //     height: 18px;
  //     line-height: 18px;
  //     background: #f4f4f4;
  //     font-size: 12px;
  //   }
  //   .coupon_icon {
  //     margin-right: 6px;
  //     width: 26px;
  //     height: 18px;
  //     text-align: center;
  //     background: #ff4c4c;
  //     color: #fff;
  //   }
  //   .coupon_money {
  //     white-space: nowrap;
  //   }
  // }
</style>
