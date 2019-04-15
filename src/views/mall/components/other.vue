<template>
  <div class="mall_other">
    <router-link to="timer_list" class="limited_time">
      <div class="title">
        <div class="txt"></div>
        <div class="timer">
          <div class="timer_h">
            <div class="font_size_10">{{curHour}}点场</div>
          </div>
          <div class="font_size_10">{{h}}:{{m}}:{{s}}</div>
        </div>
      </div>

      <div class="tip font_size_10">领券最高减1000元</div>
      <div class="commodity">
        <div class="price">
          <div class="discount_price">￥{{Number(info.itemendprice)}}</div>
          <del class="original_price">
            <div class="font_size_10">￥{{Number(info.itemprice)}}</div>
          </del>
        </div>
        <div class="info">
          <img :src="info.itempic" alt="">
        </div>
      </div>
    </router-link>

    <div class="other">
      <router-link to="hot_list" class="item">
        <img src="../../../assets/images/mall_hot_bg.png" alt="">
      </router-link>
      <router-link to="9.9_list" class="item">
        <img src="../../../assets/images/mall_9.9_bg.png" alt="">
      </router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'mall_other',
    components: {},
    data () {
      return {
        info: {},

        curHour: '',
        curHourIndex: '',
        curHourId: '',
        nextHour: '',
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

        timer: null,
        toTimer: '',
        h: '00',
        m: '00',
        s: '00',

      }
    },
    methods: {
      // 获取限时抢的数据
      getMallTimerList () {
        this.$api.getMallTimerList({ page: 1, hour_type: this.curHourId })
          .then(data => {
            console.log(data)
            if (data.code === 1) {
              this.info = data.data[0]
            }
          })
      },

      countdown () {
        const year = new Date().getFullYear()
        const month = new Date().getMonth()
        const day = new Date().getDate()

        this.toTimer = new Date(year, month, day, this.nextHour, 0, 0);

        this.timer = setInterval(this.antitime, 1000);
      },

      antitime () {
        const now = new Date();
        const deltaTime = this.toTimer - now;

        if (deltaTime <= 0) {
          window.clearInterval(this.timer);
          return;
        }

        const h = Math.floor(deltaTime / (3600 * 1000));

        const m = Math.floor(deltaTime / (60 * 1000) % 60);

        const s = Math.floor(deltaTime / 1000 % 60);

        const ms = Math.floor(deltaTime % 1000 / 10);

        this.h = h < 10 ? "0" + h : h
        this.m = m < 10 ? "0" + m : m
        this.s = s < 10 ? "0" + s : s
      }
    },
    created () {
      const hour = new Date().getHours()
      const aound = this.tabList.slice(5, 11)
      const i = aound.findIndex(it => {
        if (it.label > hour) {
          return it
        }
      })
      this.curHour = this.tabList[4 + i].label
      this.curHourId = this.tabList[4 + i].id
      this.nextHour = this.tabList[5 + i].label

      this.getMallTimerList()
      this.countdown()
    }
  }
</script>

<style lang="scss">
  .mall_other {
    display: flex;
    padding: 10px 15px;

    .limited_time {
      padding: 7px 9px 9px;
      box-sizing: border-box;
      width: 173px;
      height: 155px;
      background: #fff;
      border-radius: 2px;
    }

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .txt {
      width: 55px;
      height: 13.5px;
      background: url("../../../assets/images/mall_timer_icon.png") no-repeat;
      background-size: 55px 13.5px;
    }

    .timer {
      display: flex;
      border: 1px solid #e82e19;
      border-radius: 2px;
      font-size: 12px;
      line-height: 15px;
    }

    .timer_h {
      height: 15px;
      border-radius: 0 2px 2px 0;
      background: #e82e19;
      color: #fff;
    }
    .tip {
      margin-left: -15px;
      color: #999;
    }

    .commodity {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .price {
        width: 55px;
        height: 55px;
        border-radius: 100%;
        line-height: 16px;
        text-align: center;
        letter-spacing: -1px;
        background-image: linear-gradient(-4deg, #e82e19 0%, #ff7b5c 100%),
          linear-gradient(#f4f4f4, #f4f4f4);
        color: #fff;
      }
    }
    .discount_price {
      margin-top: 16px;
      font-size: 16px;
    }

    .original_price {
      color: rgba(255, 255, 255, 0.6);
    }
    .info {
      width: 90px;
      height: 90px;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .other {
      flex: 1;
      margin-left: 5px;
      border-radius: 2px;
    }

    .item {
      display: block;
      width: 100%;
      height: 75px;
      background: #fff;
      border-radius: 2px;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    .item:first-child {
      margin-bottom: 5px;
    }
  }
</style>
