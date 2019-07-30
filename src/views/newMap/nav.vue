<template>
<div>
   <div class="nav">
      <div class="cityChoose cityChoice">
        <div class="cityInput"  v-on:click='cityPatFun'>
          <span>{{cityInputVal}}</span><img src="@/assets/images/jt_b.png" alt="">
        </div>
      </div>
      <div class="search clearflex" @click="$router.push('homeSearch')">
          <img src="@/assets/images/search.png" alt="">
          <input v-model="search" type="text" value="" placeholder="请输入商户名称"/>
      </div>
      <div class="msg" v-if="false">
        <img src="@/assets/images/msg.png" alt="">
      </div>
      
  </div>
  <!-- <div class="cityChoice">

    <h3>点击输入框选择内容</h3>

    <input type="text" class="cityInput" v-model.trim='cityInputVal' v-on:click='cityPatFun'/>

  </div> -->
  <com-citychoice ref="city" v-on:tochildevent='cityjs' v-on:pois="poiadd"></com-citychoice>
</div>
 
</template>

<script>
import ajes from '@@@/area.js'
import check_city from "@@/check_city.vue";
  export default {
    name: 'nav',
    data () {
      return {
        cityInputVal:'南京',
        poi:'',
        code:'',
        addressCity:'南京',
        search:'',
      }
    },
    components:{
      'com-citychoice':check_city
    },
    computed: {
      
    },
    methods: {
      resetAddress(){
        this.$parent.goBackNowCity();
      },
      cityPatFun:function(){

        this.$refs.city.cityFun();

      },

      cityjs:function(data){

        this.cityInputVal=data;
         localStorage.checkCity = data;

      },
      poiadd(data){
        this.poi = data
      }
    },
    mounted() {
      this.code = this.$parent.code;
      if(localStorage.checkCity){
        this.cityInputVal = localStorage.checkCity;
      }else{
        this.cityInputVal = this.$parent.cityName;
      }
      this.addressCity = this.$store.state.addressData.city;
      console.log(this.$store.state.addressData.city,this.$parent.cityName,'定位城市 navload')
       this.$watch('cityInputVal', (e) => {
        // console.log('城市改变',e,this.poi,'change')
         this.$emit('address',{city:e,poi:this.poi})
       })
    },
    created () {

    }
  }
</script>

