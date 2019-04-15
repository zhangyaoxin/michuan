<template>
  <div class="mall_comm_list">
    <div class="item" v-for="(item,index) in list" :key="index" @click="handleMallDetail(item)">
      <div class="img">
        <img :src="item.thumbnail" alt="">
        <div class="pro_sales">销量 {{item.sales}}</div>
      </div>

      <div class="info">
        <div class="title" style="-webkit-box-orient: vertical;-moz-box-orient: vertical;box-orient: vertical;">
          <img class="mall_type" :src="item|filterIcon(icon,curHdkType)" alt="">
          <span>{{item.name}}</span>
        </div>
        <div class="params">
          <span class="price">￥{{Number((item.price - item.price_coupons).toFixed(2))}}</span>
          <del>{{curType|filterType}}￥{{item.price}}</del>
        </div>
        <div class="coupon">
          <div class="coupon_icon">券</div>
          <div class="coupon_money">{{item.price_coupons/10}} 蜂蜜抵 ￥{{Number(Number(item.price_coupons).toFixed(2))}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { setStore } from '@/utils/utils'

  export default {
    name: 'mall_list',
    components: {},
    props: {
      list: Array,
      curHdkType: Number
    },
    filters: {
      filterIcon (item, icon, curHdkType) {
        const type = item.curType !== 0 ? item.curType : curHdkType
        switch (Number(type)) {
          case 2:
            return icon.pddIcon
            break;
          case 3:
            return icon.tmIcon
            break;
          case 9:
            return icon.tmIcon
            break;
          default:
            return icon.tbIcon
            break;
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
          tbIcon: require('../../../assets/images/tb_icon.png'),
          tmIcon: require('../../../assets/images/tm_icon.png'),
          pddIcon: require('../../../assets/images/pdd_icon.png'),
        },
      }
    },
    methods: {
      // 查看商品详情
      handleMallDetail (item) {
        console.log('查看商品详情 ==>', item)
        setStore('mallInfo', item, 'localStorage')
        this.$router.push({ path: "/mall_detail", query: { id: item.id, type: item.curType } });
      },
    },
  }
</script>

<style lang="scss">
  .mall_comm_list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 15px;

    .item {
      margin-bottom: 0.266667rem;
      width: 9.066667rem;
      background: #fff;
      border-radius: 2px;
    }
    .img {
      position: relative;
      width: 9.066667rem;
      height: 9.066667rem;
      // background: #ff4c4c;
      border-radius: 2px 2px 0 0;
      overflow: hidden;
      img {
        width: 100%;
      }
    }

    .pro_sales {
      position: absolute;
      bottom: 0;
      left: 0;
      padding-left: 6px;
      line-height: 18px;
      padding-right: 10px;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      font-size: 12px;
      border-radius: 0 15px 15px 0;
    }

    .info {
      padding: 15px 6px;
    }

    .mall_type {
      width: 15px;
      height: 15px;
    }

    .title {
      height: 32px;
      line-height: 16px;
      font-size: 14px;
      color: #333;
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

    .params {
      font-size: 12px;
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
      height: 20px;
      line-height: 20px;
      background: #f4f4f4;
      font-size: 12px;
      border-radius: 2px;
      color: #666;
    }
    .coupon_icon {
      margin-right: 6px;
      width: 47px;
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
