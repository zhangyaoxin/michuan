<template>
  <div class="me">
    <div class="me_header">
      <!--未登录头部开始-->
      <div class="header_top" v-if="!isLogin">
        <router-link to="login" class="header_left">
          <div class="user_avatar">
            <img src="../../assets/images/me_head_icon.png">
          </div>
        </router-link>
        <router-link to="login" class="header_middle">
          <div class="hurry_up">立即登录</div>
          <div class="hurry_up_tip">登录后可以获取更多福利</div>
        </router-link>
        <div class="header_right">
          <router-link to="set" class="user_msg">
            <img src="../../assets/images/set_icon.png" alt="">
          </router-link>
          <router-link to="login" class="user_msg">
            <img src="../../assets/images/news_icon.png" alt="">
          </router-link>
        </div>
      </div>

      <!--已登录头部开始-->
      <div class="header_top" v-else>
        <router-link class="header_user" to="me_edit">
          <div class="header_left">
            <div class="user_avatar">
              <img :src="userInfo.thumbnail|filterImg('avatar')">
            </div>
          </div>

          <div class="header_middle">
            <div class="user_nickname ellipsis">{{userInfo.nickname}}</div>

            <div class="user_signature">
              <div class="no_edit_signature">
                <div class="dis_signature">{{userInfo.motto||'我也来说点什么，介绍我自己!'}}</div>
              </div>
            </div>
          </div>

        </router-link>
        <div class="header_right">
          <router-link to="set" class="user_msg">
            <img src="../../assets/images/set_icon.png" alt="">
          </router-link>
          <router-link to="me_msg" class="user_msg">
            <img src="../../assets/images/news_icon.png" alt="">
          </router-link>
        </div>
      </div>

      <!-- 统计 -->
      <div class="header_bottom">
        <div class="info_item">
          <div class="info_item_num">{{Number(today_sum)}}</div>
          <div class="info_item_title"> 今日收益(蜂蜜) </div>
          <div class="info_item_title"> 购物可抵 {{(today_sum*10).toFixed("1")}} 元 </div>

        </div>
        <div class="info_item line"></div>
        <div class="info_item">
          <div class="info_item_num">{{Number(total_sum)}}</div>
          <div class="info_item_title">总资产(蜂蜜) </div>
          <div class="info_item_title"> 购物可抵 {{(total_sum*10).toFixed("1")}} 元 </div>
        </div>
      </div>

    </div>
    <router-link to="mall_index" class="mall_warp"></router-link>

    <div class="header_operate">
      <router-link :to="{path:'account_recharge',query:{status:1}}" class="operate_item">
        <img src="../../assets/images/card_recharge_icon.png" alt="">
        <p>卡充值</p>
      </router-link>
      <router-link :to="{path:'account_recharge',query:{status:0}}" class="operate_item">
        <img src="../../assets/images/recharge_icon.png" alt="">
        <p>在线充值</p>
      </router-link>
      <router-link to="account_withdraw" class="operate_item">
        <img src="../../assets/images/withdraw_icon.png" alt="">
        <p>提现</p>
      </router-link>
      <router-link to="account_detail" class="operate_item">
        <img src="../../assets/images/detail_account.png" alt="">
        <p>明细</p>
      </router-link>
    </div>

    <van-cell-group class="cell_group">
      <van-cell :title="item.title" is-link :to="item.route|filterJump(isLogin)" v-for="(item,index) in upgradeList" :key="index">
        <img class="list_icon" slot="icon" :src="item.icon" alt="">
        <div>{{item.concern_count}}</div>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { getStore, setStore } from '@/utils/utils'

  export default {
    name: 'me',
    data () {
      return {
        putBadgeIcon: 'http://www.oldda.cn/FjepLDrJtIIcl9zYQEPooxfiSyLu',
        shareBadgeIcon: 'http://www.oldda.cn/FpNR58W3TaEZeFh970OlEXuEdtWI',

        userInfo: {
          name: '',
          thumbnail: '',
          badges: {},
        },

        today_sum: 0,
        total_sum: 0,

        concern_count: 0,
        fans_count: 0,

        upgradeList: [
          {
            icon: require('../../assets/images/me_account.png'),
            title: '我的账户',
            route: 'me_account'
          },
          {
            icon: require('../../assets/images/me_index_icon.png'),
            title: '我的主页',
            route: 'me_index'
          },
          {
            icon: require('../../assets/images/me_put.png'),
            title: '我的发布',
            route: 'me_public'
          },
          {
            icon: require('../../assets/images/me_order.png'),
            title: '我的订单',
            route: 'mall_order'
          },
          {
            icon: require('../../assets/images/me_browse.png'),
            title: '我的浏览',
            route: 'me_browse',
          },
          {
            icon: require('../../assets/images/me_attent.png'),
            title: '我的关注',
            route: 'me_attent',
            concern_count: 0,
          },
          {
            icon: require('../../assets/images/me_fans.png'),
            title: '我的粉丝',
            route: 'me_fans',
            concern_count: 0,
          },
          // {
          //   icon: require('../../assets/images/me_invite.png'),
          //   title: '邀请好友',
          //   route: 'me_invite'
          // },
          // {
          //   icon: require('../../assets/images/me_income.png'),
          //   title: '收益排行',
          //   route: 'me_rank'
          // }
        ],
      }
    },
    filters: {
      filterJump (path, isLogin) {
        if (path === 'me_browse') return path
        if (isLogin) {
          return path
        } else {
          return 'login'
        }
      }
    },
    computed: {
      ...mapState({
        isLogin: state => state.isLogin
      }),
    },
    methods: {
      // 获取用户信息
      async getUserInfo () {
        if (!this.isLogin) return false
        const { data, res } = await this.$store.dispatch('getUserInfo')
        if (!res) return false
        this.userInfo = data
        setStore('userInfo', this.userInfo)
        const { earns: { today_sum, total_sum }, counts: { concerns_counts, fans_counts } } = data
        this.today_sum = today_sum
        this.total_sum = total_sum
        this.upgradeList[5].concern_count = concerns_counts
        this.upgradeList[6].concern_count = fans_counts
      },

      activeTip () {
        this.$toast('可提现金额 = 总资产-上架状态中预算余额总和')
      }
    },
    created () {
      setTimeout(() => {
        this.getUserInfo()
      }, 500);
    }
  }
