<template>
  <div class="me_public">
    <ad-manage @handleDelNum="changePubCount"></ad-manage>
  </div>
</template>

<script>
  import adManage from '@@/ad_manage'
  export default {
    name: 'me_public',
    props: {},
    // mixins: [adOps],
    components: { adManage },
    data () {
      return {
        publish_count: '',
        advertise_browse_user: '',
        advertise_share_user: ''
      }
    },
    computed: {

    },
    methods: {
      // 获取用户发布浏览统计
      getUserPutCount () {
        this.$api.getUserPutCount()
          .then(data => {
            console.log(data)
            if (data.status) {
              this.publish_count = data.data.publish_count
              this.advertise_browse_user = data.data.advertise_browse_user
              this.advertise_share_user = data.data.advertise_share_user
            }
          })
      },

      changePubCount () {
        console.log('sadadadadadadadf')
        const num = Number(this.publish_count)
        this.publish_count = num - 1
      }
    },
    created () {
      // this.getUserPutCount()
    }
  }
</script>

<style lang="scss">
  @import "../../assets/css/var";
  .me_public {
    .ad_manage .tab_list {
      position: sticky;
    }
    .ad_manage .ad_list {
      padding-top: 0;
    }
    .pub_count {
      display: flex;
      align-items: center;
      height: 2.666667rem;
      text-align: center;
      background: #f4f4f4;
      color: #999;
      font-size: 0.64rem;
    }
    .count_item {
      width: 100%;
      border-right: 1px solid #e8e8e8;
      line-height: 1.066667rem;
    }
    .count_item:last-child {
      border: none;
    }
    .count_num {
      font-size: 1.066667rem;
      font-weight: bold;
      color: #333;
    }
  }
</style>
