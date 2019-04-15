<template>
  <div class="you_recomm">
    <div class="title">
      <div class="icon">
        <img src="../../../assets/images/you_recomm_l.png" alt="">
      </div>
      <div class="txt">为你推荐</div>
      <div class="icon">
        <img src="../../../assets/images/you_recomm_r.png" alt="">
      </div>
    </div>

    <comm-list :list="list"></comm-list>
    <footer class="footer">我是有底线的</footer>
  </div>
</template>

<script>
  import commList from './comm_list'

  import { mallUnifiedFormat } from '@/utils/utils'
  export default {
    name: 'you_comm',
    components: { commList },
    data () {
      return {
        list: []
      }
    },
    methods: {
      // 获取为你推荐列表
      getToYouRecommendList () {
        this.$api.getToYouRecommendList()
          .then(data => {
            console.log(data)
            if (data.result) {
              const list = mallUnifiedFormat(data.result, 'dtk', 9)
              console.log(list, 'pppppppp')
              this.list = list
            }
          })
      }
    },
    created () {
      this.getToYouRecommendList()
    }
  }
</script>

<style  lang="scss">
  .you_recomm {
    margin-top: 15px;
    margin-bottom: 50px;

    > .title {
      // position: relative;
      display: flex;
      align-items: center;
      margin: 0 auto;
      width: 115px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }

    .txt {
      flex: 1;
    }

    .icon {
      width: 10px;
      height: 11px;
      img {
        width: 100%;
      }
    }
    .icon:last-child {
      right: 0;
    }
    .footer {
      text-align: center;
      color: #999;
    }
  }
</style>
