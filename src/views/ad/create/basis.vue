<template>
  <div class="ad_basis">
    <!-- 标题 -->
    <div>
      <van-field class="title_input" v-model="title" type="textarea" :autosize="titleInputOp" rows="1" maxlength="35" placeholder="添加文章标题" @focus="addOutLine"></van-field>
    </div>
    <!-- 摘要 -->
    <div>
      <van-field class="summary_input" v-model="summary" type="textarea" :autosize="summaryInputOp" rows="1" maxlength="64" placeholder="添加文章摘要(发布优惠券时设置店铺地址)"></van-field>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ad_basis',
    components: {},
    data () {
      return {
        titleInputOp: {
          minHeight: 30
        },
        summaryInputOp: {
          minHeight: 20
        },

      }
    },
    computed: {
      title: {
        get () {
          return this.$store.state.ad.title
        },
        set (val) {
          this.$store.commit('changeAd', { type: 'title', val })
        }
      },

      summary: {
        get () {
          return this.$store.state.ad.summary
        },
        set (val) {
          this.$store.commit('changeAd', { type: 'summary', val })
        }
      }
    },

    methods: {},
  }
</script>

<style lang="scss">
  .ad_basis {
    padding: 0.8rem 0.8rem 0 0.8rem;
    background: #fff;

    .van-cell {
      padding: 0;
    }
    textarea {
      padding: 4px 0;
    }
    textarea:focus {
      outline: 2px dashed #ddd;
    }

    .title_input {
      color: #333;
      font-size: 1.066667rem;
      line-height: 26px;
    }

    .summary_input {
      font-size: 0.746667rem;
      color: #a6a6b3;
      line-height: 20px;
    }
  }
</style>
