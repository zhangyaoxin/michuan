<template>
  <div class="recharge_result">
    <div class="status" :class="{'fail':!status}">
      <van-icon name="passed" v-if="status" />
      <van-icon name="info-o" v-else />
      <div class="header_success">{{status?'充值成功':'充值失败'}}</div>
    </div>

    <div class="main" v-if="status">
      <div>充值{{amount}}元,获得</div>
      <div class="mic"><span>{{Number(amountMic)}}</span>蜂蜜</div>
    </div>

    <div class="btn" @click="confirmBtn">完成</div>
  </div>
</template>

<script>
  export default {
    name: 'recharge_result',
    components: {},
    data () {
      return {
        curId: '',

        status: false,

        amount: '0.01',
        amountMic: '1',

        timer: null,
        count: 0
      }
    },
    methods: {
      // 获取充值结果
      getOrderResult () {
        const id = this.curId
        this.$toast.loading({
          mask: true,
          duration: 0,
          message: '查询中...'
        });
        this.$api.getOrderResult(4, id)
          .then(data => {
            console.log('获取充值结果 ==>', data)
            if (data.status) {
              if (data.data.status === 1) {
                this.$toast.success('查询成功')
                this.status = true
                this.amount = data.data.amount
                this.amountMic = data.data.amount_mic
              } else if (data.data.status === 2) {
                this.status = false
              } else {
                if (this.count > 3) {
                  this.$toast.fail('查询失败,请稍后再试')
                  setTimeout(() => {
                    this.$router.replace('me_account')
                  }, 3000);
                  return false
                }
                setTimeout(() => {
                  this.count++
                  this.getOrderResult()
                }, 1000);
              }
            }
          })
      },

      confirmBtn () {
        this.$router.replace('me_account')
      }
    },
    created () {
      this.curId = this.$route.query.id
      if (this.curId) {
        this.getOrderResult()
      }
    },
  }
</script>

<style  lang="scss">
  .recharge_result {
    height: 100%;
    background: #fff;
    .van-icon {
      margin-bottom: 15px;
      font-size: 32px;
    }
    .status {
      padding-top: 100px;
      text-align: center;
      font-size: 16px;
      color: #ff4c4c;
    }
    .fail {
      padding-top: 150px;
    }
    .main {
      margin-top: 50px;
      text-align: center;
      font-size: 0.746667rem;
      letter-spacing: 2px;
    }
    .mic {
      margin-top: 20px;
      font-size: 1.813333rem;
      font-weight: bold;
      span {
        position: relative;
        top: 4px;
        font-size: 42px;
      }
    }
    .btn {
      margin: 80px auto 0;
      width: 163px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      border: 1px solid #ff4c4c;
      border-radius: 4px;
      color: #ff4c4c;
    }
  }
</style>
