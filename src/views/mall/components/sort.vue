<template>
  <div class="mall_sort">
    <div class="sort">
      <router-link :to="item.path" class="item" v-for="(item,index) in sortList" :key="index">
        <img class="icon" :src="item.icon" />
        <div class="title">{{item.title}}</div>
      </router-link>
    </div>

    <!-- <router-link to="hall" class="hall">
      <img src="../../../assets/images/mall_reward_bg.png" alt="">
    </router-link> -->
    <!-- <div class="hall" @click="buildTap()">
      <img src="../../../assets/images/mall_reward_bg.png" alt="">
    </div> -->
  </div>
</template>

<script>
  export default {
    name: 'mall_sort',
    components: {},
    data () {
      return {
        sortList: [
          {
            icon: require('../../../assets/images/mall_sort_tb.png'),
            title: '淘宝',
            path: 'tb_list'
          },
          {
            icon: require('../../../assets/images/mall_sort_tm.png'),
            title: '天猫',
            path: 'tm_list'
          },
          {
            icon: require('../../../assets/images/mall_sort_pdd.png'),
            title: '拼多多',
            path: 'pdd_list'
          },
          {
            icon: require('../../../assets/images/mall_sort_jhs.png'),
            title: '聚划算',
            path: 'jhs_list'
          },
          {
            icon: require('../../../assets/images/mall_sort_dpms.png'),
            title: '大牌秒杀',
            path: 'dpms_list'
          }
        ]
      }
    },
    methods: {
      buildTap() {
        window.location.href = 'http://www.agrimedia.cn/turntable/index.html'
      }
    },
  }
</script>

<style lang="scss">
  .mall_sort {
    .sort {
      display: flex;
      padding: 20px 15px 5px;
    }
    .item {
      width: 100%;
      text-align: center;
    }
    .icon {
      width: 46px;
      height: 46px;
      border-radius: 100%;
      overflow: hidden;
    }
    .title {
      margin-top: 3px;
      color: #666;
      font-size: 12px;
    }

    .hall {
      display: block;
      padding: 0 10px;
      img {
        width: 100%;
      }
    }
  }
</style>
