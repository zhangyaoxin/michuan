<template>
  <div class="call_records">
    <van-pull-refresh v-model="isLoadRefresh" @refresh="refreshList">
      <van-list v-model="isLoading" :finished="isFinished" @load="pullList" :offset="100">
        <div class="item van-hairline--bottom" v-for="(item,index) in callList" :key="index" @click="handleCall(item.callnumber)">
          <div class="info">
            <div class="phone">
              <div class="nickname">{{item.callnumber}} <span class="total" v-if="item.num>1"> ( {{item.num}} )</span></div>
              <!-- <div>{{item.callnumber}} </div> -->
            </div>
            <div class="time">
              <div>{{item.created_at|filterDate}}</div>
              <!-- <div>{{item.created_at|filterTime}}</div> -->
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'call_records',
    props: {
      curPhone: String
    },
    data () {
      return {
        page: 0,
        callList: [],

        isLoadRefresh: false,
        isLoading: false,
        isFinished: false,
      }
    },
    filters: {
      filterDate (date) {
        const today = new Date(new Date().toLocaleDateString()).getTime();
        const tomorrow = today - 86400000
        const timer = new Date(date).getTime()

        const time = date.split(' ')[1].split(':')
        time.pop()
        if (timer > today) {
          return '今天 ' + time.join(':')
        } else if (tomorrow < timer && timer < today) {
          return '昨天 ' + time.join(':')
        } else {
          const arr = date.split(' ')[0].split('-')
          arr.shift()
          return arr.join('-') + ' ' + time.join(':')
        }
      },
      filterTime (date) {
        const time = date.split(' ')[1].split(':')
        time.pop()
        return time.join(':')
      }
    },
    computed: {
      ...mapState({
        isLogin: state => state.isLogin
      })
    },

    methods: {
      // 获取电话记录
      getCallRecords () {
        const page = this.page
        if (page === 1) this.callList = []
        this.$api.getCallOrder(12, { page, limit: 50 })
          .then(data => {
            this.isLoadRefresh = false
            this.isLoading = false
            console.log('获取电话记录 ==>', data)
            if (data.status) {
              const list = data.data.data
              // let arr = []
              // for (let it of list) {
              //   if (!arr.length) {
              //     arr.push(it)
              //   } else {
              //     const prev = arr[arr.length - 1]
              //     if (prev.callnumber === it.callnumber) {
              //       let total = prev.total || 1
              //       // const sameCallNumber = prev.sameCallNumber || []
              //       prev.total = total + 1
              //       // sameCallNumber.push(it)
              //       // prev.sameCallNumber = sameCallNumber
              //     } else {
              //       arr.push(it)
              //     }
              //   }
              // }

              this.callList.push(...list)
              if (data.data.total / data.data.per_page <= page) {
                this.isFinished = true
              } else {
                this.isFinished = false
              }
            } else {
              this.isLoadRefresh = false
              this.isLoading = false
              this.isFinished = true
            }
          })
      },

      refreshList () {
        this.page = 1
        console.log('下拉刷新')
        this.isLoadRefresh = true
        this.getCallRecords()
      },

      pullList () {
        if (this.isLogin) {
          console.log('上拉加载')
          this.page++
          this.getCallRecords()
        } else {
          this.isLoadRefresh = false
          this.isLoading = false
          this.isFinished = false
        }
      },

      handleCall (num) {
        this.$emit('changePhone', num)
      },

      addRecord () {
        const tel = this.curPhone
        const timer = new Date().format('yyyy-MM-dd hh:mm:ss')
        const params = {
          callnumber: tel,
          created_at: timer
        }
        this.callList.unshift(params)
      },
      created () { }
    }
  }
</script>

<style lang="scss">
  .call_records {
    padding-left: 15px;
    height: auto;
    font-size: 12px;
    color: #666;
    .item {
      padding: 15px 15px 15px 0;
    }
    .info {
      display: flex;
      align-items: center;
    }
    .phone {
      flex: 1;
      font-size: 14px;
      color: #999;
    }
    .nickname {
      font-size: 18px;
      color: #000;
    }
    .total {
      margin-left: 10px;
    }
    .time {
      text-align: right;
      color: #999;
    }
  }
</style>
