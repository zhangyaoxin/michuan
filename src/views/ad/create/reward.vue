<template>
  <div class="reward" :class="{'mar_top':preBvt&&rewardType}">
    <section class="no_add" @click="handleReward" v-if="!preBvt||!rewardType">
      <img src="../../../assets/images/put_reward_icon.png" alt="">
      <span>添加传播激励</span>
    </section>

    <section class="reward_wrap" v-else>
      <div class="reward_detail van-hairline--bottom">
        <div>累计发放 {{total_sent |filterFm}} 蜂蜜</div>
        <div>预算余额 {{left_bvt||preBvt |filterFm}} 蜂蜜</div>
        <div v-if="rewardType===1">浏览奖励 {{browseBvt |filterFm}} 蜂蜜</div>
        <div v-if="rewardType===1">分享奖励 {{shareBvt |filterFm}} 蜂蜜</div>
        <div v-if="rewardType===2">红包个数 {{bvtNum |filterFm}} 蜂蜜</div>
        <div v-if="rewardType===2">剩余红包 {{total_sent||bvtNum |filterFm}} 蜂蜜</div>
      </div>
      <div class="reward_ops">
        <div class="editor_ops_item" @click="handleReward">
          <img src="../../../assets/images/editor_edit_icon.png" alt="">
          <span>编辑</span>
        </div>
        <div class="editor_ops_item" @click="del">
          <img src="../../../assets/images/editor_del_icon.png" alt="">
          <span>删除</span>
        </div>
      </div>
    </section>

    <van-actionsheet v-model="isAddRewardMd" :actions="curActions" cancel-text="放弃操作" @select="selectRewardType" />
  </div>
</template>

<script>
  import progressBar from '@@/ad_put/progress_bar'
  import { mapState } from 'vuex'
  export default {
    name: 'reward',
    components: { progressBar },
    data () {
      return {
        isAddRewardMd: false,
        allAction: [
          [

            {
              name: '普通红包',
              path: 'reward'
            },
            {
              name: '拼手气红包',
              path: 'luck_reward'
            }
          ],
          [
            {
              name: '编辑',
              path: 'reward'
            },
            {
              name: '修改为拼手气红包',
              path: 'luck_reward'
            }
          ],
          [
            {
              name: '编辑',
              path: 'luck_reward'
            },
            {
              name: '修改为普通红包',
              path: 'reward'
            }
          ],
        ],
        curActions: [],
      }
    },
    computed: {
      ...mapState({
        rewardType: state => state.ad.rewardType,
        preBvt: state => state.ad.preBvt,
        browseBvt: state => state.ad.browseBvt,
        shareBvt: state => state.ad.shareBvt,
        bvtNum: state => state.ad.bvtNum,
        total_sent: state => state.ad.total_sent,
        left_bvt: state => state.ad.left_bvt,
      })
    },
    methods: {
      handleReward () {
        const type = this.rewardType
        this.curActions = this.allAction[type]
        this.isAddRewardMd = true
      },

      selectRewardType (item) {
        const type = item.path === 'reward' ? 1 : 2
        this.$store.commit('changeAd', { type: 'rewardType', val: type })
        this.$router.push({ path: item.path, query: this.$route.query })
      },

      del () {
        this.$store.commit('delAdReward')
      }
    }
  }
</script>

<style lang="scss">
  .mar_top {
    margin: 10px 0;
  }
  .reward {
    background: #fff;
    padding: 0.8rem;

    .reward_detail {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding-bottom: 10px;
      color: #666;
      font-size: 12px;
      line-height: 16px;
      div {
        width: 47%;
      }
    }
    .reward_ops {
      display: flex;
      margin-top: 10px;
      .editor_ops_item:first-child {
        margin-left: 0;
        margin-right: 15px;
      }
      .editor_ops_item {
        margin-left: 0;
        padding: 0;
        width: 50%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: #e7e7e7;
        border-radius: 4px;
        img {
          top: 8px;
        }
      }
    }
  }
</style>
