<template>
  <bm-overlay
    ref="customOverlay"
    :class="{sample: true}"
    :style="pointColor"
    pane="labelPane"
    @draw="draw">
  </bm-overlay>
</template>

<script>
import { BmOverlay } from 'vue-baidu-map'
export default {
  props: ['text', 'position', 'background'], // 用来接受传入的值，用来定制样式
  components: {
    BmOverlay
  },
  watch: {
    position: {
      handler () {
        this.$refs.customOverlay.reload()  // 当位置发生变化时，重新渲染，内部会调用draw
      },
      deep: true
    }
  },
  data () {
    return {
      pointColor: ''
    }
  },
  mounted () {
    this.pointColor = this.color // 这里我是用来获取传入的值来定义样式的，可能有点多余了，pointColor是组件中绑定的样式，color是传进来的样式。【这样就可以根据传入的样式来显示不同样子的点了】
  },
  methods: {
    // 这是百度地图的重绘函数,用于维持覆盖物的位置（这里的值貌似会影响拖拉时的偏移度）
    draw ({ el, BMap, map }) {
      const { lng, lat } = this.position
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
      el.style.left = pixel.x - 16 + 'px'
      el.style.top = pixel.y - 16 + 'px'
    }
  }
}
</script>

<style>
.sample {
  width: 32px;
  height: 32px;
  line-height: 32px;
  border-radius: 32px;
  background: rgba(0,0,0,0.5);
  overflow: hidden;
  box-shadow: 0 0 5px #000;
  color: #fff;
  text-align: center;
  position: absolute;
}
.sample.active {
  background: rgba(0,0,0,0.75);
  color: #fff;
}
</style>