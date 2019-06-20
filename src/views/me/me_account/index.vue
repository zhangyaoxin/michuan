<template>
  <div class="me_account">
    <div class="header">
      <div class="use_title">通用账户(蜂蜜)</div>
      <div class="use_num">{{Number(account.account_active)}}</div>
    </div>
    <!-- <div class="header">
      <div class="use_title">总资产(蜂蜜)</div>
      <div class="use_num">{{account.account_publish}}</div>
      <div class="user_mic">购物可抵 {{(account.account_publish*10).toFixed("1")}} 元</div>
    </div>
    <div class="total">
      <div class="total_item">
        <div>累计收益(蜂蜜)</div>
        <div>{{Number(account.total_get)}}</div>
      </div>
      <div class="total_item">
        <div>
          <span>可用金额(蜂蜜)</span>
          <van-icon class="active_tip" name="question-o" @click="activeTip" />
        </div>
        <div>{{Number(account.account_active)}}</div>
      </div>
    </div> -->

    <van-cell-group class="cell_group">
      <van-cell :title="item.title" is-link :to="item.route" v-for="(item,index) in upgradeList" :key="index">
        <img class="list_icon" slot="icon" :src="item.icon" alt="">
      </van-cell>
    </van-cell-group>

    <!-- <div class="mic_about">
      <img src="../../../assets/images/michuan.png" alt="">
    </div> -->
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  export default {
    name: 'me_account',

    data () {
      return {
        upgradeList: [
          {
            icon: require('../../../assets/images/pay.png'),
            title: '充值',
            route: 'account_recharge'
          },
          {
            icon: require('../../../assets/images/withdraw.png'),
            title: '提现',
            route: 'account_withdraw'
          },
          {
            icon: require('../../../assets/images/detailed.png'),
            title: '明细',
            route: 'account_detail',
          }
        ],
      }
    },
    computed: {
      ...mapState({
        account: state => state.account
      }),
    },

    methods: {
      activeTip () {
        this.$dialog.alert({
          message: '可用金额=总资产-发布冻结金额（“我的发布”中已上架内容的预算余额之和）'
        }).then(() => { });
      }
    },
    created () {
      // 获取账户信息
      // this.$store.dispatch('getUserAccInfo')
    },
  }
</script>

<style lang="scss">
  .me_account {
    .header {
      padding-top: 1.12rem;
      height: 5.826667rem;
      box-sizing: border-box;
      background: url("../../../assets/images/account.png");
      background-size: cover;
      color: #fff;
      text-align: center;
    }
    .use_title {
      color: rgba(255, 255, 255, 0.6);
    }
    .use_num {
      margin: 12px;
      font-size: 1.92rem;
      font-weight: bold;
    }
    .user_mic {
      margin: 7px;
      font-size: 0.853333rem;
      color: rgba(255, 255, 255, 0.8);
    }
    .total {
      display: flex;
      align-items: center;
      text-align: center;
      height: 3.306667rem;
      color: #fff;
      background-image: linear-gradient(90deg, #ff5737 0%, #ff6149 100%),
        linear-gradient(#ff4c4c, #ff4c4c);
    }
    .total_item {
      width: 50%;
      line-height: 18px;
      font-size: 18px;
    }
    .total_item div:first-child {
      font-size: 0.64rem;
      color: rgba(255, 255, 255, 0.6);
    }
    .active_tip {
      position: relative;
      top: 3px;
      font-size: 14px;
    }
    .cell_group {
      margin-top: 10px;
    }
    .van-cell {
      padding: 12px 15px;
      align-items: center;
    }
    .list_icon {
      margin-right: 15px;
      width: 27px;
      height: 27px;
    }
    .mic_about {
      margin-top: 10px;
      img {
        width: 100%;
      }
    }
  }
</style>
