<template>
  <div class="me_badge">
    <div class="badge_header">
      <div class="cur_badge_img">
        <img :src="curBadge" alt="">
      </div>
      <div class="cur_badge_info">
        <p>创作数:
          <span class="col_ffe700">{{curMake}}</span>
        </p>
        <p>距离徽章升级还需要
          <span class="col_ffe700">{{needMake}}</span>
          次创作
        </p>
      </div>
    </div>
    <div class="badge_section">
      <div class="badge_title">徽章说明</div>
      <div class="badge_main">
        <div class="badge_desc">
          <p>1.发布徽章是蜜传平台颁发给发布者的荣誉凭证，象征着荣耀；</p>
          <p>2.发布徽章是根据发布者创作并成功发布的次数来进行分级。</p>
        </div>
        <div class="badge_list_warp">
          <div class="badge_list_title">徽章列表</div>
          <div class="badge_list">
            <div class="badge_item" v-for="(item,index) in 8" :key="index">
              <img src="http://p9f83pjwn.bkt.clouddn.com/FjepLDrJtIIcl9zYQEPooxfiSyLu" alt="" class="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'me_badge',
    props: {},
    components: {},
    data () {
      return {
        curDesc: '',
        curBadge: 'http://p9f83pjwn.bkt.clouddn.com/FjepLDrJtIIcl9zYQEPooxfiSyLu',
        curMake: '2',
        needMake: '9',
        account: {},
      }
    },
    computed: {},
    methods: {
      getmymsg (name, type) {
        let req = {
          limit: 8,
          type: type
        };

        api.getLevelBadge(req)
          .then((data) => {
            if (data.response_code == 200) {
              this.account = data.data.data[0]; // 将请求的数据赋值到data对象中的account对象里
              console.log(this.account)
            } else {
              console.log('请求失败', data.msg)
            }
          })
      },
    },
    created () {
      console.log(this.$route.name, '$route.name')
      this.getmymsg('q', 2)
    }
  }
</script>

<style lang="scss">
  @import "../../assets/css/badge";
</style>
