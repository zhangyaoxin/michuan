<template>
  <div id="app" :class="{'mar_b_55':isNav}">
    <!-- <div @click="dispatchMsg" style="border:1px solid #000;position:fixed;top:100px;right:20px;width:50px;height:50px;background:#fff;z-index:99999;">来消息</div> -->
    <router-view />
    <nav-bar v-if="isNav"></nav-bar>
    <audio id="msgAudio" style="display:none">
      <source :src="wav" type="audio/wav">
      <source :src="mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<script>
  import axios from 'axios'
  import navBar from '@@/nav_bar'
  import mp3 from '@@@/8855.mp3'
  import wav from '@@@/8855.wav'

  import { browserVersions, setHtmlFontSize, getStore, setStore, formatDate } from '@/utils/utils'

  export default {
    name: 'App',
    components: { navBar },
    data () {
      return {
        mp3: mp3,
        wav: wav
      }
    },
    computed: {
      isNav () {
        // 需要添加底部导航的路由
        const route = ['home','newMap','hall', 'mall_index', 'me']
        const curRoute = this.$route.name
        return route.includes(curRoute)
      }
    },
    methods: {
      dispatchMsg () {
        console.log('触发消息')
        const msg = {
          user_id: 3,
          msg_type: 3,
          title: '新消息',
          content: '来了一条新消息'
        }
        const params = {
          user_id: 3,
          msg: JSON.stringify(msg)
        }

        this.$api.dispatchMsg(params)
          .then(data => {
            console.log(data)
          })
      }
    },
    created () {
      // 添加格式化时间
      formatDate()

      // 获取汇率
      this.$store.dispatch('getExchangeRate')

      // 定时器
      const nowDate = new Date().getTime()
      const verifyTime = Number(getStore('verifyTime'))

      if (nowDate - verifyTime > 60000) {
        this.$store.commit('changeValue', { type: 'showReminderTime', value: false })
      } else {
        const time = parseInt((60000 - (nowDate - verifyTime)) / 1000)
        this.$store.commit('changeValue', { type: 'reminderTime', value: time })
        this.$store.commit('setTimer')
      }
    },
    mounted () {
      const res = browserVersions()
      if (!res.mobile) {
        document.querySelector('html').classList.add('max_width')
        document.querySelector('body').style.height = '100%'
        document.querySelector('#app').style.height = '100%'
        document.querySelector('#app').style.overflowY = 'scroll'
      }
      setHtmlFontSize()
    }
  }
</script>

<style>
  .max_width {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translateZ(0);
    /* margin: 0 auto; */
    width: 375px;
    height:667px;
    border: 1px dashed #666;
  }
  .mar_b_55 {
    height: calc(100% - 50px) !important;
  }
</style>
