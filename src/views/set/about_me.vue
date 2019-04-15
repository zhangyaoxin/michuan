<template>
  <div class="about_me">
    <div class="me_list">
      <div class="list_item">
        <div class="list_title">当前版本</div>
        <div class="list_num">{{edition_num}}</div>
      </div>
      <div>
        <router-link :to="link" class="list_item">
          <div class="list_title">蜜传用户协议</div>
          <div class="list_arrow"></div> 
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'about_me',
    components: {},
    data () {
      return {
        link:'mc_protocol',
        edition_num:'1.2.1',
      }
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .me_list{
    margin-top: 0.533333rem;
    font-size: 0.8rem;
    color: #333;
  }
  .me_list > div{
    margin: 0.533333rem 0 0;
    padding-left: 0.8rem;
    background: #fff;
  }
  .list_item {
    display: flex;
    align-items: center;
    padding: 0.533333rem 0.8rem 0.533333rem 0;
    border-bottom: 0.01333rem solid #eee;
  }
  .list_icon {
    margin-right: 0.8rem;
    width: 1.6rem;
    height: 1.6rem;
  }
  .list_icon img {
    width: 100%;
  }
  .list_title {
    flex: 1;
    color: #000;
  }
  .list_arrow {
    width: 0.8rem;
    height: 0.8rem;
    background: url("../../assets/images/arrow_icon.png");
    background-repeat: no-repeat;
    background-size: 0.8rem 0.8rem;
  }
  .list_num {
    color: #999;
  }
</style>
