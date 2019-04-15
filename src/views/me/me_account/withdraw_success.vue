<template> 
     <div class="me_account">
    <div class="me_header">
       <div class="header_top">
           <img src="../../../assets/images/withdraw_success.png" alt="">
           <div class="header_success">提现成功</div>    
       </div>
    </div>


    <div class="me_withdraw">
      <div class="list_with">
           提现<i>1000</i>蜂蜜，获得
      </div>
      <div class="list_draw">
          <span>￥</span><i>10</i>
      </div>
    </div>
     <div class="me_sure">
          <button id="confirmWithdraw" class="btn"  @click="finish">
              完成
          </button>
        </div>

  </div>

  
  
</template>

<script>
import api from '../../../api/user.js';
  export default {
    name: 'withdraw_success',
    props: {

    },
    components: {

    },
    data () {
      return {
        account:{}
      }
    },
    computed: {

    },
    created(){
      console.log(2233)
      this.getmymsg()
    },
    methods: {
        finish(){
            this.$router.push({path: '/account_withdraw'})
        }
      },
      getmymsg(){
        api.getAccount().then((data)=>{
          if(data.response_code == 200){
            this.account = data.data; // 将请求的数据赋值到data对象中的account对象里
            console.log(this.account)
          }else{
            console.log('请求失败',data.msg)
          }
        })
      }
    }
  
</script>

<style scoped lang="scss">
    body{
       background: #ffffff !important;
    }
    .header_top{
        margin-top: 2rem;
        text-align: center;

    }
    .header_top img{
        width: 1.5rem;
        height:1.5rem;
    }
    .header_top .header_success{
      color: #ff4c4c;
      margin-top: 0.8rem;
      font-size: 1rem;
    }
    .me_withdraw{
      text-align: center;
      margin-top: 6rem;
    }
    .me_withdraw i{
      font-style: normal;
    }
    .me_withdraw .list_with{
      color: #333333;
    }
    .me_withdraw .list_draw{
      margin-top: 1rem;
    }
    .list_draw span{
      font-size: 1.5rem;
      color: #333333;
      font-weight: 600;
    }
    .list_draw i{
      font-size: 2.5rem;
      color:#333333;
      font-weight: 600;
    }
    .me_sure{
      margin-top: 10rem;
      text-align: center;
      font-size: 1rem;
    }
    .me_sure .btn{
       width: 60%;
      padding: 0.693333rem 0.64rem;
      color: #ff4c4c;
      background: #f4f4f4;

      border-style:solid;
      border-width:1px;
      border-color:#ff4c4c;
      border-radius: 4px;
    }
</style>