<template>
  <van-actionsheet v-model="isAddBudgetMd" title="增加预算">
    <div class="add_budget_wrap">
      <van-field :value="Number(balance)" label="账号余额" disabled>
        <span slot="icon">蜂蜜</span>
      </van-field>
      <van-field v-model="add_budget" label="追加蜂蜜" type="number">
        <span slot="icon">蜂蜜</span>
      </van-field>

      <div class="budget_btn_wrap">
        <div class="budget_btn confirm" @click="handleAddBudget(add_budget,balance)">确定</div>
        <div class="budget_btn">
          <router-link class="to_recharge" :to="{path:'account_recharge',query:{id:userId}}">去充值</router-link>
        </div>
      </div>
    </div>
  </van-actionsheet>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'add_budget',
    components: {},
    props: {
      isAddBudget: Boolean,
      curAdId: String,
    },
    data () {
      return {}
    },
    computed: {
      ...mapState({
        balance: state => state.account.account_active,
        userId: state => state.userInfo.id
      }),
      isAddBudgetMd: {
        get () {
          return this.isAddBudget
        },
        set (val) {
          this.$emit('update:isAddBudget', val)
        }
      }
    },
    methods: {
      // 增加预算
      handleAddBudget (money, balance) {
        const reg = /^[0-9]\d{0,9}(\.\d{1,8})?$/
        if (!money) {
          this.$toast('请输入增加金额')
          return false
        } else if (!reg.test(money) || money == 0) {
          this.$toast('请输入正确的增加金额')
          return false
        } else if (Number(money) > Number(balance)) {
          this.$toast('可用余额不足')
          return false
        }


        const params = {
          pre_bvt: money,
          status: 4
        }
        this.$api.editAdInfo(params, this.curAdId)
          .then(data => {
            if (data.status) {
              this.isAddBudgetMd = false
            } else {
              this.$toast('增加失败')
            }
          })

      }
    },
    created () {
      this.$store.dispatch('getUserAccInfo')
    }
  }
</script>

<style lang="scss">
  @import "../../assets/css/var";

  .add_budget_wrap {
    padding: 1.066667rem;
    overflow: hidden;

    .add_budget_wrap .van-cell {
      padding-left: 0;
      padding-right: 0;
    }

    .add_budget_wrap .van-cell:not(:last-child)::after {
      left: 0;
    }

    .budget_btn_wrap {
      margin-top: 1.066667rem;
      text-align: center;
      font-size: 0.8rem;
    }
    .budget_btn {
      width: 100%;
      height: 2.026667rem;
      line-height: 2.026667rem;
      color: #999;
      background: #eee;
      border-radius: 0.213333rem;
    }

    .budget_btn.confirm {
      margin-bottom: 0.533333rem;
      background: $mc_color;
      color: #fff;
    }

    .go_recharge_wrap {
      margin-top: 1.066667rem;
      text-align: right;
      font-size: 0.64rem;
    }
    .to_recharge {
      color: $mc_color;
    }
  }
</style>
