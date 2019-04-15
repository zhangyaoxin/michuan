<template>
  <div class="login">
    <div class="invite_main">
      <van-field v-model="code" type="text" placeholder="请填写邀请码"></van-field>
      <div class="login_btn" @click="confirmHandle">确定</div>
      <div class="cancel_btn" @click="$router.push('home')">跳过</div>
    </div>
    <div class="invite_rule">
      <div class="rule_title">邀请码规则</div>
      <div class="rule_list">
        <p>1.联系您的好友获取蜜传邀请码;</p>
        <p>2.一个用户只能绑定一个邀请码，绑定后不得修改;</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'invite_code',
    props: {

    },
    components: {

    },
    data () {
      return {
        code: '',
      }
    },
    computed: {

    },
    methods: {
      confirmHandle () {
        if (!this.code) {
          this.$toast('请输入邀请码')
        }
      }
    },
    created () {

    }
  }
</script>
<style>
  body,
  #app {
    height: 100%;
  }
</style>
<style scoped lang="scss">
  @import "../../assets/css/login";

  .cancel_btn {
    margin-top: 1.653333rem;
    text-align: center;
    color: #65d0cd;
  }
  .invite_rule {
    margin-top: 3.306667rem;
  }
  .rule_title {
    position: relative;
    padding-left: 0.426667rem;
    font-size: 0.853333rem;
    font-weight: bold;
  }
  .rule_title::before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0.213333rem;
    width: 0.106667rem;
    height: 0.853333rem;
    background: #65d0cd;
  }
  .rule_list {
    margin-top: 0.586667rem;
    color: #666;
  }
</style>
