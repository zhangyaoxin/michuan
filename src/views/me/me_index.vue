<template>
  <div class="me_index">
    <div class="user_wrap">
      <!-- 用户信息 -->
      <div class="user_info_wrap">
        <div class="user_avatar user_center">
          <img :src="info.thumbnail|filterImg('avatar')" alt="">
        </div>

        <div class="user_nickname user_center ellipsis">{{info.nickname}}</div>

        <!-- <div class="user_badge_wrap user_center">
          <div class="user_level">{{info.badges[0] | filterLevel}}</div>
          <div class="user_badge">
            <img :src="info.badges[1] | filterBadge(putBadgeIcon)" alt="">
          </div>
          <div class="user_badge">
            <img :src="info.badges[2] | filterBadge(shareBadgeIcon)" alt="">
          </div>
        </div> -->

        <div class="user_signature user_center ellipsis">{{info.motto||'蜜传,浏览转发都赚钱,赶紧行动起来吧!'}}</div>

        <router-link to="login" class="user_attent" v-if="!isLogin">关注</router-link>

        <div class="user_attent" v-if="isShowAttentBtn" @click="attentBtn(info.is_concern)">{{info.is_concern===1?'已关注':'关注'}}</div>

        <!-- 二维码 -->
        <router-link :to="{path:'me_qrcode'}" class="user_qrcode" v-if="isShowEdit"> </router-link>
      </div>

      <!-- 用户统计 -->
      <div class="user_count_wrap">
        <router-link :to="{path:'user_ad_list',query:{id:info.id,nickname:info.nickname}}" class="user_count_item">
          <p>{{info.counts.advertises_counts}}</p>
          <p>发布</p>
        </router-link>
        <router-link :to="{path:'me_attent',query:{id:info.id,nickname:info.nickname}}" class="user_count_item">
          <p>{{info.counts.concerns_counts}}</p>
          <p>关注</p>
        </router-link>
        <router-link :to="{path:'me_fans',query:{id:info.id,nickname:info.nickname}}" class="user_count_item">
          <p>{{info.counts.fans_counts}}</p>
          <p>粉丝</p>
        </router-link>
      </div>

      <!-- 用户关注 -->
      <div class="user_attent_wrap" v-if="memberList.length">
        <div class="user_attent_bar">
          <div class="user_attent_title">{{isOwn?'我的关注':'Ta也喜欢'}}</div>
          <router-link :to="{path:'me_attent',query:{id:info.id,nickname:info.nickname}}" class="user_attent_more">更多</router-link>
        </div>

        <div class="attent_user_wrap">
          <router-link :to="{path:'me_index',query:{id:item.id}}" class="attent_user_item" v-for="(item,index) in memberList" :key="index">
            <div class="attent_user_avatar user_center">
              <img :src="item.thumbnail|filterImg('avatar')" alt="">
            </div>
            <div class="attent_user_nickname user_center ellipsis "> {{item.nickname}} </div>
          </router-link>
        </div>
      </div>

      <!-- 广告列表 -->
      <div class="user_ad_wrap">
        <div class="user_attent_bar">
          <div class="user_attent_title">{{isOwn?'我的发布':'Ta的发布'}}</div>
        </div>
        <ad-list ref="adList" :class="{'nothing_warp_top':memberList.length}" :searchCond="searchCond" @changeEvent="init"></ad-list>
      </div>
    </div>
  </div>
</template>

<script> 
  import store from '@/store'
  import { mapState } from 'vuex'
  import { getStore, setStore, setPagesTitle } from '@/utils/utils'
  import adList from '@@/ad_list'
  let Base64 = require('js-base64').Base64
  export default {
    name: 'me_index',
    components: { adList },
    data () {
      return {
        putBadgeIcon: 'http://www.oldda.cn/FjepLDrJtIIcl9zYQEPooxfiSyLu',
        shareBadgeIcon: 'http://www.oldda.cn/FpNR58W3TaEZeFh970OlEXuEdtWI',

        isOwn: false,

        curMembId: '',

        info: {
          counts: {},
          badges: {},
        },

        searchCond: {},

        memberList: []
      }
    },
    filters: {
      filterLevel (obj) {
        return obj ? obj.name : 'Lv0'
      },
      filterBadge (obj, type) {
        if (obj && obj.thumbnail) return obj.thumbnail
        return type
      }
    },
    computed: {
      ...mapState({
        isLogin: state => state.isLogin,
        userId: state => state.userInfo.id
      }),
      isShowAttentBtn () {
        return this.isLogin && (this.info.is_concern === 0 || this.info.is_concern === 1)
      },
      isShowEdit () {
        return this.isLogin && (this.info.is_concern === -1 || !this.info.hasOwnProperty("is_concern"))
      }
    },
    watch: {
      $route (n, o) {
        this.init(n.query.id)
      }
    },
    methods: {
      init (id) {
        if (!id) {
          this.isOwn = true
          id = this.userId
          this.$refs.adList.isOwn = true
        } else {
          this.isOwn = false
          this.$refs.adList.isOwn = false
        }
        this.searchCond = {
          user_id: id,
        }
        this.curMembId = id

        this.getUserInfo(id)

        setTimeout(() => {
          this.getUserAttren(id)
        }, 1000);

        this.$nextTick(() => {
          this.$refs.adList.page = 1
          this.$refs.adList.getAdList()
        })
      },

      async attentBtn (isAtten) {
        const type = isAtten === 0 ? 1 : 0
        const concern_id = this.userId
        const concerned_id = this.info.id
        const res = await this.$store.dispatch('changeAttent', { concern_id, concerned_id, type })
        if (res) this.init(this.info.id)
      },

      async getUserInfo (id) {
        const { data } = await this.$store.dispatch('getUserInfo', id)
        // data.nickname = Base64.decode(data.nickname)
        this.info = data
        if (!this.isOwn) {
          setPagesTitle(this.info.nickname + '的主页')
        }
      },

      // 获取用户关注列表
      getUserAttren (id = this.userId) {
        const params = {
          page: 1,
          limit: 4
        }
        this.$api.getUserAttentList(id, params)
          .then(data => {
            console.log('获取用户关注 ==>', data)
            if (data.status) {
              this.memberList = data.data.data.map(it => it.fans)
            }
          })
      }
    },

    mounted () {
      let id = this.$route.query.id
      this.init(id)
    }
  }
