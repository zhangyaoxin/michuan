<template>
  <div class="me_sign">
    <div class="sign_header">
      <div class="sign_btn" :class="{'hidden':isSignIn}" @click="signIn"></div>

      <div class="sign_desc">
        <span>已连续签到<span class="col_fff950"> {{days.continuous}} </span>天，累计获得<span class="col_fff950"> {{days.bvt}} </span>蜂蜜</span>
      </div>

      <div class="sign_day">
        <div class="day_line"></div>
        <div class="day_list">
          <div v-for="index in 7" :key="index">
            <div class="day_item_outer">
              <div class="day_item" :class="changeBvt(index)">{{'+'+index}}</div>
              <div class="day_time">{{changeTime(index)}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sign_main">
      <div class="sign_title">签到规则说明</div>
      <div class="sign_content">
        <p>1. 签到送蜂蜜，连续签到有奖，7天一个周期，奖励方式 如下：第1天1蜂蜜，第2天2蜂蜜，第3天3蜂蜜，第4天4 蜂蜜，第5天5蜂蜜，第6天6蜂蜜，第7天7蜂蜜；</p>
        <p>2. 若中途中断，连续签到天数重新计算。</p>
      </div>
      <div class="sign_icon">
        <img src="../../assets/images/sign_icon.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'me_sign',
    props: {

    },
    components: {

    },
    data () {
      return {
        days: {
          bvt: 0,
          continuous: 0,
          lastDay: 0
        }
      }
    },
    computed: {
      // 是否已经签到了
      isSignIn () {
        const lastDay = this.days.lastDay
        // 今天的0点
        const newDay = new Date(new Date().toLocaleDateString()).getTime()
        console.log(newDay, lastDay)
        return lastDay > newDay
      }
    },
    methods: {
      // 获取签到信息
      getSignInfo () {
        const that = this
        // this.$api.getSignInfo()
        //   .then(function (res) {
        //     console.log(res.data, 'ooooooo')
        //     const data = res.data
        //     if (data.status) {
        //       if (data.msg === '该用户还没有签到过！') {
        //         that.days.lastDay = new Date().getTime() - 86400000
        //       } else {
        //         const { last_sign_time, total_days, total_mic_get } = data.data
        //         that.days.bvt = Number(total_mic_get)
        //         that.days.continuous = total_days
        //         that.days.lastDay = Number(last_sign_time) * 1000
        //       }
        //     }
        //   })
      },

      // 签到
      signIn () {
        const that = this
        this.$toast('签到')
        if (!this.isSignIn) {
          // this.$api.userSignIn()
          //   .then(function (res) {
          //     console.log('用户签到 ==>', res.data)
          //     const data = res.data
          //     if (data.status) {
          //       that.getSignInfo()
          //     }
          //   })
        }
      },

      changeBvt (i) {
        const continuous = this.days.continuous
        let last = continuous % 7
        if (last === 0 && this.isSignIn) last = 7
        if (last >= i) return 'active'
      },

      changeTime (i) {
        let last = this.days.continuous % 7
        if (this.isSignIn && last === 0) last = 7
        const lastDay = this.days.lastDay
        const time = new Date(lastDay - ((last - i) * 86400000)).format('MM.dd')
        return time
      }
    },
    created () {
      // this.getSignInfo()
    }
  }
</script>

<style lang="scss">
  .me_sign {
    .sign_header {
      box-sizing: border-box;
      height: 15.306667rem;
      background: url("../../assets/images/sign_bg.png");
      background-size: cover;
      text-align: center;
    }

    .sign_btn {
      margin: 0 auto;
      width: 8.053333rem;
      height: 8.053333rem;
      background: url("../../assets/images/sign_btn_hl.png");
      background-size: cover;
      border-radius: 100%;
      color: #f87873;
    }

    .sign_btn.hidden {
      background: url("../../assets/images/sign_btn.png");
      background-size: cover;
    }

    .sign_desc {
      margin-top: -1.413333rem;
      font-size: 0.746667rem;
      color: #fff;
    }

    .sign_day {
      position: relative;
      margin-top: 2.893333rem;
      box-sizing: border-box;
      height: 4.266667rem;
    }

    .day_line {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      height: 0.106667rem;
      background: #ff2f49;
    }

    .day_list {
      display: flex;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      justify-content: space-around;
      z-index: 999;
      font-size: 0.746667rem;
      color: #ff2f49;
    }

    .day_item_outer {
      background: #fce7e2;
    }

    .day_item {
      margin: 0.106667rem;
      width: 1.76rem;
      height: 1.76rem;
      box-sizing: border-box;
      line-height: 1.76rem;
      border: 1px solid #ff2f49;
      border-radius: 100%;
      background: #fce7e2;
    }

    .day_item.active {
      background: #ff2f49;
      color: #fff;
    }

    .day_time {
      color: #f88173;
    }

    .sign_main {
      padding: 1.6rem 0.8rem;
      margin-top: 0.533333rem;
      background: #fff;
    }

    .sign_title {
      position: relative;
      padding-left: 0.533333rem;
      line-height: 0.853333rem;
      color: #333;
      font-size: 0.853333rem;
    }

    .sign_title::before {
      content: "";
      position: absolute;
      left: 0;
      width: 0.213333rem;
      height: 0.853333rem;
      background: #ff2f49;
    }

    .sign_content {
      margin-top: 0.96rem;
      font-size: 0.746667rem;
      color: #666;
    }

    .sign_icon {
      margin: 2.293333rem auto;
      width: 11.146667rem;
      height: 5.333333rem;
    }

    .sign_icon img {
      width: 100%;
    }
  }
</style>
