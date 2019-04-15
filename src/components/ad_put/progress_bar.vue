<template>
  <div class="progress_bar">
    <div class="inner_progr"></div>
    <div class="progr_text">奖励余额 100 蜂蜜</div>
  </div>
</template>

<script>
  export default {
    name: 'progress_bar',
    components: {},
    data () {
      return {}
    },
    methods: {},
  }
</script>

<style lang="scss">
  .progress_bar {
    position: relative;
    padding-left: 6px;
    width: 100%;
    box-sizing: border-box;
    height: 17px;
    line-height: 17px;
    border-radius: 17px;
    border: 1px solid #ff4c4c;
    color: #ff4c4c;

    .inner_progr {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 76, 76, 0.1);
    }
    .progr_text {
      font-size: 0.64rem;
    }
  }
</style>
