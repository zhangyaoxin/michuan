<template>
  <div class="help_feedback">
    <div class="me_list">
      <div v-for="(item,index) in upgradeList" :key="index">
        <router-link :to="item.link" class="list_item">
          <div class="list_title">{{item.title}}</div>
          <div class="list_arrow"></div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'help_feedback',
    components: {},
    data () {
      return {
        upgradeList: [
          {
            title: '采蜜攻略',
            link: 'mc_raiders'
          },
          // {
          //   title: '发布任务',
          //   link: 'put_task',
          //   cache_count: '0',
          // },
          // {
          //   title: '热门问题',
          //   link: 'hot_issues',
          // },
          {
            title: '意见反馈',
            link: 'feed_back',
            edition_num: '版本1.2.0',
          }
        ],
      }
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  // .me_list[data-v-7119feb9] {
  //   margin-top: 0.533333rem;
  //   font-size: 0.8rem;
  //   color: #333;
  // }
  .me_list > div {
    padding-left: 0.8rem;
    background: #fff;
  }
  .list_item {
    display: flex;
    align-items: center;
    padding: 0.533333rem 0.8rem 0.533333rem 0;
    border-bottom: 0.01333rem solid #eee;
  }
  .list_icon {
    margin-right: 0.8rem;
    width: 1.6rem;
    height: 1.6rem;
  }
  .list_icon img {
    width: 100%;
  }
  .list_title {
    flex: 1;
    color: #000;
  }
  .list_arrow {
    width: 0.8rem;
    height: 0.8rem;
    background: url("../../../assets/images/arrow_icon.png");
    background-repeat: no-repeat;
    background-size: 0.8rem 0.8rem;
  }
  // .me_list > div:nth-child(1),
  .me_list > div:nth-child(2) {
    margin-top: 0.533333rem;
  }
</style>
