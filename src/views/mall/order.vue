<template>
  <div class="mall_order">
    <van-pull-refresh v-model="isLoadRefresh" @refresh="refreshList">
      <van-list v-model="isLoading" :finished="isFinished" @load="pullList">
        <div class="item van-hairline--bottom" v-for="(item,index) in proList" :key="index" @click="jumpRoute(item.content.coupon_link,item.trade_type,item)">
          <div class="cover">
            <img :src="item.content.thumbnail" alt="">
          </div>
          <div class="info">
            <div class="title" style="-webkit-box-orient: vertical;-moz-box-orient: vertical;box-orient: vertical;">
              <img class="mall_type" :src="item|filterIcon(icon)" alt="">
              <span>{{item.content.name}}</span>
            </div>
            <div class="coupon">
              <div class="coupon_icon">
                <div class="font_size_10">券后价</div>
              </div>
              <div class="coupon_after">￥{{Number(((item.content.price) - item.coupon).toFixed(2)) }}</div>
              <!-- {{item.trade_type|filterType}} -->
              <div class="coupon_before"> ￥{{item.content.price}}</div>
            </div>
            <div class="ord_info">
              <div class="ord_time">{{item.created_at}}</div>
              <div class="ord_num">订单号:{{item.trade_code}}</div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <div class="nothing_wrap" v-if="!isLoading&&!isLoadRefresh&&proList.length===0">
      <img class="nothing_icon" src="../../assets/images/nothing.png" alt="">
      <p class="fans_title">暂无订单～</p>
    </div>

    <van-dialog v-model="isShowMallList" :show-confirm-button="false">
      <div class="code_head" style="text-align:center">淘口令</div>
      <div id="code_text" class="code_main">{{curMallList}}</div>
      <div class="mall_tip">复制以上淘口令，打开淘宝购买</div>
      <div class="code_btn van-hairline--top">
        <div class="van-hairline--right" @click="isShowMallList=false">关闭</div>
        <div id="code_confirm" data-clipboard-target="#code_text" data-clipboard-action="copy" style="color:#ff4c4c;">复制</div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
  import { isWechatrBrowse, browserVersions } from '@/utils/utils'
  export default {
    name: 'mall_order',
    components: {},
    data () {
      return {
        page: 0,

        proList: [],

        isLoadRefresh: false,
        isLoading: false,
        isFinished: false,

        isWxBrowse: false,

        isShowMallList: false,
        curMallList: '',

        icon: {
          tbIcon: require('../../assets/images/tb_icon.png'),
          tmIcon: require('../../assets/images/tm_icon.png'),
          pddIcon: require('../../assets/images/pdd_icon.png'),
        },
      }
    },
    filters: {
      filterIcon (item, icon) {
        const url = item.content.coupon_link || ''
        if (url.includes('taobao.com')) {
          return icon.tbIcon
        } else if (url.includes('tmall.com')) {
          return icon.tmIcon
        } else {
          return icon.pddIcon
        }
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
    methods: {
      // 获取商城订单列表
      getMallOrderList () {
        const page = this.page
        if (page === 1) this.proList = []
        this.$api.getOrderResultRPC(6, { page })
          .then(data => {
            console.log('获取商城订单列表 ==>', data)
            this.isLoadRefresh = false
            this.isLoading = false
            if (data.status) {
              const ordList = data.data.data
              for (let it of ordList) {
                it.content = JSON.parse(it.content)
              }
              this.proList.push(...ordList)

              if (data.data.total / data.data.per_page <= page) {
                this.isFinished = true
              } else {
                this.isFinished = false
              }
            } else {
              this.isLoadRefresh = false
              this.isLoading = false
              this.isFinished = true
            }
          })
      },

      refreshList () {
        this.page = 1
        console.log('下拉刷新')
        this.isLoadRefresh = true
        this.getMallOrderList()
      },
      pullList () {
        console.log('上拉加载')
        this.page++
        this.getMallOrderList()
      },

      // 生成推广链接
      async jumpRoute (url, type, item) {

        if (type === 2 || !this.isWxBrowse) {
          window.location.href = url
        } else {
          if (this.isWxBrowse && url.includes('http')) {
            url = await this.createdTpwd(url, item.content.name)
          }
          this.curMallList = url
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
        }
      },

      // 生成淘口令
      createdTpwd (url, text) {
        return this.$api.createdTpwd({ text, url })
          .then(data => {
            if (data.tbk_tpwd_create_response) {
              return data.tbk_tpwd_create_response.data.model
            } else {
              return url
            }
          })
      },
    },
    created () {
      this.isWxBrowse = isWechatrBrowse()
    },
    mounted () { }
  }
</script>

<style  lang="scss">
  .mall_order {
    .item {
      display: flex;
      padding: 15px;
      background: #fff;
    }

    .cover {
      margin-right: 10px;
      width: 115px;
      height: 115px;
      img {
        width: 100%;
      }
    }
    .info {
      flex: 1;
    }
    .title {
      font-size: 15px;
      color: #000;
      font-weight: bold;
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
      top: 5px;
    }
    .coupon {
      display: flex;
      align-items: center;
      margin: 5px 0;
    }

    .coupon_icon {
      display: inline-block;
      margin-right: 5px;
      padding: 0 4px;
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
      max-width: 60px;
      font-size: 20px;
      color: #ff4c4c;
      overflow: hidden;
    }

    .coupon_before {
      margin-left: 10px;
      font-size: 14px;
      line-height: 14px;
      height: 10px;
    }
    .ord_info {
      font-size: 12px;
      color: #999;
      line-height: 16px;
    }
    .ord_num {
      margin-top: 8px;
      line-height: 9px;
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
  }
</style>