<style lang="scss" scope>
    .clearfix:after {visibility: hidden;display: block;font-size: 0;content: ".";clear: both;height: 0;}
    input::-webkit-input-placeholder{
            color: #f6f6f6;
            font-size: 0.7rem;
        }
        input::-moz-placeholder{   /* Mozilla Firefox 19+ */
            color:#f6f6f6;
            font-size: 0.7rem;
        }
        input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
            color:#f6f6f6;
            font-size: 0.7rem;
        }
        input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
            color:#f6f6f6;
            font-size: 0.7rem;
        }
  .nav {
    
    padding: 0px 15px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    position: fixed;
    top: -1px;
    width: 100%;
    height: 2.613333rem;
    text-align: center;
    font-size: 0.64rem;
    background: #fff;
    border-top: 1px solid #e8e8e8;
    z-index: 2011;
    background-image: -webkit-linear-gradient(left, #FF7232, #FF3440); 
  }
  .cityChoose{
    // width: 4.8rem ;
    // width: auto;
    font-size: 0.8rem;
    font-weight: bold;
    color: #fff;
    // margin-left: 0.5rem;
  }
  .cityChoose img{
    width: 0.7rem;
    margin: 0.4rem 0rem 0rem 0.2rem;
  }
  .search{
    width: 13.8rem;
    height: 1.7rem;
    border-radius: 40px;
    text-align: left;
    margin-left: 0.5rem;
    background:rgba($color: #F4F4F4, $alpha: 0.3);
    // background: #cacaca;
  }
  .search img{
   float: left;
  //  width: 10%;
   width: 0.75rem;
   height: 0.75rem;
  }
  .search input{
    width: 80%;
    height: 100%;
    background: none;
    color: #666;
    border: none;
    outline: none;
    padding-left: 0.3rem;
  }
  .msg img{
    width: 1.3rem;
    height: 1.3rem;
    margin-left: 0.5rem;
  }
  .city_now{
    padding-top: 2.5rem;
    border-bottom:solid .53rem /* 20/37.5 */ #f4f4f4;
  }
  .now_address{
    padding:0 .8rem /* 30/37.5 */ ;
    p{
      font-size: .64rem /* 24/37.5 */;
      color: #999;
      line-height: .64rem /* 24/37.5 */;
      padding-top: 1.28rem /* 48/37.5 */;
      padding-bottom: .85rem /* 32/37.5 */;
    }
    .address_ad{
      display: flex;
    }
    .reset{
      color: #ff4c4c;
      font-size:.75rem /* 28/37.5 */;
    }
    .address_lt{
      flex:1;
      font-size: .8rem /* 30/37.5 */;
      color: #333;
      font-weight: 600;
      margin-bottom: 1.28rem /* 48/37.5 */;
      line-height: .8rem /* 30/37.5 */;
      img{
        width:.75rem /* 28/37.5 */;
        margin-right: .53rem /* 20/37.5 */;
      }
    }
    .address_name{
       color: #333333;
    }
  }
  .clearflex{
    // background:#f7f8fa;
    // width:15.15rem ;
    flex: 1;
    input{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;}
    img{
      margin-left: .53rem /* 20/37.5 */;
      margin-top: .5rem /* 15/37.5 */;
    }
    color: #666;
    input::-webkit-input-placeholder {
        /* placeholder颜色  */
        color: #CECDCD;
    }
  }
 /* *{padding:0; margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}

  body{font-family:Microsoft Yahei,Verdana,Geneva;font-weight:normal; font-size:12px;} */

img{border:none;}

ol,ul,li{list-style:none;}

i,em{font-style:normal;} 

.transit{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;
  transition:all 0.4s linear 0s; -moz-transition:all 0.4s linear 0s;-webkit-transition:all 0.4s linear 0s;-o-transition:all 0.4s linear 0s;-ms-transition:all 0.4s linear 0s;}

.cityChoice{text-align:center; margin-top: 0.5rem;}

.cityInput{
  text-align: left;
}
.cityInput span{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 4em;
    display: inline-block;
  }

/**头部**/

.cityChoiceBox{width:100%; min-height:1000px; position:absolute; top:0; display:none; background-color:#fff;z-index:999999}

.cityChoiceBox .cityChoice-top{position:fixed; width:100%;  padding:.35rem  15px .35rem 15px;  color:#cecdcd ;z-index:9999999; background: #fff; border-bottom: 1px solid #cecdcd ;}

.cityChoiceBox .cityChoice-top span{position:absolute; display:inline-block; left:15px; top:18px; font-size:20px;
    width: 10px;
    height: 10px;
    background: #fff;}

.cityChoiceBox .cityChoice-top .search-input{ border-radius:20px 0 26px 20px; line-height:36px;font-size: .85rem ; padding:0 6px 0 20px; border:none; color: #666; }

// .cityChoiceBox .focus{padding:0 50px 0 15px;}

.cityChoiceBox .cityChoice-top .cancel{position:absolute; font-size:.8rem /* 30/37.5 */; display:inline-block; height:2.32rem ;line-height: 2.32rem ; right:.8rem ; top:0; color: #333333;}

.cityChoiceBox .search-box{position:absolute; left:0;  top:56px;  background-color:#fff; width:100%;
  p{
     background-color:#fff;
  }
}

/**城市**/

.cityChoiceBox .city-Box{position:relative; width:100%; }

.cityChoiceBox .city-Box h3{font-weight:400; color:#999;}

.cityChoiceBox .city-Box span{display:inline-block;width:27%; height:32px; margin:.37rem /* 14/37.5 */;margin-left: 0; line-height:32px; background-color:#fff; text-align: center; border:1px solid #ccc; }

.cityChoiceBox .city-Box .city-sidaber{position:fixed; right:10px;/* top:65px; */  width:30px; line-height: 1.05rem;text-align:center; font-size:.5rem ; color:#999;}

.cityChoiceBox .host-city{padding:12px; }

.cityChoiceBox .city-content h3{padding:6px 15px; background-color:#fff; font-weight:400; /* border-top:1px solid #ccc; */ border-bottom:1px solid #ccc;}

.cityChoiceBox .city-content p{padding:10px 15px; border-bottom:1px solid #e1e1e1; margin-bottom:0;}

.cityChoiceBox .zimShow{position:fixed; left:50%; top:300px; margin-left:-20px; width:60px; height:60px; line-height:60px; text-align: center; background-color:rgba(0,0,0,0.5); border-radius:50%; font-size:20px; color:#fff;}

.cityChoiceBox .sousuo{padding:10px 15px; border-bottom:1px solid #e1e1e1; margin-bottom:0;}

  .host_city_list{
    padding-left: 2.05rem /* 77/37.5 */;
    padding-right: 1.65rem /* 62/37.5 */;
    span{
       width: 4.48rem /* 168/37.5 */!important;
       height: 1.6rem /* 60/37.5 */!important;
       line-height: 1.6rem /* 60/37.5 */!important;
       background-color: #f4f4f4 !important;
       color: #666666;
       border-radius: 2px;
       border: none !important;
    }
  }

</style>
