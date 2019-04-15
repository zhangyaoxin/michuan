<template>
  <!-- 添加图片链接 -->
  <van-popup class="add_img_link" v-model="isAddLinkImgMd" position="bottom">
    <div class="add_link_wrap">
      <van-field v-model="curImgLink" placeholder="请输入图片链接地址" clearable type="textarea" rows="3" autosize></van-field>
      <div class="input_op">
        <div class="text_tip">以http://或https://开头</div>
        <div class="input_btn" @click="confirmAddImgLink(curImgLink)">确定</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
  export default {
    name: 'add_img_link',
    props: {
      isAddLinkImg: Boolean,
      curImgLink: String
    },
    data () {
      return {}
    },
    computed: {
      isAddLinkImgMd: {
        get () {
          return this.isAddLinkImg
        },
        set (val) {
          this.$emit('update:isAddLinkImg', val)
        }
      }
    },
    methods: {
      confirmAddImgLink (link) {
        const reg = /^((https|http)?:\/\/)[^\s]+/;
        if (!reg.test(link)) {
          this.$toast('请输入正确的链接地址')
          return false
        }
        this.$emit('editLink', link)
        this.isAddLinkImgMd = false
      }
    },
  }
</script>

<style lang="scss">
  .add_img_link {
    .add_link_wrap {
      background: #f4f4f4;
      padding: 0.8rem;
    }

    .add_link_wrap .van-cell {
      border: 1px solid #ddd;
      border-radius: 0.426667rem;
    }

    .input_op {
      display: flex;
      align-items: center;
      margin-top: 10px;
    }

    .text_tip {
      flex: 1;
      font-size: 0.64rem;
      color: #999;
    }

    .input_btn {
      padding: 0.106667rem 0.853333rem;
      background: #aaa;
      color: #fff;
      border-radius: 0.213333rem;
    }
  }
</style>
