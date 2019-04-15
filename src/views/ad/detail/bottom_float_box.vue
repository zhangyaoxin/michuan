<template>
  <div class="bottom_float_box  van-hairline--top">
    <a href="http://h5.bvcio.com/d" style="width:560px">下载APP <span style="font-size:12px;">领更多红包</span></a>
    <router-link to="home">赚更多</router-link>
    <router-link to="login" v-if="!isLogin">注册/登录</router-link>
    <router-link to="me_account" v-if="isLogin">立即提现</router-link>
  </div>
</template>

<script>
  import { browserVersions } from '@/utils/utils'
  import { mapState } from 'vuex'
  export default {
    name: 'float_box',
    components: {},
    data () {
      return {
        scrollAction: { x: undefined, y: undefined }
      }
    },
    computed: {
      ...mapState({
        h5BaseUrl: state => state.h5BaseUrl,
        isLogin: state => state.isLogin
      })
    },
    methods: {
      downloadApp () {
        this.$toast('下载app')
      }
    },
    mounted () { },
    beforeDestroy () { }
  }
</script>

<style lang="scss">
  @import "../../../assets/css/var";
  .bottom_float_box {
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    padding: 0 0.8rem;
    width: 100%;
    height: 2.666667rem;
    box-sizing: border-box;
    background: #fff;
    color: #65d0cd;
    font-size: 0.853333rem;
    a {
      display: inline-block;
      width: 100%;
      color: #ff4c4c;
    }
    a:nth-child(2) {
      text-align: center;
    }
    a:last-child {
      text-align: right;
    }
  }
</style>
