<template>
  <div class="mc_raiders">
    <div class="rai_head">
        <img src="../../../assets/images/raiders_title.png" alt="">
    </div> 
    <div class="rai_sections">
      <div class="small_head">
        什么是蜂蜜？
      </div>
      <p class="rai_text">
        蜂蜜是蜜传的数字权益证明,英文名称为MIC,用于激励浏览和传播者;蜂蜜收益与任务悬赏额
        度、浏览人数有关,可用于发布悬赏任务、购买商品、相互打赏等,还可以直接兑换现金！
      </p>
      <div class="small_head">
        赚取蜂蜜的方法
      </div>
      <h1>
        1.传播收益
      </h1>
      <p class="rai_money">
       通过任务大厅分享悬赏任务,或者打开其他人分享的蜜传悬赏链接后继续分享,分享后浏览人数越多,
       您赚的蜂蜜越多;您的朋友继续转发您分享的悬赏链接,传播收益属于您的朋友。
      </p>
      <h1>
        2.浏览收益
      </h1>
      <p class="rai_money">
       浏览您的朋友分享的蜜传悬赏链接,浏览时间达到要求后,您将获得蜂蜜；每个任务同一个人只有一
       次浏览收益哦。
      </p>
      <img src="../../../assets/images/rink.png" class="rink_left" alter=""/>
      <img src="../../../assets/images/rink.png" class="rink_right" alter=""/>
    </div>
    <div class="rai_sections">
      <div class="small_head">
        收益计算说明
      </div>
      <p class="rai_text">
        小红浏览任务链接之后转发给小黄,小橙和小绿,<br/>
        小黄浏览之后转发给小青和小蓝,<br/>
        所有人浏览时间达到要求之后,<br/>
        小红的收益=1次浏览收益+3次传播收益<br/>
        小黄的收益=1次浏览收益+2次传播收益
      </p>
      <img src="../../../assets/images/man.png" class="man" alter=""/>
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
  .mc_raiders{
    background:url("../../../assets/images/raiders_bg.png") no-repeat;
    background-size:100%;
    height: 49.92rem;
    overflow: hidden;
  }
  .rai_head{
    width: 14.4rem;
    height: 3.466667rem;
    margin: 0.533333rem auto 0;
  }
  .rai_head img{
    width:100%;
  }
  .rai_sections{
    background: url("../../../assets/images/bg_fff.png") no-repeat;
    width: 19.52rem;
    height: 21.866667rem;
    margin:.4rem auto 0;
    background-size: 100%;
  }
  .small_head{
    width: 5.973333rem;
    height: 16px;
    margin:0 auto;
    text-align: center;
    font-weight: bold;
    padding-top: .8rem;
    font-size: 16px;
    border-bottom: 10px solid;
    border-image: linear-gradient(0deg,#ff773b,#ff4b4b) 5 10;
    border-image: -moz-linear-gradient(0deg,#ff773b, #ff4b4b) 5 10;
    border-image: -webkit-linear-gradient(0deg,#ff773b, #ff4b4b) 5 10;
  }
  .rai_text,.rai_money{
    width: -webkit-calc(100% - 3.5rem);
    margin: 0.533333rem auto 0;
    font-size: 14px;
    line-height: 1.5;
  }
  .rai_sections h1{
    font-size:0.746667rem;
    margin-left: 1.8rem;
  }
  .man{
    width: 17.653333rem;
    height: 11.093333rem;
    margin: .8rem .5rem 0 .8rem;
  }
  .rink_left,.rink_right{
    width: 0.64rem;
    height: 3.466667rem;
  }
  .rink_left{
    float:left;
    margin:1px 0 0 90px;
  }
  .rink_right{
    float:right;
    margin:1px 90px 0 0;
  }
  .rai_money{
    margin: 0 auto 0;
  }
</style>
