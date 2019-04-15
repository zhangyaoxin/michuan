<template>
  <div class="task_end">
    <div class="noTask">
      <img src="../../assets/images/logoW.png" alt="">
      <span>蜜传 浏览转发都赚钱</span>
    </div>
    <div class="goHall">
      <h1>任务已经结束了</h1>
      <p>到蜜传任务大厅可以找到更多热门任务，一起来赚蜂蜜吧！</p>
      <router-link to="home">去任务大厅</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'task_end',
    components: {},
    data () {
      return {}
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .task_end{
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-size: 73% 100%;
      background: url(../../assets/images/bg.png);
      background-repeat: no-repeat;
      background-size: cover;
      margin: 0;
      padding: 0;
  }
  .noTask{
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 14px;
      margin-top: 20px;
  }
  .noTask img{
      width: 16px;
      height: 14px;
      margin-top: 1px;
  }
  .noTask span{
      margin-left: 7px;
  }
  .goHall h1 {
      position: absolute;
      bottom: 26%;
      text-align: center;
      width: 100%;
      font-size: 30px;
      font-weight: bold;
      color: #fff;
      text-shadow: 3px 3px 1px #1363b8;
  }
  .goHall p{
      color: #fff;
      font-weight: bold;
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 21%;
      font-size: 12px;
      font-weight: normal;
  }
  .goHall a {
      position: absolute;
      bottom: 7%;
      left: 12%;
      font-size: 19px;
      font-weight: bold;
      color: #8b4a02;
      background: url(../../assets/images/buttonO.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 281px;
      height: 72px;
      line-height: 62px;
      text-align: center;
      display: block;
  }
</style>
