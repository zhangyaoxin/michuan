<template>
  <div class="me_account_detail">
    <div class="put_status_wrap">
      <van-tabs v-model="curTab" @click="changeTab" sticky>
        <van-tab ref="nav" v-for="(item,index) in statusList" :title="item.title" :key="index"></van-tab>
      </van-tabs>
    </div>

    <!-- 全部 -->
    <van-pull-refresh v-model="isLoadRefresh" @refresh="refreshList">
      <van-list v-model="isLoading" :finished="isFinished" @load="pullList" :offset='50'>
        <div class="detail_all" v-for="(item,index) in account" :key="index">
          <div class="top" style="display:flex;align-items:center">
            <div class="left">

              <span>[{{item.trade_type_name}}]</span>
              <!-- 浏览 -->
              <span v-if="item.trade_type===1" class="left_info">
                {{item.trade_in_out=='+'?'您':item.trade_user_info[0].nickname}}
                浏览了
                {{item.trade_in_out=='+'?item.trade_user_info[0].nickname:'您'}}
                发布的
                <router-link :to="{path:'ad_details',query:{id:item.detail.advertise_id}}" class="left_title">{{item.detail?item.detail.advertise.title||'无题':''}}</router-link>
              </span>
              <!-- 提现 -->
              <span v-if="item.trade_type===2">提现到绑定的微信钱包</span>
              <!-- 分享 -->
              <span v-if="item.trade_type===3">
                {{item.browse_user_name}}
                浏览了
                {{item.share_user_name}}
                分享的
                <router-link :to="{path:'ad_details',query:{id:item.detail.advertise_id}}" class="left_title">{{item.detail?item.detail.advertise.title||'无题':''}}</router-link>
              </span>
              <!-- 充值 -->
              <span v-if="item.trade_type===4||item.trade_type===11">{{item.trade_type===4?'在线充值':'充值卡'+item.detail.phone_card_info.card_no+'充值成功'}}</span>
              <span v-if="item.trade_type===5">自主转账{{index}}</span>
              <span v-if="item.trade_type===6">兑换{{item.detail.coupon}}元优惠券,{{item.content.name}}</span>
              <span v-if="item.trade_type===7">点位主租金</span>
              <span v-if="item.trade_type===8">新用户注册{{index}}</span>
              <span v-if="item.trade_type===9">邀请好友悬赏{{index}}</span>
              <span v-if="item.trade_type===10">发布广告冻结{{index}}</span>
              <!-- <span v-if="item.trade_type===11">电话卡充值</span> -->
              <span v-if="item.trade_type===12">通话时长{{item.detail.hold_minute}}分{{item.detail.hold_seconds}}秒</span>
            </div>
            <div class="right">
              <img :src="item|filterColor" alt>
              <span>{{item.trade_type===7?'系统':item.trade_name}}</span>
            </div>
          </div>
          <div class="bottom" style="display:flex;align-items:center">
            <div class="time" style="flex:1;">{{item.created_at}}</div>
            <div class="mic">{{item.trade_in_out}}{{Number(item.trade_num)}}蜂蜜</div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <div class="nothing_wrap" v-if="nothing">
      <img class="nothing_icon" src="../../../assets/images/mingxi.png" alt>
      <p class="fans_title">暂无明细～</p>
      <p>no detail Temporarily</p>
    </div>

    <!-- 滚动到顶部 -->
    <go-top></go-top>
  </div>
</template>

