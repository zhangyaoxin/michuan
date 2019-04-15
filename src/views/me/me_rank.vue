<template>
  <div class="me_rank">
    <div class="t2">
      <div class="touxiang">
          <div class="t2_m">
              <span class="t2_t">
                <img class="tt" src="http://thirdwx.qlogo.cn/mmopen/vi_32/0Jq4diagPd9fiaPXhic7JDggfw3YMdMGicibZRVduZF1lqak8p8ONkFEDJwaeYYK5rk0MKB0iaPdRGH4wFGQzWP3ASrQ/132">
              </span>
          </div>
          <div class="bvt">
              <div class="ggys01">
                  <span>Cloud</span>
                  <span class="jl">(距离上一名还差100蜂蜜)</span>
              </div>
              <div class="ggys02">
                  <span>排名：14 </span>
                  <span class="shu">|</span>
                  <span>蜂蜜：68.58406309</span>
              </div>
          </div>
      </div>
    </div>
    <div class="mybox">
      <ul>
        <li v-for="(item,index) in 10" :key="index">
          <div class="mybox-l">
            <span class="xgjp">
              <img class="navi-thumb" src="../../assets/images/diyi.png" width="25" height="25">
            </span>
            <span class="xg">
              <img class="navi-thumb" src="http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoXbuqekyH7vsnQqXRP3ZByS5ywuR2iccMPicCjfvRNJcV0ia43J3gepbmIiaqYhwActNK0LibeONOdPfA/132" width="40" height="40">
            </span>
            <span class="xgma">冷瞳</span>
          </div>
          <div class="mybox-r">
              <i>259.33127158</i> 蜂蜜
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'me_rank',
    components: {},
    data () {
      return {}
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .t2 {
    width: 100%;
    height: 6.133333rem;
    background: url(../../assets/images/profit_bg.png) no-repeat;
    position: relative;
  }
  .touxiang {
    width: -webkit-calc(100% - 1rem);
    padding-bottom: 1.6rem;
    background: #fff;
    border-radius: 1em;
    position: absolute;
    left: 0.5rem;
    top: 10%;
    background: url(../../assets/images/b.png);
    background-size: 100% 8.0rem;
    height: 8.0rem;
    background-repeat: no-repeat;
    display: flex;
  }
  .touxiang .t2_m {
    padding-top: 1.6rem;
    margin-left: 1.066667rem;
    text-align: center;
    float: left;
  }
  .touxiang .t2_t {
    display: block;
    vertical-align: middle;
    margin: 0 auto;
  }
  .touxiang .tt {
    border: 0.106667rem solid #fff;
    border-radius: 100%;
    width: 3.253333rem;
    height: 3.253333rem;
  }
  .bvt {
    float: left;
    margin-top: 2.666667rem;
    margin-left:0.8rem;
  }
  .ggys01 {
    margin-bottom: 0.533333rem;
  }
  .bvt span.jl {
    color: #ff4b4b;
  }
  .shu {
    padding-left: 1.066667rem;
    padding-right: 1.066667rem;
  }
  .mybox {
    background: #fff;
    width: 100%;
    overflow: hidden;
    margin-bottom: 0.8rem;
    margin-top: 2.666667rem;
    font-style: normal;
  }
  .mybox li {
    border-bottom: .01333rem #eee solid;
    height: 3.733333rem;
    margin-left: 1.866667rem;
    display: flex;
    align-items: center;
  }
  .mybox-l {
    float: left;
    width: 60%;
  }
  .mybox-l .xgjp {
    display: inline-block;
    text-align: center;
    line-height: 3.733333rem;
    border-radius: 100%;
    overflow: hidden;
    width: 15%;
    align-items: center;
    height: 3.733333rem;
    float: left;
    font-size: 1.3em;
  }
  .xgjp img {
    margin-top: 1.173333rem;
    display: block;
  }
  .mybox-l .xg {
    display: inline-block;
    text-align: center;
    line-height:3.733333rem;
    margin-left: 0px;
    float: left;
    border-radius: 100%;
    overflow: hidden;
  }
  .mybox-l .xg img {
    margin-top: 0.533333rem;
    vertical-align: middle;
    margin: 0 auto;
    border: 1px solid #fff;
    border-radius: 100%;
    width: 2.346667rem;
    height: 2.346667rem;
  }
  .mybox .xgma {
    font-size: 1.3em;
    padding-left: 0.533333rem;
    float: left;
    line-height: 3.733333rem;
    width: 45%;
    height: 50px;
    overflow: hidden;
    display: block;
  }
  .mybox-r {
    float: right;
    height: 2.666667rem;
    line-height: 2.666667rem;
    padding-right: 0.8rem;
    color: #ff4b4b;
    font-size:0.64rem;
  }
  .mybox-r i{
    font-style: normal;
  }
</style>
