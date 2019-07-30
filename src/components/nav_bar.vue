<template>
  <div class="nav_bar van-hairline--top">
    <div class="nav_item" :class="{'active':isActive(item.route)}" v-for="(item,index) in navList" :key="index" @click="jump(item.route)">

      <div class="nav_icon">
        <img src="../assets/images/call_dialpad_icon.png" alt="" v-if="item.route==='call'&&isCallRoute">
        <img :src="isActive(item.route)?item.iconHl:item.icon" alt="" v-else>
      </div>

      <div class="nav_title" v-if="item.route==='call'&&isCallRoute">{{isShowDialpadMd?'收缩':'展开'}}</div>
      <div class="nav_title" v-else>{{item.title}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'nav_bar',
    data () {
      return {
        navList: [
          {
            title: '首页',
            icon: require('@/assets/images/nav_home.png'),
            iconHl: require('@/assets/images/nav_home_hl.png'),
            route: 'newMap'
          },
          {
            title: '抢红包',
            icon: require('@/assets/images/nav_reward.png'),
            iconHl: require('@/assets/images/nav_reward_hl.png'),
            route: 'hall'
          },
          //  {
          //   title: '电话',
          //   icon: require('@/assets/images/nav_call.png'),
          //   iconHl: require('@/assets/images/nav_call_hl.png'),
          //   route: 'call'
          // },
           {
            title: '淘商城',
            icon: require('@/assets/images/tao_b.png'),
            iconHl: require('@/assets/images/tao_r.png'),
            route: 'home'
          },
          {
            title: '我的',
            icon: require('@/assets/images/nav_me.png'),
            iconHl: require('@/assets/images/nav_me_hl.png'),
            route: 'me'
          }
        ]
      }
    },
    computed: {
      isShowDialpadMd: {
        get () {
          return this.$store.state.isShowDialpadMd
        },
        set (val) {
          this.$store.commit('changeValue', { type: 'isShowDialpadMd', value: val })
        }
      },
      isCallRoute () {
        return this.$route.name === 'call'
      }
    },
    methods: {
      isActive (route) {
        return this.$route.name === route
      },

      jump (route) {
        console.log(route, this.isShowDialpadMd)
        if (route.startsWith('https')) {
          window.location.href = route
        } else {
          const isShowDialpadMd = this.isShowDialpadMd
          if (route === 'call') {
            this.isShowDialpadMd = !isShowDialpadMd
          } else {
            this.isShowDialpadMd = false
          }
          this.$router.push(route)
        }
      }
    },
    created () { }
  }
</script>

<style lang="scss">
  .nav_bar {
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 2.613333rem;
    text-align: center;
    font-size: 0.64rem;
    background: #fff;
    border-top: 1px solid #e8e8e8;
    z-index: 2011;

    .nav_item {
      width: 100%;
      height: 2.026667rem;
      color: #999;
    }
    .nav_item.active {
      color: #ff4a4f;
    }
    .nav_icon {
      margin: 0 auto;
      width: 1.28rem;
      height: 1.28rem;
    }
    .nav_icon img {
      width: 100%;
    }
    .nav_title {
      transform: scale(0.83);
      line-height: 0.96rem;
    }
  }
</style>
