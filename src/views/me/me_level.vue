<template>
  <div class="me_level">
    <div class="level_header">
      <div class="level_user">
        <div class="level_avatar">
          <img :src="account.thumbnail||avatar" alt="">
        </div>
        <div class="level_nickname">{{nickname}}</div>
      </div>
      <div class="level_badge">
        <div class="badge_img">
          <img src="../../assets/images/badge_level.png" alt="">
          <div class="badge_lv">{{curLevel}}</div>
          <div class="lv_beat">
            击败了{{proportion}}%的用户</div>
        </div>
        <div class="level_cur">
          我的经验值:{{account.start_section}}, 离升级还差: {{needMake}}
        </div>
        <div class="level_progress_wrap">
          <div class="level_name">Lv{{curLevel}}</div>
          <div class="level_progress">
            <div class="progress_inner" :style="{'width':curScale+'%'}"></div>
          </div>
          <div class="level_name">Lv{{curLevel+1}}</div>
        </div>
      </div>
    </div>
    <div class="level_section">
      <div class="level_title">如何升级</div>
      <div class="upgrade_wrap">
        <div class="upgrade_item" v-for="(item,index) in upgradeList" :key="index">
          <div class="item_icon">
            <img :src="item.icon" alt="" />
          </div>
          <div class="item_main">
            <div class="item_title">{{item.title}}</div>
            <div class="item_desc">{{item.desc}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../api/user.js';
  export default {
    name: 'me_level',
    props: {},
    components: {},
    data () {
      return {
        nickname: 'cloud',
        avatar: require('../../assets/images/head_icon.png'),
        curLevel: '',
        proportion: '99',
        needMake: '',
        curScale: '',
        account: {},
        
        upgradeList: [
          {
            icon: require('../../assets/images/gray_recharge.png'),
            title: '充值蜂蜜',
            desc: '每充值一次获得与充值金额相等经验值，最低为1。'
          },
          {
            icon: require('../../assets/images/gray_publish.png'),
            title: '发布文章',
            desc: '每发布一篇文章可获得浏览与传播次数之和的经验值。'
          },
          {
            icon: require('../../assets/images/gray_look.png'),
            title: '浏览文章',
            desc: '每获得一次浏览收益获得1经验值。'
          },
          {
            icon: require('../../assets/images/gray_relay.png'),
            title: '转发文章',
            desc: '每获得一次转发收益可得1经验值。'
          },
          {
            icon: require('../../assets/images/gray_invite.png'),
            title: '邀请好友',
            desc: '每邀请一位好友成功注册可获得10经验值。'
          }
        ],
      }
    },
    computed: {

    },
    methods: {
      getmymsg (name, type) {
        let req = {
          page: 1,
          limit: 10,
          name: name,
          type: type
        };
        api.getMyLevel(req).then((data) => {
          if (data.response_code == 200) {
            this.account = data.data.data[0]; // 将请求的数据赋值到data对象中的account对象里
            this.curLevel = Number(data.data.data[0].name.slice(-1));
            this.needMake = data.data.data[0].end_section - data.data.data[0].start_section;
            this.curScale = (Number(this.account.start_section) / Number(this.account.end_section)) * 100;
            console.log(this.account)
          } else {
            console.log('请求失败', data.msg)
          }
        })
      },
    },
    created () {
      console.log(2233)
      this.getmymsg(1, 1)
    }
  }
</script>

<style scoped lang="scss">
  .level_header {
    padding: 0.8rem;
    width: 100%;
    height: 10.773333rem;
    box-sizing: border-box;
    background: url(../../assets/images/level_bg.png);
    background-size: cover;
  }
  .level_user {
    display: flex;
    align-items: center;
  }
  .level_avatar {
    width: 1.866667rem;
    height: 1.866667rem;
    border-radius: 100%;
    overflow: hidden;
  }
  .level_avatar img {
    width: 100%;
    height: 100%;
  }
  .level_nickname {
    margin-left: 0.32rem;
    font-size: 0.746667rem;
    text-shadow: 0 0 0.026667rem rgba(51, 177, 190, 0.66);
    color: #fff;
  }
  .level_badge {
    text-align: center;
    margin-top: -0.8rem;
  }
  .badge_img {
    position: relative;
    margin: 0 auto;
    width: 6.346667rem;
    height: 4.32rem;
  }
  .badge_img img {
    width: 100%;
  }
  .badge_lv {
    position: absolute;
    top: 1.066667rem;
    width: 100%;
    font-size: 1.333333rem;
    color: #ff6c20;
    font-weight: bold;
  }
  .lv_beat {
    position: absolute;
    top: 2.65rem;
    text-align: center;
    width: 100%;
    font-size: 11px;
    color: #fff;
    transform: scale(0.85);
  }
  .level_cur {
    margin-top: 0.533333rem;
    font-size: 0.64rem;
    color: #fff;
  }
  .level_progress_wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.233333rem auto;
    font-size: 0.746667rem;
    color: #fff;
  }
  .level_progress {
    margin: 0.32rem;
    width: 11.893333rem;
    height: 0.426667rem;
    background: #fff;
    border-radius: 0.213333rem;
  }
  .progress_inner {
    width: 0;
    height: 100%;
    box-sizing: border-box;
    border-radius: 0.16rem;
    border: 0.053333rem solid #fff;
    background: #ffd51c;
  }
  .level_section {
    margin-top: 0.8rem;
    background: #fff;
  }
  .level_title {
    height: 2.986667rem;
    line-height: 2.986667rem;
    font-size: 0.853333rem;
    color: #333;
    border-bottom: 0.01333rem solid #e8e8e8;
  }
  .upgrade_wrap {
    padding: 0 0.8rem;
  }
  .upgrade_item {
    display: flex;
    align-items: center;
    border-bottom: 0.053333rem solid #ebe9bb;
    font-size: 0.693333rem;
    color: #999;
    height: 2.666667rem;
  }
  .item_icon {
    margin-right: 0.746667rem;
    width: 1.6rem;
    height: 1.6rem;
  }
  .item_icon img {
    width: 100%;
  }
  .item_title {
    font-size: 0.8rem;
    color: #333;
    line-height: 1.2;
  }
  .item_desc {
    letter-spacing: -0.5px;
    line-height: 1.2;
  }
  .level_title {
    position: relative;
    margin: 0 auto;
    font-size: 0.96rem;
    color: #333;
    text-align: center;
    font-weight: bold;
  }
  .level_title::before {
    left: -3.733333rem;
  }
  .level_title::before {
    content: url(../../assets/images/left_icon.png);
    display: inline-block;
    width: 0.693333rem;
    height: 0.693333rem;
    margin-left: 0.533333rem;
    margin-right: 1.6rem;
    vertical-align: middle;
    position: absolute;
    top: 0;
    left: 30%;
  }
  .level_title::after {
    content: url(../../assets/images/left_icon.png);
    display: inline-block;
    width: 0.693333rem;
    height: 0.693333rem;
    margin-left: 0.533333rem;
    margin-right: 1.6rem;
    vertical-align: middle;
    position: absolute;
    top: 0;
    left: 60%;
  }
  .level_title::after {
    right: -3.733333rem;
  }
</style>
