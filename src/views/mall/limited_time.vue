<template>
  <div class="limited_time">
    <div class="tab_list">
      <van-tabs v-model="curTab" @click="changeTab">
        <van-tab :title="item.label" v-for="(item,index) in tabList" :key="index">
          <div slot="title">
            <div class="timer">{{item.label}}:00</div>
            <div class="status">{{index|filterStatus(curHourIndex)}}</div>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <!-- <van-pull-refresh class="mall_list" :class="{'list_height':isSearch}" v-model="isLoadRefresh" @refresh="refreshList"> -->
    <!-- <van-list v-model="isLoading" :finished="isFinished" @load="pullList" :offset="10"> -->
    <div class="mall_list">
      <div class="item van-hairline--bottom" v-for="(item,index) in proList" :key="index" @click="handleMallDetail(item)">
        <div class="img">
          <img :src="item.thumbnail" alt="">
        </div>

        <div class="info">
          <div class="title ellipsis">
            <img class="mall_type" src="../../assets/images/tb_icon.png" alt="">
            <span>{{item.name}}</span>
          </div>

          <div class="sales">已抢{{curTab>curHourIndex?0:item.sales2}}件</div>

          <div class="coupon">
            <div class="coupon_icon">
              <div class="font_size_10">券</div>
            </div>
            <div class="coupon_money">
              <div class="font_size_10">￥{{item.price_coupons}}</div>
            </div>
          </div>

          <div class="params">
            <span class="price">￥{{Number((item.price - item.price_coupons).toFixed(2))}}</span>
            <del>淘宝价￥{{item.price}}</del>
            <span>销量:{{curTab>curHourIndex?0:item.sales}}</span>
          </div>

        </div>
      </div>
    </div>
    <!-- </van-list> -->
    <!-- </van-pull-refresh> -->

  </div>
</template>

