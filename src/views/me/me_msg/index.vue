<template>
  <div class="me_msg_wrap">
    <van-cell-group class="cell_group">
      <van-cell :title="item.title" is-link :to="{path:toPath,query:{type:item.msg_id}}" v-for="(item,index) in msgTypeList" :key="index">
        <img class="list_icon" slot="icon" :src="item.icon" alt="">
        <div class="msg_num" v-if="unreadMsgList[item.msg_type]">{{unreadMsgList[item.msg_type]|filterMsgNum}}</div>
      </van-cell>
    </van-cell-group>
    <!-- 
    <div @click="connectionWsBtn">连接长连接</div>
    <div @click="dispatchPushMsg">触发推送消息</div> -->
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import connection from '@/utils/msg_ws'
  import { msgTypeList } from '@/assets/js/common.js'
  export default {
    name: 'me_msg',
    props: {},
    components: {},
    data () {
      return {
        msgTypeList: msgTypeList,

        rechargeCount: '',
        withdrawCount: '',
        mallCount: '',
        systemCount: '',
      }
    },
    computed: {
      ...mapState({
        isLogin: state => state.isLogin,
        msg: state => state.msg,
        unreadMsgList: state => state.unreadMsgList
      }),
      toPath () {
        return this.isLogin ? 'msg_list' : 'login'
      }
    },
    methods: {
      // 获取用户消息
      getUserMsgList () {
        this.$store.dispatch('getUserMsgList')
      },


      dispatchPushMsg () {
        const msg = {
          type: 1,
          data: {
            msg: '我是推送消息'
          }
        }
        const params = {
          user_id: 3,
          msg: JSON.stringify(msg)
        }
        this.$api.initiativePushMsg(params)
          .then(data => {
            console.log(data)
          })
      },
      connectionWsBtn () {
        connection()
      }
    },
    created () {
      this.getUserMsgList()
    }
  }
</script>

<style lang="scss">
  .me_msg_wrap {
    .van-cell {
      padding: 12px 15px;
      align-items: center;
    }
    .list_icon {
      margin-right: 15px;
      width: 27px;
      height: 27px;
    }
    .msg_num {
      display: inline-block;
      padding: 0 6px;
      border-radius: 16px;
      height: 16px;
      line-height: 16px;
      color: #fff;
      background: #ff4c4c;
      font-size: 12px;
    }
  }
</style>
