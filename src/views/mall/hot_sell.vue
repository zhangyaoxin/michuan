<template>
  <div class="hot_sell">
    <div class="item van-hairline--bottom" v-for="(item,index) in proList" :key="index" @click="handleMallDetail(item)">
      <div class="img">
        <div class="medal">
          <img :src="index|filterIcon" alt="">
          <span class="medal_sort">{{index+1}}</span>
        </div>
        <img :src="item.thumbnail" alt="">
      </div>
      <div class="info">
        <div class="volume">近两小时成交 <span class="volume_num">{{item.sales}}</span> 件</div>
        <div class="title ellipsis">
          <img class="mall_type" src="../../assets/images/tb_icon.png" alt="">
          <span>{{item.name}}</span>
        </div>
        <div class="params">
          <span class="price">￥{{Number((item.price - item.price_coupons).toFixed(2))}}</span>
          <del>淘宝价￥{{Number(item.price)}}</del>
        </div>
        <div class="coupon">
          <div class="coupon_icon">
            <div class="font_size_10">券</div>
          </div>
          <div class="coupon_money">
            <div class="font_size_10">{{Number(item.price_coupons/10)}} 蜂蜜抵 ￥{{Number(item.price_coupons)}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  import { mallUnifiedFormat, setStore } from '@/utils/utils'
  export default {
    name: 'hot_sell',
    components: {},
    filters: {
      filterIcon (i) {
        if (i === 0) {
          return require('../../assets/images/hot_1.png')
        } else if (i === 1) {
          return require('../../assets/images/hot_2.png')
        } else if (i === 2) {
          return require('../../assets/images/hot_3.png')
        } else {
          return require('../../assets/images/hot_n.png')
        }
      },
      filterMallIcon (item, icon) {
        const url = item.item_url || ''
        if (url.includes('.taobao.com')) {
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
    data () {
      return {
        icon: {
          tbIcon: require('../../assets/images/tb_icon.png'),
          tmIcon: require('../../assets/images/tm_icon.png'),
          pddIcon: require('../../assets/images/pdd_icon.png'),
        },

        proList: []
      }
    },
    methods: {
      // 获取热销榜
      getHotList () {
        this.$api.getHotList()
          .then(data => {
            console.log(data)
            if (data.result) {
              const list = mallUnifiedFormat(data.result, 'dtk', 7)
              console.log(list)
              this.proList = list
            }
          })
      },

      // 查看商品详情
      handleMallDetail (item) {
        console.log('查看商品详情 ==>', item)
        setStore('mallInfo', item, 'localStorage')
        this.$router.push({ path: "/mall_detail", query: { id: item.id, type: item.curType } });
      },
    },
    created () {
      this.getHotList()
    }
  }
</script>

<style  lang="scss">
  .hot_sell {
    padding-left: 15px;
    background: #fff;
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

    .title {
      color: #999;
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
      margin: 15px 0 5px;
      font-size: 12px;
    }
    .price {
      margin-right: 10px;
      color: #ff4c4c;
      font-size: 16px;
      font-weight: bold;
    }

    .coupon {
      display: flex;
      width: 140px;
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
    }
   
  }
</style>