</script>

<style lang="scss">
  .me_index {
    .user_center {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }

    .ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user_info_wrap {
      position: relative;
      padding: 0.8rem;
      box-sizing: border-box;
      height: 7.733333rem;
      background: url("../../assets/images/user_bg.png");
      background-size: cover;
      color: #fff;
      text-align: center;
    }

    .user_avatar {
      width: 2.506667rem;
      height: 2.506667rem;
      border-radius: 100%;
      border: 0.053333rem solid #fff;
      background: #fff;
      overflow: hidden;
    }

    .user_avatar img {
      width: 100%;
    }

    .user_nickname {
      width: 10.133333rem;
      font-size: 0.853333rem;
      line-height: 1.506667rem;
    }

    .user_badge_wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 5rem;
    }

    .user_level {
      padding: 0 0.213333rem;
      height: 0.853333rem;
      line-height: 0.853333rem;
      font-size: 0.64rem;
      background-color: #fff;
      border-radius: 0.106667rem;
      color: #333;
    }

    .user_badge {
      width: 1.226667rem;
      height: 1.013333rem;
      overflow: hidden;
    }

    .user_badge img {
      width: 100%;
    }

    .user_signature {
      width: 15rem;
      line-height: 1.6rem;
      font-size: 0.64rem;
    }

    .user_attent {
      position: absolute;
      top: 1.493333rem;
      right: 0.8rem;
      padding: 0.06rem 0.56rem;
      font-size: 0.746667rem;
      color: #fff;
      border-radius: 0.586667rem;
      border: 1px solid #fff;
    }

    .user_count_wrap {
      display: flex;
      align-items: center;
      padding: 0.8rem 0;
      box-sizing: border-box;
      background: #fff;
      height: 3.2rem;
      line-height: 18px;
    }

    .user_count_item {
      width: 100%;
      border-right: 1px solid #e8e8e8;
      text-align: center;
      font-size: 0.64rem;
      color: #999;
    }

    .user_count_item p:first-child {
      font-size: 0.96rem;
      color: #333;
      font-weight: bold;
    }

    .user_attent_wrap {
      padding: 0.8rem;
      margin-top: 0.533333rem;
      background: #fff;
    }

    .user_attent_bar {
      display: flex;
      align-items: center;
      font-size: 0.8rem;
    }

    .user_attent_title {
      flex: 1;
      position: relative;
      padding-left: 0.533333rem;
      font-weight: bold;
    }

    .user_attent_title::before {
      content: "";
      display: block;
      position: absolute;
      top: 5px;
      left: 0;
      width: 0.106667rem;
      height: 0.8rem;
      background: #ff4c4c;
    }

    .user_attent_more {
      position: relative;
      padding-right: 0.533333rem;
      font-size: 0.64rem;
      color: #c4c4c4;
    }

    .user_attent_more::after {
      content: "";
      display: block;
      position: absolute;
      top: 0.5rem;
      right: 0;
      width: 0.32rem;
      height: 0.32rem;
      border-style: solid;
      border-width: 0.053333rem;
      border-color: #c4c4c4 #c4c4c4 transparent transparent;
      transform: rotate(45deg);
    }
    .user_qrcode {
      position: absolute;
      top: 1.493333rem;
      right: 0.8rem;
      width: 1.28rem;
      height: 1.28rem;
      background: url("../../assets/images/qrcode_icon.png");
      background-size: 1.28rem 1.28rem;
    }

    .attent_user_wrap {
      display: flex;
      /* justify-content: space-between; */
      margin-top: 0.8rem;
    }

    .attent_user_item {
      width: 25%;
      font-size: 0.64rem;
      text-align: center;
    }

    .attent_user_avatar {
      margin-bottom: 0.426667rem;
      width: 3.2rem;
      height: 3.2rem;
      border-radius: 100%;
      overflow: hidden;
    }

    .attent_user_avatar img {
      width: 100%;
    }

    .attent_user_nickname {
      width: 4.266667rem;
    }

    .user_ad_wrap {
      margin-top: 10px;
      min-height: 54px;
      background: #fff;
      .user_attent_bar {
        padding: 15px 15px 0;
      }
    }

    .nothing_warp_top {
      .nothing_wrap {
        top: 75%;
      }
    }
  }
</style>
