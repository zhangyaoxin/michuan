<template>
  <div class="coupon_tmp" :class="{'mar_top':couponList.length}">

    <section class="coupon_wrap">
      <div class="coupon_item van-hairline--bottom" @click="editCoupon(index)" v-for="(item,index) in couponList" :key="index">
        <div class="coupon_card">
          <div class="user">
            <div class="user_mask"></div>
            <img :src="userInfo.thumbnail|filterImg" alt="">
          </div>
          <div class="info" :class="{'info_len':item.amount.length>2}">
            <div class="symbol" v-if="item.type===1">￥</div>
            <div class="money">{{Number(item.amount)}}</div>
            <div class="discount" v-if="item.type===2">折</div>
            <div class="desc">
              <p>@{{userInfo.nickname}}</p>
              <p>{{item.describe}}</p>
              <p>有效期至{{item.expire_time|filterDate}}</p>
            </div>
          </div>
        </div>
        <div class="tip">距离获得优惠券还需要 {{item.share_times}} 人浏览您的分享，加油!</div>
      </div>
    </section>

    <section class="no_add" @click="addCoupon">
      <img src="../../../assets/images/put_coupon_icon.png" alt="">
      <span>添加优惠券</span>
    </section>

    <van-actionsheet v-model="isShowCouponMd" :actions="curActions" cancel-text="放弃操作" @select="selectCouponType" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: '_tmp',
    components: {},
    data () {
      return {
        opsType: 'add',
        isShowCouponMd: false,
        allAction: [
          [
            {
              name: '满减优惠券',
              path: 'reduce'
            },
            {
              name: '折扣优惠券',
              path: 'discount'
            }
          ],
          [
            {
              name: '编辑',
              path: 'reduce'
            },
            {
              name: '修改为折扣优惠券',
              path: 'discount'
            },
            {
              name: '删除',
              path: 'del'
            }
          ],
          [
            {
              name: '编辑',
              path: 'discount'
            },
            {
              name: '修改为满减优惠券',
              path: 'reduce'
            },
            {
              name: '删除',
              path: 'del'
            }
          ],
        ],

        curActions: [],
      }
    },
    computed: {
      ...mapState({
        userInfo: state => state.userInfo,
        couponList: state => state.ad.couponList,
        curCouponIndex: state => state.ad.curCouponIndex
      })
    },
    methods: {
      addCoupon () {
        this.opsType = 'add'
        this.isShowCouponMd = true
        this.curActions = this.allAction[0]
      },

      editCoupon (i) {
        this.opsType = 'edit'
        const type = this.couponList[i].type
        this.curActions = this.allAction[type]
        this.$store.commit('changeAd', { type: 'curCouponIndex', val: i })
        this.isShowCouponMd = true
      },

      selectCouponType (item) {
        const opsType = this.opsType
        this.isShowCouponMd = false

        // 删除操作
        if (item.path === 'del') {
          this.$dialog.confirm({
            title: '温馨提示',
            message: '确认要删除此优惠券码？'
          }).then(() => {
            const id = this.couponList[this.curCouponIndex].id
            console.log(id)
            if (!id) {
              this.$store.commit('delCurCoupon')
            } else {
              this.$api.delCouponInfo(id)
                .then(data => {
                  console.log(data)
                  if (data.status) {
                    this.$store.commit('delCurCoupon')
                  }
                })
            }
          })
          return false
        }

        this.$router.push({ path: item.path, query: { ...this.$route.query, type: opsType } })
      },
    },
  }
</script>

<style lang="scss">
  .coupon_tmp {
    padding: 0.8rem;
    background: #fff;
    overflow: hidden;
  }

  .coupon_wrap {
    .coupon_item {
      margin-bottom: 10px;
      padding-bottom: 5px;
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
      background-size: cover;
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
      right: 10px;
    }

    .tip {
      margin-top: 0.266667rem;
      text-align: center;
      font-weight: bold;
      font-size: 0.64rem;
      color: #333;
    }
  }
</style>
