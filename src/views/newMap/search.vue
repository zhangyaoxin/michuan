<template>
  <div class="hall_search">
    <form action="handleSearch">
      <van-search v-model="search" shape="round" background="#fff" placeholder="请输入搜索关内容" autofocus show-action @search="handleSearch">
        <img slot="left-icon" src="../../assets/images/mall_search_icon.png" alt="">
        <div slot="action" v-if="startSearch" @click="handleSearch">搜索</div>
        <div slot="action" v-else @click="closeSearch">取消</div>
      </van-search>
    </form>

    <!-- 搜索历史记录 -->
    <div class="search_history" v-if="startSearch">
      <div class="search_top">
        <div class="search_title">最近搜索</div>
        <div>
          <van-icon name="delete" @click="emptyHistory" />
        </div>
      </div>
      <div class="history_list">
        <div class="history_item" v-for="(item,index) in historyList" :key="index" @click="selectSearch(item)">{{item}}</div>
      </div>
    </div>

    <!-- 搜索列表 -->
    <div v-else>
      <div class="check_tab">
        <ul>
          <li @click="checkList(0)" :class="article[0]">距离最近</li>
          <li @click="checkList(1)" :class="article[1]">折扣最多</li>
          <li @click="checkList(2)" :class="article[2]">销量最高</li>
        </ul>
      </div>
      <div class="show_list">
        <ul>
          <li v-for="(item,index) in searchData" :key="index" @click="goDetail(item)">
            <div class="logo_img"><img v-if="item.logo" :src="item.logo" alt=""></div>
            <div style="display:none;">{{item}}</div>
            <div class="list_cont">
              <div class="cont_tit"><span>{{item.title}}</span><span>{{item.status}}</span></div>
              <!-- <div class="cont_label"><span v-for="itemS in item.tag.split(',')">{{itemS}}</span><span>{{item.price}}</span></div> -->
              <div class="cont_label"><span>{{item.tag}}</span><span>{{item.price}}</span></div>
              <div class="cont_discount"><div class="cont_dis_lt"><span>省</span>{{item.discount}}</div><div class="cont_dis_rt"><span>销量{{item.volumen}}</span><span>{{item.avgcost}}Km</span></div></div>
            </div>
          </li>
        </ul>
        <div class="not_more">以显示全部内容</div>
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
        article:['article','',''],
        // 搜索历史记录
        historyList: [],
        startSearch:true,
        pages:1,
        searchData:[
          /* {
            logo:'https://imgsa.baidu.com/forum/w%3D580%3B/sign=9f3d041577310a55c424defc877e42a9/4d086e061d950a7b6a03d02204d162d9f2d3c926.jpg',
            title:'好又多超市',
            status:'营业中',
            tag:'川菜,粤菜',
            price:'￥88/人',
            discount:'￥33.00',
            volumen:'10000',
            distance:'1.8km'
          },
          {
            logo:'https://imgsa.baidu.com/forum/w%3D580%3B/sign=9f3d041577310a55c424defc877e42a9/4d086e061d950a7b6a03d02204d162d9f2d3c926.jpg',
            title:'苏果超市门坎店',
            status:'休息中',
            tag:'冷饮,超市',
            price:'￥20/人',
            discount:'￥28.00',
            volumen:'10000',
            distance:'1.8km'
          } */
        ],
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
        this.startSearch = false;
        const search = this.search
        if (search) {
          this.historyList.unshift(search)
          this.historyList = [...new Set(this.historyList)]
          // 历史记录最多储存10个
          if (this.historyList.length >= 10) {
            this.historyList.length = 10
          }
          setStore('historyHomeSearch', this.historyList, 'localStorage')
        }
        // this.$router.replace({ path: 'search_result', query: { search: search } })
        // 请求搜索结果
        this.searchList(this.search)
        // 展开搜索列表

      },
      closeSearch(){
        this.startSearch = true;
      },
      selectSearch (search) {
        this.search = search
        this.handleSearch()
      },

      // 清空历史记录
      emptyHistory () {
        this.historyList = []
        removeStore('historyHomeSearch', 'localStorage')
      },
      // 
      checkList(index){
        this.article=['','',''];
        this.article[index] = 'article'
      },
      searchList(key){
        var _this = this;
        this.$store.dispatch('searchList',{
          area_num: localStorage.area_num,
          key:key,
          page:_this.pages
        })
          .then((response)=>{
            console.log('成功获取搜索列表',response)
            _this.searchData =  response.data.data
            // response.current_page
            // response.last_page
          })
      },
      goDetail(value){
        console.log(value)
        // location.href =
        //               "http://h5.bvcio.com/mc_b/shop.html?shopId=" +
        //               value.hashID +
        //               "&token=" +
        //               localStorage.token +
        //               "&dist=" +
        //               value.dist +
        //               "&only_balance=" +
        //               value.only_balance;
      }

    },

    created () {
      this.search = this.$route.query.search
      this.historyList = (getStore('historyHomeSearch', 'localStorage') && JSON.parse(getStore('historyHomeSearch', 'localStorage'))) || []
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
    .check_tab{
      width: 100%;
      border-bottom: #999 solid 1px;
      padding: .96rem /* 36/37.5 */ 1.33rem /* 50/37.5 */;
      font-size: .64rem /* 24/37.5 */;
      color: #999;
      font-weight: 600;
      box-sizing: border-box;
      background-color: #fff;
      .article{
        color: #333;
      }
      ul{
        display: flex;
        justify-content: space-between;
      }
    }
    .not_more{
      font-size: .64rem /* 24/37.5 */;
      text-align: center;
      color: #666;
    }
    .show_list{
      li{
        margin-bottom: .53rem /* 20/37.5 */;
        background-color: #fff;
        padding: .8rem /* 30/37.5 */;
        display: flex;
        justify-content: space-between;
      }
      .logo_img{
        width: 3.55rem /* 133/37.5 */;
        height: 3.55rem /* 133/37.5 */;
        border-radius: .11rem /* 4/37.5 */;
        border:solid 1px #f4f4f4;
        overflow: hidden;
        margin-right:.64rem /* 24/37.5 */;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .list_cont{
        flex: 1;
      }
    } 
    .cont_tit{
      display: flex;
      line-height: .91rem;
      span:nth-of-type(1){
        font-size: .91rem /* 34/37.5 */;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 13.5em;
        display: block;
        color:#333;
      }
      span:nth-of-type(2){
        display: block;
        font-size:.53rem /* 20/37.5 */;
        color:#666;

      }
    }
    .cont_label{
      padding: .64rem /* 24/37.5 */ 0;
      font-size: .64rem /* 24/37.5 */;
      color:#666;
      line-height: .64rem;
      span{
        margin-right:.53rem /* 20/37.5 */;
      }
    }
    .cont_discount{
      display: flex;
      justify-content: space-between;
      .cont_dis_lt{
        flex:1;
        color: #ff4c4c;
        font-size: .8rem /* 30/37.5 */;
        line-height: .8rem;
        span{
          margin-right:.13rem /* 5/37.5 */;
          font-size: .53rem /* 20/37.5 */;
          display: inline-block;
          width:1.07rem /* 40/37.5 */;
          height: .8rem /* 30/37.5 */;
          border: solid 1px #ff4c4c;
          box-sizing: border-box;
          border-radius: 2px;
          text-align: center;

        }
      }
      .cont_dis_rt{
        line-height: .8rem;
        color:#666;
        font-size: .64rem /* 24/37.5 */;
        span:nth-of-type(1){
          margin-right: .53rem /* 20/37.5 */;
        }
      }
    }
  }
</style>
