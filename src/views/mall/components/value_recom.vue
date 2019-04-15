<template>
  <div class="value_comm">
    <div class="title">
      <div class="title_icon"></div>
      <div>超值推荐</div>
    </div>

    <div class="list">
      <div class="item" v-for="(item,index) in list" :key="index" @click="handleMallDetail(item)">
        <div class="imgage">
          <img :src="item.thumbnail" alt="">
        </div>

        <div class="info">
          <div class="pro_title ellipsis">{{item.name}}</div>

          <div class="price">
            <span class="discount_price">￥{{Number((item.price-item.price_coupons).toFixed(2))}}</span>
            <del class="original_price">￥{{Number(Number(item.price).toFixed(2))}}</del>
          </div>

          <div class="coupon">
            <div class="coupon_icon">
              <div class="font_size_10">券</div>
            </div>
            <div class="coupon_price">
              <div class="font_size_10">{{item.price_coupons}}元</div>
            </div>
          </div>
        </div>

      </div>
      <div style="min-width:10px;"></div>
    </div>
  </div>
</template>

<script>
  import { mallUnifiedFormat, setStore } from '@/utils/utils'
  export default {
    name: 'value_comm',
    data () {
      return {
        list: []
      }
    },
    methods: {
      // 获取超值推荐列表
      getMallRecommendList () {
        this.$api.getMallRecommendList()
          .then(data => {
            console.log(data)
            const arr = mallUnifiedFormat(data.tbk_uatm_favorites_item_get_response.results.uatm_tbk_item, 'tb')
            this.list = arr
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
      this.getMallRecommendList()
    }
  }
</script>

<style lang="scss">
  .value_comm {
    padding-top: 10px;
    .title {
      display: flex;
      align-items: center;
      margin: 10px 15px;
      font-size: 16px;
      line-height: 15px;
      font-weight: bold;
    }
    .title_icon {
      margin-right: 5px;
      width: 15px;
      height: 15px;
      background: url("../../../assets/images/value_recomm_icon.png");
      background-size: cover;
    }

    .list {
      margin-top: 15px;
      display: flex;
      overflow: auto;
    }

    .list::-webkit-scrollbar {
      width: 0;
      height: 0;
      border-radius: 2px;
    }

    .list::-webkit-scrollbar-thumb {
      background-color: #c2c2c2;
      background-clip: padding-box;
      min-height: 0;
      border-radius: 2px;
    }

    .item {
      min-width: 105px;
      margin-right: 5px;
      background: #fff;
      border-radius: 2px;

      &:first-child {
        margin-left: 15px;
      }

      &:last-child {
        margin-right: 15px;
      }
    }
    .imgage {
      width: 105px;
      height: 105px;
      overflow: hidden;
      border-radius: 2px 2px 0 0;

      img {
        width: 100%;
      }
    }
    .info {
      padding: 4px 5px 10px;
      font-size: 12px;
    }

    .discount_price {
      color: #e82e19;
      font-size: 14px;
    }
    .original_price {
      color: #999;
    }
    .coupon {
      display: flex;
      align-items: center;
      height: 15px;
      border-radius: 2px;
      background: #f4f4f4;
      font-size: 12px;
      text-align: center;
    }

    .coupon_icon {
      width: 27px;
      line-height: 15px;
      border-radius: 2px;
      color: #fff;
      background: #ff4c4c;
    }
    .coupon_price {
      flex: 1;
      color: #666;
    }
  }
</style>