<script>
  import goTop from '@@/go_top'
  export default {
    name: "me_account_detail",
    props: {},
    components: { goTop },
    data () {
      return {
        curStatus: "all",
        type: 1,
        link: "detail_second",
        account: [],
        userList: [{}],
        statusList: [
          {
            title: "全部",
            status: "all"
          },
          {
            title: "浏览",
            status: 1
          },
          {
            title: "分享",
            status: 3
          },

          {
            title: "充值",
            status: 13
          },

          {
            title: "提现",
            status: 2
          },

          {
            title: "拨号",
            status: 12
          },

          {
            title: "商城",
            status: 6
          },

          {
            title: "系统",
            status: 7
          }
        ],
        curTab: 0,
        page: 0,
        isLoadRefresh: false,
        isLoading: false,
        isFinished: false,

        nothing: false
      };
    },
    filters: {
      filterColor (item) {
        console.log(item);
        const type = item.trade_type;
        const isComeIn = item.trade_in_out === "+";

        if (type == 1) {
          if (isComeIn) {
            return require("../../../assets/images/earn.png");
          } else {
            return require("../../../assets/images/award.png");
          }
        }
        if (type == 2) {
          return require("../../../assets/images/invest.png");
        }
        if (type == 3) {
          if (isComeIn) {
            return require("../../../assets/images/earn.png");
          } else {
            return require("../../../assets/images/award.png");
          }
        }
        if (type == 4) {
          return require("../../../assets/images/invest.png");
        }
        if (type == 6) {
          return require("../../../assets/images/shangcheng.png");
        }
        if (type == 11) {
          return require("../../../assets/images/invest.png");
        }
        if (type == 12) {
          return require("../../../assets/images/telphone.png");
        }
        if (type == 7) {
          return require("../../../assets/images/telphone.png");
        }
      }
    },
    computed: {},
    methods: {
      getmymsg () {
        const page = this.page;
        if (page === 1) this.account = [];
        let req = {
          page
        };

        if (this.curStatus !== "all") {
          req.trade_type = this.curStatus;
        }

        this.$api.getAccountDetail(req)
          .then(data => {
            console.log(data);
            if (data.status) {
              this.isLoadRefresh = false;
              this.isLoading = false;
              data.data.data.map(it => {
                if (it.detail && it.detail.content) {
                  it.content = JSON.parse(it.detail.content)
                  if (it.content.name.length >= 15) {
                    it.content.name = it.content.name.slice(0, 15) + '...'
                  }
                }
              })
              this.account.push(...data.data.data); // 将请求的数据赋值到data对象中的account对象里
              if (data.data.total / data.data.per_page <= page) {
                this.isFinished = true;
              } else {
                this.isFinished = false;
              }

              if (this.account.length === 0) {
                this.nothing = true
              } else {
                this.nothing = false
              }
            } else {
              console.log("请求失败", data.msg);
            }
          });
      },
      refreshList () {
        this.page = 1;
        console.log("下拉刷新");
        this.isLoadRefresh = true;
        this.getmymsg();
      },
      pullList () {
        console.log("上拉加载");
        this.page++;
        this.getmymsg();
      },
      changeTab (i) {
        const status = this.statusList[i].status;
        console.log(status, "opopopopopo");
        this.curStatus = status;
        this.page = 1;
        this.getmymsg();
      },
      filterStatus (status) {
        const items = this.statusList;
        for (let i of items) {
          if (this.curStatus === i.status) {
            return i.title;
          }
        }
      }
    },
    created () {
      const type = this.$route.query.type
      if (type) {
        const i = this.statusList.findIndex(it => it.status == type)
        this.curTab = i
        this.curStatus = type
      }

    }
  };
</script>

<style lang="scss">
  .me_account_detail {
    .van-tab {
      background-color: #f4f4f4;
    }
    .van-tab--active {
      font-size: 20px;
      font-weight: bold;
    }
    .detail_all {
      background-color: #fff;
      margin-bottom: 10px;
      padding: 5px 15px;
    }
    .left {
      width: 225px;
      font-size: 15px;
      color: #333333;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -moz-box-orient: vertical;
      box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .top {
      position: relative;
      .right {
        position: relative;
        display: inline-block;
        margin-left: auto;
        text-align: center;
        color: #fff;
        height: 21px;
        line-height: 21px;
        span {
          position: absolute;
          top: 0;
          right: 10px;
        }
      }
    }
    .right img {
      height: 100%;
    }
    .bottom {
      margin-top: 3px;
    }
    .left_title {
      color: #4d63ec;
      text-decoration: underline;
    }
    .time {
      font-size: 12px;
      color: #999999;
    }
    .mic {
      color: #ff4b4b;
      font-size: 15px;
    }
    .van-tabs__line {
      width: 40px !important;
      // transform: translateX(10px) !important;
      left: -5px !important;
    }
    .van-tab {
      flex-basis: 16% !important;
    }
  }
</style>
