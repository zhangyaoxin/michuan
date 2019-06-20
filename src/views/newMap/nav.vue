<template>
  <div class="nav">
      <div class="cityChoose">
        <span>南京</span><img src="@/assets/images/jt_b.png" alt="">
      </div>
      <div class="search clearflex">
          <img src="@/assets/images/search.png" alt="">
          <input type="text" value="" placeholder="请输入商户名称"/>
      </div>
      <div class="msg">
        <img src="@/assets/images/msg.png" alt="">
      </div>
  </div>
</template>

<script>
  export default {
    name: 'nav',
    data () {
      return {
        
      }
    },
    computed: {
      
    },
    methods: {
      
    },
    created () {

    }
  }
</script>

<style lang="scss">
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
    width: auto;
    font-size: 0.8rem;
    font-weight: bold;
    color: #fff;
    margin-left: 0.5rem;
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
  }
  .search img{
   float: left;
  //  width: 10%;
   margin-left: .106667rem;
   margin-top: -2px;
  //  width: 0.95rem;
  //  height: 0.95rem;
  }
  .search input{
    width: 80%;
    height: 100%;
    background: none;
    color: #fff;
    border: none;
    outline: none;
    padding-left: 0.3rem;

  }
  .msg img{
    width: 1.3rem;
    height: 1.3rem;
    margin-left: 0.5rem;
  }
</style>
