<template>
  <div class="coupon_list_wrap" v-show="info.coupon.length">
    <div>
      <div class="coupon_item" :class="{'van-hairline--bottom':info.coupon.length>index+1}" v-for="(item,index) in info.coupon" :key="index" @click="useCoupon(item,index)">
        <div v-if="item.has_used_coupon===0">
          <div class="coupon_card" :class="{'used_coupon':item.left_earn_times!==0}">
            <div class="user">
              <div class="user_mask"></div>
              <img :src="info.writer.thumbnail|filterImg('avatar')" alt="">
            </div>
            <div class="info" :class="{'info_len':String(Number(item.amount)).length>2}">
              <div class="symbol" v-if="item.type===1">￥</div>
              <div class="money">{{Number(item.amount)}}</div>
              <div class="discount" v-if="item.type===2">折</div>
              <div class="desc">
                <p>@{{info.writer.nickname}}</p>
                <p>{{item.describe}}</p>
                <p>有效期至 {{item.expire_time|filterDate}}</p>
              </div>
            </div>
          </div>
          <div class="tip" v-if="item.left_earn_times!==0">距离获得优惠券还需要 {{item.left_earn_times}} 人浏览您的分享，加油!</div>
        </div>
        <div class="receive_coupon" v-else> 您与 {{item.receive_coupon_time}} 中领取过此优惠券 </div>
      </div>
    </div>
    <!-- 优惠码 -->
    <van-dialog v-model="isShowCouponCode" :show-confirm-button="false">
      <div class="code_head" style="text-align:center">您的优惠码是：</div>
      <div id="code_text" class="code_main">{{curCouponCode}}</div>
      <div class="code_btn van-hairline--top">
        <div class="van-hairline--right" @click="isShowCouponCode=false">关闭</div>
        <div id="code_confirm" data-clipboard-target="#code_text" data-clipboard-action="copy" style="color:#65d0cd;">复制</div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
  export default {
    name: 'card_coupon',
    components: {},
    props: {
      info: Array
    },
    data () {
      return {
        isShowCouponCode: false,
        curCouponCode: '',
      }
    },
    methods: {
      // 使用优惠券
      useCoupon (item, i) {
        const leftTimes = item.left_earn_times === 0
        const used = item.has_used_coupon === 0
        if (leftTimes) {
          const type = item.destroy_type
          console.log('使用优惠券', type)
          if (type === 0) {
            if (used) {
              this.userCouponType1(item.go_use_coupon_id, i)
            }
          } else if (type == 1) {
            this.curCouponCode = item.coupon_number
            this.isShowCouponCode = true
            this.$nextTick(() => {
              const btn = document.querySelector('#code_confirm')
              var copyBtn = new ClipboardJS(btn)
              copyBtn.on("success", (e) => {
                // 复制成功
                console.log('复制成功==>', e)
                this.showCode = false
                e.clearSelection();
              });
              copyBtn.on("error", function (e) {
                //复制失败；
                console.log(e.action)
              });
            })
          } else if (type == 2) {
            window.location.href = item.coupon_link
          }
        }
      },

      // 使用优惠券类别1
      userCouponType1 (id, i) {
        this.$dialog.confirm({
          message: '确认使用优惠券',
        })
          .then(() => {
            const coupon_id = id
            this.$api.useCardCoupon({ coupon_id })
              .then(({ data }) => {
                console.log('使用卡券结果 ==>', data)
                if (data.status) {
                  this.info.coupon[i].has_earn_coupon = 1
                } else {
                  this.$toast(data.msg)
                }
              })
          })
          .catch(function () { })
      },
    },
    mounted () {

    }
  }
</script>

<style lang="scss">
  .coupon_list_wrap {
    padding: 15px 15px 6px 15px;
    background: #fff;
    overflow: hidden;
    .coupon_item {
      padding: 10px 0;
    }
    .coupon_item:first-child {
      padding-top: 0;
    }

    .van-hairline--bottom::after {
      width: 240%;
      margin-left: -50px;
    }

    .coupon_card {
      position: relative;
      height: 70px;

      background: url("../../../assets/images/coupon_icon.png");
      background-size: 100% 70px;
      color: #fff;
    }

    .used_coupon {
      background: url("../../../assets/images/used_coupon_icon.png");
      background-size: 100% 70px;

      .user_mask {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0.8;
      }
    }

    .user {
      position: absolute;
      top: 8px;
      left: 20px;
      width: 2.666667rem;
      height: 2.666667rem;
      border: 2px solid #fff;
      border-radius: 100%;
      overflow: hidden;

      img {
        width: 100%;
      }
    }

    .user_mask {
      display: none;
      width: 100%;
      height: 100%;
      background: #ffb4c4;
    }

    .info_wrap {
      max-width: 245px;
    }

    .info {
      display: flex;
      align-items: center;
      position: absolute;
      top: 0;
      right: 25px;
      height: 100%;
      font-size: 12px;
    }

    .symbol {
      position: relative;
      top: 11px;
      left: 4px;
      font-size: 20px;
    }

    .discount {
      position: relative;
      top: 13px;
      left: -8px;
      font-size: 15px;
    }

    .money {
      margin-right: 10px;
      font-size: 50px;
      font-weight: bold;
    }

    .desc {
      line-height: 16px;
    }

    .info_len {
      right: 16px;
      .symbol {
        top: 7px;
      }
      .money {
        margin-right: 10px;
        font-size: 40px;
        font-weight: bold;
      }
    }

    .tip {
      margin-top: 8px;
      line-height: 12px;
      text-align: center;
      font-weight: bold;
      font-size: 0.64rem;
      color: #333;
    }
    .receive_coupon {
      text-align: center;
      color: #000;
      font-weight: bold;
    }

    .code_head {
      font-weight: 500;
      padding-top: 15px;
      text-align: center;
    }
    .code_main {
      text-align: center;
      padding: 15px;
      font-size: 24px;
      letter-spacing: 5px;
      color: red;
      line-height: 1.5;
    }
    .code_btn {
      display: flex;
    }
    .code_btn > div {
      width: 100%;
      height: 50px;
      line-height: 48px;
      text-align: center;
    }
  }
</style>