</script>

<style lang="scss">
  .me {
    background: #f4f4f4;
    padding-bottom: 3.2rem;
    .me_header {
      width: 100%;
      color: #fff;
    }

    .header_top {
      display: flex;
      align-items: center;
      position: relative;
      padding: 0.8rem;
      box-sizing: border-box;
      height: 5.226667rem;
      background: url("../../assets/images/me_top_bg.png");
      background-size: cover;
    }

    .header_left,
    .header_middle {
      margin-right: 0.533333rem;
      color: #fff;
    }

    .user_avatar {
      width: 2.186667rem;
      height: 2.186667rem;
      overflow: hidden;
      border-radius: 100%;
    }
    .user_avatar img {
      width: 100%;
      height: 100%;
    }
    .hurry_up {
      font-size: 1.066667rem;
      font-weight: bold;
    }
    .hurry_up_tip {
      line-height: 20px;
      font-size: 0.64rem;
    }

    .header_user {
      display: flex;
      align-items: flex-start;
      color: #fff;
    }

    .user_nickname {
      width: 9rem;
      font-size: 0.853333rem;
      font-weight: 600;
    }

    .user_level {
      padding: 0.213333rem 0.533333rem;
      border-radius: 0.106667rem;
      line-height: 0.533333rem;
      font-size: 0.64rem;
      color: #fff;
      background: #ff4b4b;
    }

    .user_badge {
      display: flex;
      align-items: center;
      margin-top: 0.106667rem;
    }
    .user_badge a {
      margin-right: 0.533333rem;
    }
    .user_badge_item {
      width: 0.96rem;
      height: 0.8rem;
    }
    .user_badge_item img {
      width: 100%;
    }

    .user_signature {
      font-size: 0.64rem;
      color: #fff;
    }

    .header_right {
      display: flex;
      position: absolute;
      top: 0.8rem;
      right: 0.6rem;
    }

    .user_msg {
      margin-left: 0.533333rem;
      width: 1.12rem;
      height: 1.12rem;
    }
    .user_msg img {
      width: 100%;
    }
    .ask_item {
      position: absolute;
      right: 1.9rem;
      width: 0.64rem;
      height: 0.64rem;
      top: 0.37415rem;
    }
    .ask_item img {
      width: 100%;
    }

    .header_bottom {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 4.533333rem;
      color: #fff;
      background: url("../../assets/images/me_bottom_bg.png") left bottom;
      background-size: cover;
    }
    .info_item {
      width: 100%;
      text-align: center;
      font-size: 0.64rem;
    }
    .info_item.line {
      height: 1.44rem;
      width: 0.053333rem;
      background: rgba(255, 255, 255, 0.5);
    }
    .info_item_num {
      font-size: 1.066667rem;
      font-weight: bold;
    }
    .info_item_title {
      position: relative;
      line-height: 15px;
      font-size: 0.64rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .help_icon {
      position: relative;
      top: 3px;
      font-size: 14px;
    }

    .header_operate {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      padding: 15px 15px 10px 15px;
      background: #fff;
    }

    .operate_item {
      width: 17%;
      text-align: center;
      color: #666;
      img {
        width: 36px;
        height: 36px;
      }
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

    .mall_warp {
      display: block;
      width: 100%;
      height: 70px;
      background: url("../../assets/images/me_mall_bg.png");
      background-size: cover;
    }
  }
</style>
