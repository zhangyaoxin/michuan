<template>
  <div class="feed_back">
    <van-field v-model="message" type="textarea" placeholder="您的宝贵意见是我们不断进步的动力！" maxlength="100" rows="6" />
    <div class="len">{{message.length}}/100</div>
    <div class="btn" @click="confirmBtn">提交</div>
  </div>
</template>

<script>
  export default {
    name: 'feed_back',
    components: {},
    data () {
      return {
        message: '',
      }
    },
    methods: {
      // 提交意见反馈
      confirmBtn () {
        const content = this.message
        if (!content.trim()) {
          this.$toast('请输入意见反馈')
          return false
        }
        const params = {
          content,
          type: 1
        }

        this.$toast.loading({
          mask: true,
          duration: 0,
          message: '提交中...'
        })

        this.$api.postFeedBack(params)
          .then(data => {
            console.log('提交意见反馈 ==>', data)
            if (data.status) {
              this.$toast.success('提交成功')
              this.message = ''
            } else {
              this.$toast.fail('提交失败')
            }
          })
      }
    }
  }
</script>

<style lang="scss">
  .feed_back {
    height: 100%;
    background: #fff;
    .len {
      padding: 5px 15px;
      text-align: right;
    }
    .phone_num {
      padding: 5px 15px;
    }
    .btn {
      margin: 15px auto;
      width: 92%;
      height: 50px;
      text-align: center;
      line-height: 50px;
      border-radius: 4px;
      background: #ff4c4c;
      font-size: 0.96rem;
      letter-spacing: 2px;
      color: #fff;
    }
  }
</style>
