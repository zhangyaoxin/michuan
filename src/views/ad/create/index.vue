<template>
  <div class="create_ad">
    <!-- 标题 摘要 -->
    <basis></basis>

    <!-- 封面图 -->
    <cover></cover>

    <!-- 优惠券 -->
    <coupon></coupon>

    <!-- 激励奖励 -->
    <reward></reward>

    <!-- 编辑器 -->
    <editor ref="editor"></editor>

    <!-- 发布 -->
    <div class="handle_btn_warp">
      <van-checkbox v-model="is_show" checked-color="#ff4c4c">投稿到首页</van-checkbox>

      <div class="handle_btn">
        <div class="put_btn" @click="confirmPut(0)">保存</div>
        <div class="put_btn comfirm" @click="confirmPut(4)">发布</div>
      </div>
    </div>

    <van-actionsheet v-model="isShowLeaveActions" :actions="leaveActions" cancel-text="放弃操作" @select="handleLeaveActions" />
  </div>
</template>

<script>
  import basis from './basis'
  import cover from './cover'
  import reward from './reward'
  import editor from './editor'
  import coupon from './coupon'

  import { getStore } from '@/utils/utils'
  import { mapMutations } from 'vuex'

  export default {
    name: 'create_ad',
    components: { basis, reward, cover, editor, coupon },
    data () {
      return {
        isCrop: false,
        curAdId: '',
        isWhitePath: false,

        isShowLeaveActions: false,
        leaveActions: [
          {
            type: 1,
            name: '保存后退出'
          },
          {
            type: 2,
            name: '不保存退出'
          }
        ],
      }
    },
    computed: {
      is_show: {
        get () {
          return this.$store.state.ad.is_show == 2
        },
        set (val) {
          console.log(val)
          const value = val ? 2 : 3
          this.$store.commit('changeAd', { type: 'is_show', val: value })
        }
      }
    },
    methods: {
      ...mapMutations(['changeAd']),
      // 获取广告详情
      getAdDetails () {
        const id = this.curAdId
        this.$api.getAdDetails({ id })
          .then(data => {
            console.log('获取广告详情 ==>', data)
            if (data.status) {
              let {
                title,
                sub_title,
                thumbnail,
                content,
                type,
                pre_bvt,
                browse_bvt,
                share_bvt,
                amount,
                coupon,
                is_show,
                total_sent,
                left_bvt
              } = data.data
              coupon = coupon.map(it => {
                it.amount = Number(it.amount)
                return it
              })
              this.changeAd({ type: 'title', val: title })
              this.changeAd({ type: 'summary', val: sub_title })
              this.changeAd({ type: 'thumbnail', val: JSON.parse(thumbnail) })
              this.changeAd({ type: 'rewardType', val: type })
              this.changeAd({ type: 'preBvt', val: Number(pre_bvt) })
              this.changeAd({ type: 'browseBvt', val: Number(browse_bvt) })
              this.changeAd({ type: 'shareBvt', val: Number(share_bvt) })
              this.changeAd({ type: 'bvtNum', val: Number(amount) })
              this.changeAd({ type: 'content', val: JSON.parse(content) })
              this.changeAd({ type: 'couponList', val: coupon })
              this.changeAd({ type: 'is_show', val: is_show })
              this.changeAd({ type: 'total_sent', val: total_sent })
              this.changeAd({ type: 'left_bvt', val: left_bvt })
              this.$refs.editor.setContent()
            }
          })
      },

      confirmPut (status) {
        console.log('发布', status, this.curAdId)
        this.$toast.loading({
          mask: true,
          duration: 0,
          message: '提交中...'
        });
        this.$refs.editor.getContent()
        return this.$store.dispatch('confirmPut', { status, id: this.isCopy ? '' : this.curAdId })
          .then(data => {
            if (data.status) {
              this.$toast.success(status === 0 ? '保存成功' : '发布成功')
              this.isWhitePath = true
              this.$store.commit('resetState')
              if (status === 4) {
                this.$router.replace({ path: 'put_list', query: { type: 4 } })
              } else {
                this.$router.replace({ path: 'put_list', query: { type: 0 } })
                return true
              }
            }
          })
      },

      async handleLeaveActions (sele) {
        const type = sele.type
        if (type === 1) {
          const res = await this.confirmPut(0)
          if (res) {
            this.$store.commit('resetState')
            this.$router.replace('put_list')
          }
        } else {
          this.$store.commit('resetState')
          this.$router.replace('put_list')
        }
      }
    },
    created () {
      this.isCopy = this.$route.query.isCopy || false
      this.curAdId = this.$route.query.id
      const isEdit = this.$route.query.isEdit
      if (this.curAdId && !isEdit) {
        this.getAdDetails()
      }
    },

    // 退出提示
    beforeRouteLeave (to, from, next) {
      const whiteList = ['reduce', 'discount', 'luck_reward', 'reward', 'cover_crop']
      if (this.isShowLeaveActions) {
        next()
      } else if (!whiteList.includes(to.name) && !this.isWhitePath) {
        this.isShowLeaveActions = true
        next(false)
      } else {
        next()
      }
    }
  }
</script>

<style lang="scss">
  .create_ad {
    // padding: 0.8rem;
    min-height: 100%;
    box-sizing: border-box;
    // background: #fff;

    .van-actionsheet__name {
      color: #ff4c4c;
    }

    // 激励奖励
    .no_add {
      padding: 13px 0;
      padding-left: 5.76rem;
      background: #f4f4f4;
      border-radius: 0.213333rem;
      font-size: 0.96rem;
      color: #999;
      img {
        position: relative;
        top: 3px;
        width: 19px;
        height: 19px;
      }
    }
    .mar_top {
      margin-top: 10px;
    }

    .editor_ops {
      display: flex;
      position: absolute;
      top: 0.533333rem;
      right: 0.533333rem;
      justify-content: flex-end;
      z-index: 9;
    }
    .editor_ops_item {
      margin-left: 20px;
      padding: 0px 11px;
      background: #fff;
      border-radius: 24px;
      img {
        position: relative;
        top: 5px;
        width: 15px;
        height: 15px;
      }
    }

    .handle_btn_warp {
      position: fixed;
      bottom: 0;
      width: 100%;
    }

    .handle_btn {
      display: flex;
      align-items: center;
      padding: 0 0.8rem;
      width: 100%;
      height: 50px;
      box-sizing: border-box;
      background: #fff;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    }

    .put_btn {
      width: 50%;
      height: 35px;
      text-align: center;
      line-height: 35px;
      border: 1px solid #ff4c4c;
      letter-spacing: 5px;
      color: #ff4c4c;
      font-size: 16px;
      border-radius: 8px;
    }
    .put_btn.comfirm {
      margin-left: 15px;
      background: #ff4c4c;
      color: #fff;
    }

    .van-checkbox {
      text-align: center;
      background: #f4f4f4;
      padding: 10px;
    }
    .van-checkbox__icon .van-icon {
      border-color: #999;
    }
  }
</style>
