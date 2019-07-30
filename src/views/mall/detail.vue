<template>
  <div class="mall_detail">
    <!-- 轮播 -->
    <van-swipe class="swipe_wrap" :autoplay="3000" indicator-color="#ff4c4c">
      <van-swipe-item v-for="(item,index) in info.gallery_urls" :key="index">
        <img class="swipe_img" :src="item" />
      </van-swipe-item>
    </van-swipe>

    <div class="pro_info">
      <div class="title" style="-webkit-box-orient: vertical;-moz-box-orient: vertical;box-orient: vertical;">
        <img class="mall_type" :src="info|filterIcon(icon)" alt="">
        <span>{{info.name}}</span>
      </div>
      <div class="params">
        <div class="coupon">
          <div class="coupon_icon">券后价</div>
          <div class="coupon_after">￥{{Number((info.price - info.price_coupons).toFixed(2))}}</div>
          <!-- {{curType|filterType}}  -->
          <del class="coupon_before">￥{{info.price}}</del>
        </div>
        <div class="volume">
          <span>销量:</span>
          <span>{{info.sales}}</span>
        </div>
      </div>
    </div>

    <div class="pro_desc">
      <img :src="item" alt="" v-for="(item,index) in info.gallery_urls" :key="index">
    </div>

    <div class="pro_desc">
      <van-cell title="查看更多宝贝详情" is-link @click="viewProDesc"></van-cell>
    </div>

    <div class="btn_wrap">
      <div class="coupon_info">
        <div class="coupon_price">{{info.price_coupons}}元优惠券</div>
        <div>有效期:{{info.coupon_start_time}}～{{info.coupon_end_time}}</div>
      </div>
      <div class="exchange_btn" @click="handleExchange">领券购买</div>
    </div>

    <van-dialog v-model="isShowMallList" :show-confirm-button="false">
      <div class="code_head" style="text-align:center">淘口令 </div>
      <div id="code_text" class="code_main" style="-webkit-box-orient: vertical;-moz-box-orient: vertical;box-orient: vertical;">{{curMallList}}</div>
      <div class="mall_tip">复制以上淘口令，打开淘宝购买 </div>
      <div class="code_btn van-hairline--top">
        <div class="van-hairline--right" @click="isShowMallList=false">关闭</div>
        <div id="code_confirm" data-clipboard-target="#code_text" data-clipboard-action="copy" style="color:#ff4c4c;">复制</div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { getStore, isWechatrBrowse, browserVersions, mallUnifiedFormat } from '@/utils/utils'
  export default {
    name: 'mall_detail',
    components: {},
    data () {
      return {
        icon: {
          tbIcon: require('../../assets/images/tb_icon.png'),
          tmIcon: require('../../assets/images/tm_icon.png'),
          pddIcon: require('../../assets/images/pdd_icon.png'),
        },
        curId: '',
        info: {
          gallery_urls: []
        },

        isWxBrowse: true,
        isMallTip: false,

        curMallList: '',
        isShowMallList: false,

        curType: '',

        mmList: [
          {
            label: '淘宝',
            type: 1,
            mm: 'mm_284380119_283850435_98186100344'
          },
          {
            label: '天猫',
            type: 3,
            mm: 'mm_284380119_283850435_98186200370'
          },
          {
            label: '聚划算',
            type: 4,
            mm: 'mm_284380119_283850435_100321700471'
          },
          {
            label: '大牌秒杀',
            type: 5,
            mm: 'mm_284380119_283850435_100323850149'
          },
          {
            label: '9.9包邮',
            type: 6,
            mm: 'mm_284380119_283850435_100323900228'
          },
          {
            label: '热销榜',
            type: 7,
            mm: 'mm_284380119_283850435_100323050449'
          },
          {
            label: '限时抢购',
            type: 8,
            mm: 'mm_284380119_283850435_100322850438'
          },
          {
            label: '为您推荐',
            type: 9,
            mm: 'mm_284380119_283850435_100323500378'
          },

        ]
      }
    },
    filters: {
      filterIcon (item, icon) {
        const type = item.curType
        switch (Number(type)) {
          case 2:
            return icon.pddIcon
            break;
          case 3:
            return icon.tmIcon
            break;
          default:
            return icon.tbIcon
            break;
        }
      },
      filterPddNum (num) {
        num = Number(num) / 100
        return num
      },
      filterTimer (timer) {
        return new Date(timer * 1000).format('yyyy-MM-dd')
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
    computed: {
      ...mapState({
        active: state => state.account.account_active,
        userId: state => state.userInfo.id,
        isLogin: state => state.isLogin
      })
    },

    methods: {
      // 获取账户信息
      getAccountInfo () {
        if (this.active) return false
        this.$store.dispatch('getUserAccInfo')
      },

      // 获取拼多多商品详情
      getPddMallDetail (id) {
        const params = {
          goods_id_list: '[' + id + ']'
        }
        this.$api.getPddMallDetail(params)
          .then(data => {
            console.log('获取商品详情 ==>', data)
            const res = mallUnifiedFormat(data.goods_detail_response.goods_details, 'pdd')
            console.log('resresresres ==>', res)
            this.info = res[0]
          })
      },

      // 获取淘宝商品轮播图
      getTbGalleryUrls (id) {
        const params = {
          num_iids: id
        }
        this.$api.getTbGalleryUrls(params)
          .then(data => {
            if (data.tbk_item_info_get_response) {
              const arr = data.tbk_item_info_get_response.results.n_tbk_item[0].small_images.string
              this.$set(this.info, 'gallery_urls', arr)
            }
          })
      },

      // 确认兑换
      async handleExchange () {
        const type = this.curType
        const { id, price_coupons, } = this.info

        const arr = [1, 2, 4, 5, 6, 7, 8, 9]
        console.log(this.info.coupon_link, 'this.info.coupon_link')
        if (this.info.coupon_click_url) {
          var coupon_link = 'https:' + this.info.coupon_click_url.split(':')[1]
        } else {
          coupon_link = 'https:' + this.info.coupon_link.split(':')[1]
        } 

        // 转换链接
        if (type === 2) {
          console.log('pdd需要转换链接')
          coupon_link = await this.generatePddUrl()
        } else if (arr.includes(type)) {
          console.log('需要转换链接')
          coupon_link = await this.conversionSponsoredLinks(type)
        }

        //除拼多多外 其他类型商品需生成淘口令
        let tpwd_link = ''
        if (type !== 2) {
          tpwd_link = await this.createdTpwd(coupon_link)
          console.log('tpwd_link ==>', tpwd_link)
        }

        console.log('最终链接为 ==>', coupon_link)
        this.info.coupon_link = coupon_link
        this.curMallList = coupon_link

        // 在微信浏览器中 显示淘口令
        if (this.isWxBrowse) {
          this.curMallList = tpwd_link
          this.info.tpwd_link = tpwd_link
        }

        if (this.isWxBrowse && type !== 2) {
          this.copyCouponLink()
        } else {
          window.location.href = this.info.coupon_link
        }
      },

      // 蜂蜜不足
      micNoBalance () {
        this.$dialog.confirm({
          message: `当前可用余额不足，请立即充值！`,
          showCancelButton: true,
          confirmButtonText: '充值'
        }).then(() => {
          this.$router.push('account_recharge')
        }).catch(() => { });
      },

      // 重复兑换
      againExchange () {
        this.$dialog.confirm({
          message: `<p>您已兑换过此商品</p><p>点击确定跳转到领券页面</p>`
        })
          .then(() => {
            if (this.isWxBrowse && this.curType !== 2) {
              this.curMallList = this.info.tpwd_link

              this.copyCouponLink()
            } else {
              window.location.href = this.info.coupon_link
            }
          })
          .catch(() => { });
      },

      // 复制优惠券链接
      copyCouponLink () {
        this.isShowMallList = true
        this.$nextTick(() => {
          const btn = document.querySelector('#code_confirm')
          var copyBtn = new ClipboardJS(btn)
          copyBtn.on("success", (e) => {
            // 复制成功
            this.$toast('复制成功')
            this.isShowMallList = false
            // const isIos = browserVersions().ios
            // if (isIos) {
            //   window.location.href = 'http://itunes.apple.com/app/id387682726?sprefer=php056&mt=8'
            // }
            e.clearSelection();
          });
          copyBtn.on("error", function (e) {
            //复制失败；
            console.log(e.action)
          });
        })
      },

      // 生成推广链接
      generatePddUrl () {
        const params = {
          goods_id_list: '[' + this.curId + ']',
          custom_parameters: this.userId,
        }
        return this.$api.generatePddUrl(params)
          .then(data => {
            console.log('生成推广链接 ==>', data)
            return data.goods_promotion_url_generate_response.goods_promotion_url_list[0].mobile_url
          })
      },

      // 转换推广链接（好单库，大淘客）
      conversionSponsoredLinks (type) {
        const pid = this.mmList.find(it => it.type === type)
        return this.$api.conversionSponsoredLinks({ itemid: this.curId, pid: pid.mm })
          .then(data => {
            return data.data.coupon_click_url
          })
      },

      // 生成淘口令
      createdTpwd (url) {
        return this.$api.createdTpwd({ text: this.info.name, url, logo: this.info.thumbnail })
          .then(data => {
            if (data.tbk_tpwd_create_response) {
              return data.tbk_tpwd_create_response.data.model
            } else {
              return url
            }

          })
      },

      // 查看广告详情
      viewProDesc () {
        window.location.href = this.info.detail_url
      }
    },

    created () {
      this.getAccountInfo()

      this.isWxBrowse = isWechatrBrowse()

      this.curId = this.$route.query.id
      const curType = this.$route.query.type
      this.curType = curType
      if (curType == 2) {
        this.getPddMallDetail(this.curId)
      } else {
        const info = JSON.parse(getStore('mallInfo', 'localStorage'))
        this.info = info
        console.log(this.info)
        this.getTbGalleryUrls(this.curId)
      }
    }
  }
</script>

<style  lang="scss">
  .mall_detail {
    padding-bottom: 60px;

    .swipe_wrap {
      height: 375px;
      background: #fff;
    }

    .swipe_img {
      width: 100%;
      height: 100%;
    }

    .pro_info {
      padding: 15px;
      background: #fff;
    }

    .title {
      font-size: 16px;
      font-weight: bold;
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
      margin-top: 10px;
    }

    .params,
    .coupon {
      display: flex;
      align-items: center;
    }
    .coupon {
      flex: 1;
    }
    .coupon_icon {
      display: inline-block;
      margin-right: 5px;
      padding: 0 5px;
      height: 18px;
      text-align: center;
      line-height: 18px;
      font-size: 12px;
      background: #ff4c4c;
      border-radius: 2px;
      color: #fff;
    }

    .coupon_after {
      margin-right: 5px;
      font-size: 24px;
      color: #ff4c4c;
      font-weight: bold;
    }

    .coupon_before {
      margin-left: 10px;
      font-size: 14px;
      line-height: 14px;
      height: 10px;
      color: #999;
    }
    .volume {
      color: #999;
    }

    .pro_desc {
      margin-top: 10px;
      img {
        width: 100%;
      }
    }
    .van-cell__title {
      font-size: 16px;
    }
    .van-dialog__message {
      font-size: 16px;
      color: #000;
    }

    .code_head {
      font-weight: 500;
      padding-top: 15px;
      text-align: center;
    }
    .code_main {
      text-align: center;
      padding: 15px;
      font-size: 12px;
      line-height: 1.5;
      word-wrap: break-word;
      word-break: normal;
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
    .mall_type {
      position: relative;
      width: 15px;
      height: 15px;
      top: 4px;
    }
    .mall_tip {
      text-align: center;
      color: red;
      padding-bottom: 10px;
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

    .btn_wrap {
      display: flex;
      align-items: center;
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 50px;
      text-align: center;
      font-size: 18px;
      color: #fff;
      background: #ff4c4c;
    }
    .coupon_info {
      flex: 1;
      line-height: 20px;
      margin-top: 4px;
      font-size: 12px;
      background: #ff4c4c;
      color: #ffd1c7;
    }
    .coupon_price {
      font-size: 18px;
      color: #fff;
    }
    .exchange_btn {
      width: 115px;
      line-height: 50px;
      background: #f33a3a;
      color: #fff9a0;
    }
  }
  .mall_detail_dialog {
    .van-dialog__message {
      text-align: center;
    }
    .van-dialog__confirm {
      color: #ff4c4c;
    }
  }
</style>
