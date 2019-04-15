<template>
  <div class="hot_issues">
    <div class="hot_list">
      <div class="list_item">
        <h1>
          1.蜂蜜能干什么？
        </h1>
        <p class="hot_way">
         蜂蜜是蜜传的数字权益证明，可用于发布悬赏任务，兑换商品等。未来随着社群活动方式的多样化，蜂蜜的使用场景会越来越多。
        </p>
      </div>
      <div class="list_item">
        <h1>
          2.转发悬赏任务之后为什么我的账户没有变？
        </h1>
        <p class="hot_way">
         转发悬赏任务之后，必须要等到您的朋友浏览了您分享的链接，并且浏览时间满足分享要求之后，您才能得到传播收益。
        </p>
      </div>
      <div class="list_item">
        <h1>
          3.累计收益具体包括哪些收益？
        </h1>
        <p class="hot_way">
         累计收益=浏览所获蜂蜜+传播所获蜂蜜+签到所获蜂蜜。
        </p>
      </div>
      <div class="list_item">
        <h1>
          4.拼手气发布模式中红包个数指什么？
        </h1>
        <p class="hot_way">
         红包个数=浏览奖励次数+传播奖励次数。
        </p>
      </div>
      <div class="list_item">
        <h1>
          5.普通红包和拼手气红包的区别是什么？
        </h1>
        <p class="hot_way">
         “普通红包”的浏览奖励和传播奖励是用固定数值的发放方式，“拼手气”的浏览奖励和传播奖励是用随机数值的发放方式。
        </p>
      </div>
      <div class="list_item">
        <h1>
          6.账户总额，账户冻结，账户余额的定义与关系？
        </h1>
        <p class="hot_way">
         账户冻结是指上架状态中的发布预算与预算总和 <br/>
         账户余额是指账户可支配蜂蜜数量<br/>
         账户总额=账户冻结+账户余额。
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    components: {},
    data () {
      return {}
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .hot_list{
    margin-top: 0.533333rem;
    background: #fff;
    padding-left: .8rem;
    font-size: 0.746667rem;
    color: #333;
    padding-bottom: 3.36rem;
  }
  .list_item{
    padding: 0.533333rem .8rem 0.533333rem 0;
    border-bottom: 0.01333rem solid #eee;
  }
  .list_item h1{
    font-size: 0.746667rem;
  }
  .hot_way{
    margin: 0 auto 0;
    color: #666;
  }
  .hot_list> div:nth-child(6){
    border:none;
  }
</style>