<script>
  import { mallUnifiedFormat, setStore } from '@/utils/utils'
  export default {
    name: 'limited_time',
    components: {},
    data () {
      return {
        curTab: 0,
        curHour: '',
        curHourId: 0,
        curHourIndex: 0,
        tabList: [
          {
            id: 1,
            label: '00'
          },
          {
            id: 2,
            label: '10'
          },
          {
            id: 3,
            label: '12'
          },
          {
            id: 4,
            label: '15'
          },
          {
            id: 5,
            label: '20'
          },
          {
            id: 6,
            label: '00'
          },
          {
            id: 7,
            label: '10'
          },
          {
            id: 8,
            label: '12'
          },
          {
            id: 9,
            label: '15'
          },
          {
            id: 10,
            label: '20'
          },
          {
            id: 11,
            label: '00'
          },
          {
            id: 12,
            label: '10'
          },
          {
            id: 13,
            label: '12'
          },
          {
            id: 14,
            label: '15'
          },
          {
            id: 15,
            label: '20'
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
    filters: {
      filterStatus (i, curHourIndex) {
        if (i === curHourIndex) {
          return '抢购中'
        } else if (i > curHourIndex && i <= 9) {
          return '即将开始'
        } else if (i > curHourIndex && i > 9) {
          return '明日开场'
        } else if (i < curHourIndex) {
          return '已开抢'
        }
      }
    },
    methods: {
      changeTab (i) {
        this.curHourId = this.tabList[i].id
        console.log(this.curHourId, ' this.curHourId')
        this.minId = 1
        this.getMallTimerList()
      },
      // 获取限时抢购的数据
      getMallTimerList () {
        console.log(this.curHourId, 'this.curHourId')
        this.$api.getMallTimerList({ hour_type: this.curHourId, min_id: this.minId })
          .then(data => {
            console.log('获取限时抢购的数据 ==>', data)
            this.isLoadRefresh = false
            this.isLoading = false
            if (data.code === 1) {
              const list = mallUnifiedFormat(data.data, 'hdk', 8)
              this.minId = data.min_id
              console.log('list ==>', list)
              this.proList = list
            } else {
              this.isLoadRefresh = false
              this.isLoading = false
              this.isFinished = true
            }
          })
      },

      // 查看商品详情
      handleMallDetail (item) {
        setStore('mallInfo', item, 'localStorage')
        if (this.curTab > this.curHourIndex) {
          this.$toast('未到开抢时间')
        } else {
          this.$router.push({ path: "/mall_detail", query: { id: item.id, type: item.curType } });
        }

      },

      // refreshList () {
      //   this.min_id = 1
      //   console.log('下拉刷新')
      //   this.isLoadRefresh = true
      //   this.getMallTimerList()
      // },
      // pullList () {
      //   console.log('上拉加载')
      //   // this.page++
      //   this.getMallTimerList()
      // },
    },
    created () {
      const hour = new Date().getHours()
      const aound = this.tabList.slice(5, 11)
      console.log(hour)
      console.log(aound)
      const it = aound.find(it => {
        if (it.label > hour) {
          return it
        }
      })
      const i = aound.findIndex(it => {
        if (it.label > hour) {
          return it
        }
      })
      console.log(it, i)
      this.curHour = hour
      this.curHourIndex = 4 + i
      this.curHourId = this.tabList[4 + i].id
      console.log(this.curHourIndex, this.curHourId, 'ppppppppppppppppp')
      this.curTab = this.curHourIndex

      this.getMallTimerList()
    }
  }
</script>

<style lang="scss">
  .limited_time {
    .van-tabs__nav {
      padding-top: 8px;
      background: #ff4c4c;
    }
    .van-tabs__wrap--scrollable .van-tab {
      flex: 0 0 20% !important;
      flex-basis: 20% !important;
    }
    .van-tabs--line {
      padding-top: 62px;
    }
    .van-tabs--line .van-tabs__wrap {
      height: 62px;
    }
    .van-tab {
      height: 26px;
      line-height: 26px;
      color: #fff;
      font-size: 18px;
    }
    .van-tab--active {
      background: #fff;
      border-radius: 45px;
      color: #ff4c4c;

      .status {
        color: #fff;
      }
    }
    .status {
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
    }

    .limited_time {
      padding-left: 15px;
      background: #fff;
    }

    // 列表
    .mall_list {
      padding-left: 15px;
      background: #fff;
    }
    .item {
      display: flex;
      padding: 15px 15px 15px 0;
    }
    .img {
      position: relative;
      width: 115px;
      height: 115px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .medal {
      position: absolute;
      top: 5px;
      left: 5px;
      width: 21px;
      height: 29px;
      img {
        width: 100%;
      }
    }

    .info {
      flex: 1;
      margin-left: 10px;
      max-width: 11.733333rem;
    }

    .medal_sort {
      position: absolute;
      top: 35%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 12px;
    }
    .volume {
      text-align: center;
      font-size: 12px;
    }
    .volume_num {
      font-size: 16px;
      color: #ff4c4c;
    }

    .mall_type {
      position: relative;
      top: 4px;
      width: 15px;
      height: 15px;
    }

    .params {
      margin: 24px 0 0;
      font-size: 12px;
      line-height: 11px;
      color: #999;
    }
    .price {
      margin-right: 10px;
      color: #ff4c4c;
      font-size: 16px;
      font-weight: bold;
    }

    .coupon {
      display: flex;
      margin-top: 10px;
      width: 120px;
      height: 20px;
      line-height: 20px;
      background: #f4f4f4;
      font-size: 12px;
      border-radius: 2px;
    }
    .coupon_icon {
      margin-right: 6px;
      width: 30px;
      height: 20px;
      text-align: center;
      background: #ff4c4c;
      color: #fff;
      border-radius: 2px;
    }
    .coupon_money {
      white-space: nowrap;
      color: #666;
    }

    .sales {
      font-size: 12px;
      color: #ff4c4c;
    }
  }
</style>
