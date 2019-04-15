<template>
  <div class="active_page">
    <img v-if="type==1" src="../../assets/images/active_1.jpg" alt="">
    <img v-if="type==2" src="../../assets/images/active_2.png" alt="">
    <img v-if="type==3" src="../../assets/images/active_3.png" alt="">
  </div>
</template>

<script>
  export default {
    name: 'active_warp',
    components: {},
    data () {
      return {
        type: 1
      }
    },
    methods: {},
    created () {
      this.type = this.$route.query.id
    }
  }
</script>

<style lang="scss">
  .active_page {
    img {
      width: 100%;
    }
  }
</style>
