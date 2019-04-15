<template>
  <div class="go_top_warp">
    <div class="go_top" v-show="goTopShow" @click="goTop">
      <i class="iconfont">&#xe65b;</i>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'go_top_warp',
    components: {},
    data () {
      return {
        scrollTop: "",
        goTopShow: false,
        timer: null
      }
    },
    methods: {
      handleScroll () {
        this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        this.goTopShow = this.scrollTop > 500;
      },

      goTop () {
        cancelAnimationFrame(this.timer);
        this.timer = requestAnimationFrame(this.handleAnimation);
      },

      handleAnimation () {
        if (this.scrollTop > 0) {
          this.scrollTop -= 50;
          document.body.scrollTop = document.documentElement.scrollTop = this.scrollTop;
          this.timer = requestAnimationFrame(this.handleAnimation);
        } else {
          cancelAnimationFrame(this.timer);
          this.goTopShow = false;
        }
      }
    },
    mounted () {
      window.addEventListener("scroll", this.handleScroll);
    },

    destroyed () {
      window.removeEventListener("scroll", this.handleScroll);
    }
  }
</script>

<style lang="scss">
  .go_top_warp {
    .go_top {
      position: fixed;
      right: 15px;
      bottom: 65px;
      width: 50px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background: #fff;
      border-radius: 100%;
      color: #ff4c4c;
      box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.22);
      i {
        font-size: 22px;
      }
    }
  }
</style>
