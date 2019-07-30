<template>
  <div class="main">
    <div class="account_top">
      <div class="common_account">
        <div class="common_main">
          <div>通用账户(蜂蜜）</div>
          <div>{{Number(account.account_active)}}</div>
          <div>消费无条件抵￥{{Number(account.account_active)|filterPay('pay')}}</div>
        </div>
        <div class="common_bottom">
          <router-link v-if="pointMaster" class="common_ch" :to="{path:'account_withdraw'}">
            <img src="./../../../assets/images/tixian.png" alt="">
            <span>提现</span>
          </router-link>
          <router-link :class="pointMaster ? 'common_mx' : 'common_lx'" :to="{path:'account_detail'}">
            <img src="./../../../assets/images/ming.png" alt="">
            <span>明细</span>
          </router-link>
        </div>
      </div>
      <div class="common_account">
        <div class="common_main">
          <div>VIP账户(蜂蜜）</div>
          <div>{{Number(account.account_cashgift)}}</div>
          <div>消费 购物 电话</div>
        </div>
         <div class="common_bottom">
          <router-link class="common_ch" :to="{path:'account_recharge'}">
            <img src="./../../../assets/images/chongzhi.png" alt="">
            <span>充值</span>
          </router-link>
          <router-link class="common_mx" :to="{path:'account_detail'}">
            <img src="./../../../assets/images/ming.png" alt="">
            <span>明细</span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="exchange_note">
      <div>蜂蜜兑换汇率说明</div>
      <div>蜜传商家消费：1蜂蜜 = {{1|filterPay('pay')}}元</div>
      <div v-if="pointMaster">通用账户提现：1蜂蜜 = {{1|filterBuyExchange('sell')}}元</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      account: state => state.account,
      pointMaster: state => state.pointMaster
    })
  }
}
</script>

<style scoped>
   .main {
     display: flex;
     flex-direction: column;
     height: 100%;
     background-color: #fff;
   }
   .account_top {
     height: 22.133333rem;
     background: url('./../../../assets/images/account_bgm.png');
     background-size: cover;
     padding: .8rem;
   }
   .common_account {
     /* position: relative; */
     height: 10.633333rem;
     background: #fff9f9;
     padding: 0 .8rem;
     margin-bottom: .8rem;
     border-radius: .426667rem;
     box-shadow: -7px -2px 53px rgba(143, 5, 0, 0.1);
   }
   .common_main {
     height: 7.606667rem;
     border-bottom: 1px solid #e8e8e8;
     position: relative;
   }
   .common_main div:nth-child(1) {
     position: absolute;
     top: 25px;
     right: 50%;
     transform: translateX(50%);
     font-size: 12px;
     color: #333;
   }
   .common_main div:nth-child(2) {
     position: absolute;
     top: 54px;
     right: 50%;
     transform: translateX(50%);
     font-size: 36px;
     color: #000;
   }
   .common_main div:nth-child(3) {
     position: absolute;
     top: 93px;
     right: 50%;
     transform: translateX(50%);
     font-size: 10px;
     color: #666;
     padding: 0 .626667rem;
     background: #f4f4f4;
     border-radius: 11.946667rem;
   }
   .common_account div:nth-child(4) {
     padding: 0 .8rem;
     width: 100%;
     height: 1px;
     color: #e8e8e8;
     position: absolute;
     top: 135px;
     right: 0;
   }
   .common_bottom {
     display: flex;
     height: 1.706667rem;
     margin-top: .533333rem;
   }
   .common_ch {
     position: relative;
     flex: 1;
     border-right: 1px solid #e8e8e8;
   }
   .common_ch img {
     position: absolute;
     top: 50%;
     left: 2.4rem;
     transform: translateY(-50%);
     width: .853333rem;
     height: .853333rem;
   }
   .common_ch span {
     position: absolute;
     top: 50%;
     left: 3.52rem;
     transform: translateY(-50%);
     font-size: 14px;
     color: #666;
   }
   .common_mx {
     flex: 1;
     position: relative;
   }
   .common_mx img {
     position: absolute;
     top: 50%;
     left: 2.4rem;
     transform: translateY(-50%);
     width: .853333rem;
     height: .853333rem;
   }
   .common_mx span {
     position: absolute;
     top: 50%;
     left: 3.52rem;
     transform: translateY(-50%);
     font-size: 14px;
     color: #666;
   }
   .common_lx {
     flex: 1;
     position: relative;
   }
   .common_lx img {
     position: absolute;
     top: 50%;
     left: 6.826667rem;
     transform: translateY(-50%);
     width: .853333rem;
     height: .853333rem;
   }
   .common_lx span {
     position: absolute;
     top: 50%;
     left: 8rem;
     transform: translateY(-50%);
     font-size: 14px;
     color: #666;
   }
   .exchange_note {
     padding: .8rem;
   }
   .exchange_note div:nth-child(1) {
     font-size: 18px;
   }
   .exchange_note div:nth-child(2) {
     margin-top: .533333rem;
     font-size: 14px;
     line-height: 16px;
     color: #999;
   }
   .exchange_note div:nth-child(3) {
     font-size: 14px;
     color: #999;
   }
</style>

