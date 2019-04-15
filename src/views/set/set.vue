<template>
  <div class="set">
    <van-cell-group class="cell_group">
      <van-cell title="账户与安全" is-link :to="isLogin?'account_security':'login'"> </van-cell>
    </van-cell-group>

    <van-cell-group class="cell_group">
      <van-cell title="帮助与反馈" is-link to="help_feedback"></van-cell>
    </van-cell-group>

    <van-cell-group class="cell_group">
      <van-cell title="关于蜜传" is-link to="about_me">
        <div>版本1.2.0</div>
      </van-cell>
    </van-cell-group>

    <div class="set_button" v-if="isLogin" @click="signOut"> 退出登录 </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { setStore, getStore, removeStore } from '@/utils/utils'
  export default {
    name: 'set',
    components: {},
    data () {
      return {}
    },
    computed: {
      ...mapState({
        isLogin: state => state.isLogin
      }),
    },
    methods: {
      signOut () {
        this.$store.dispatch('signOut')
      }
    },
  }
</script>

<style  lang="scss">
  @import "../../assets/css/var";
  .set {
    .cell_group {
      margin-top: 0.533333rem;
    }
    .van-cell {
      font-size: 0.8rem;
      color: #000;
    }
    .van-cell__value {
      color: #999;
    }
    .set_button {
      width: 100%;
      height: 2.666667rem;
      line-height: 2.666667rem;
      color: #fff;
      font-size: 0.853333rem;
      text-align: center;
      background: $mc_color;
      position: fixed;
      bottom: 0;
    }
  }
</style>
