<template>
  <div class="editor_wrap">
    <div style="color:#999;" @click="addFirstParagraph">添加正文</div>
    <!-- 编辑器 -->
    <div ref="content" class="content" block_type="-1" contenteditable @click="editHandleClick" @keyup="editHandleKeyup" @keydown="editHandleKeydown">
      <div class="box-text" block_type="1"></div>
    </div>

    <!-- 文字操作栏 -->
    <div class="ation_bar" v-show="isShowTextActive">
      <div class="menu_wrap">
        <!-- 加粗 -->
        <div class="bar_item" @click="handlerTextBasis('Bold')">
          <i class="iconfont" v-html="curBoldIcon"></i>
        </div>
        <!-- 字号 -->
        <div class="bar_item" @click="handlerTextBasis('Size')">
          <i class="iconfont" v-html="curSizeIcon"></i>
        </div>
        <!-- 对齐 -->
        <div class="bar_item" @click="handlerTextBasis('Align')">
          <i class="iconfont" v-html="curAlignIcon"></i>
        </div>
        <!-- 颜色 -->
        <div class="bar_item" @click="isSetColorMd = !isSetColorMd">
          <i class="iconfont">&#xe60c;</i>
        </div>
        <!-- 添加图片 -->
        <div class="bar_item">
          <van-uploader :after-read="addReadImg">
            <i class="iconfont">&#xe61e;</i>
          </van-uploader>
        </div>
        <!-- 添加视频 -->
        <div class="bar_item">
          <van-uploader accept="video/mp4" :after-read="addReadVideo">
            <i class="iconfont">&#xe622;</i>
          </van-uploader>
        </div>
        <!-- 添加链接 -->
        <div class="bar_item" @click="isAddLinkTextMd=true">
          <i class="iconfont">&#xe608;</i>
        </div>
      </div>

      <!-- 颜色列表 -->
      <div class="submenu_wrap" v-show="isSetColorMd">
        <div class="bar_submenu bar_color">
          <div class="color_type">
            <div class="color_title">推荐 :</div>
            <div class="color_list">
              <div class="color_item" :class="{'active':curColor=== defaultColor}" :style="{'background':defaultColor}" @click="handlerColor(defaultColor)"></div>
            </div>
          </div>
          <div class="color_type">
            <div class="color_title">颜色 :</div>
            <div class="color_list">
              <div class="color_item" :class="{'active':curColor===item}" :style="{'background':item}" v-for="(item,index) in colorList" :key="index" @click="handlerColor(item)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片操作栏 -->
    <div class="img_operate" v-show="isShowImgActive">
      <div class="img_ops_item" @click="cropImg">
        <i class="iconfont">&#xe606;</i>
        <span>裁剪</span>
      </div>
      <div class="img_ops_item" @click="addImgLink">
        <i class="iconfont">&#xe608;</i>
        <span>链接</span>
      </div>
      <div class="img_ops_item" @click="delImg">
        <i class="iconfont">&#xe605;</i>
        <span>删除</span>
      </div>
    </div>

    <!-- 视频操作栏 -->
    <div class="video_operate" v-show="isShowVideoActive">
      <div class="img_ops_item">
        <van-uploader accept="video/mp4" :after-read="replaceVideo">
          <i class="iconfont">&#xe608;</i>
          <span>替换</span>
        </van-uploader>
      </div>
      <div class="img_ops_item" @click="playVideo">
        <i class="iconfont">&#xe605;</i>
        <span>播放/暂停</span>
      </div>
      <div class="img_ops_item" @click="delImg">
        <i class="iconfont">&#xe605;</i>
        <span>删除</span>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="active_operate" v-show="isShowOtherActive">
      <div class="img_ops_item">
        <van-uploader accept="video/mp4" :after-read="replaceVideo">
          <i class="iconfont">&#xe608;</i>
          <span>替换</span>
        </van-uploader>
      </div>
      <div class="img_ops_item" @click="delImg">
        <i class="iconfont">&#xe605;</i>
        <span>删除</span>
      </div>
    </div>

    <!-- 添加文字链接 -->
    <van-popup v-model="isAddLinkTextMd" position="bottom">
      <div class="add_link_wrap">
        <van-field style="margin-bottom:10px;" v-model="curTextTitle" placeholder="请输入链接文案" clearable></van-field>
        <van-field v-model="curTextLink" placeholder="请输入链接地址" clearable></van-field>
        <div class="input_op">
          <div class="text_tip">以http://或https://开头</div>
          <div class="input_btn" @click="confirmAddTextLink(curTextTitle,curTextLink)">确定</div>
        </div>
      </div>
    </van-popup>

    <!-- 添加图片链接 -->
    <img-link :isAddLinkImg.sync="isAddLinkImgMd" :curImgLink="curImgLink" @editLink="confirmAddImgLink"></img-link>

    <!-- 裁剪 -->
    <crop-wrap :isCrop.sync="isCrop" :imgUrl="cropImgUrl" @cropDown="cropImgDown"></crop-wrap>
  </div>
</template>

<script>
  import cropWrap from '@@/crop'
  import imgLink from '@@/ad_put/add_img_link'
  import { browserVersions, formatColor } from '@/utils/utils'
  import Compress from '@/assets/js/compress'
  export default {
    name: 'editor',
    components: { imgLink, cropWrap },
    data () {
      return {
        // 输入框边框样式
        outline: '2px dashed #999',

        // 其他操作栏 （图片，视频）
        isShowOtherActive: false,

        isIos: true,

        selection: null,
        range: null,

        curRange: null,
        editRoot: null,
        curOperateDom: null,

        isShowTextActive: false,


        // 文本
        // 加粗
        curBold: 'normalBold',
        defaultBold: 'normalBold',
        listBold: [
          {
            icon: '&#xe621;',
            val: 'normalBold'
          },
          {
            icon: '&#xe61f;',
            val: 'weightBold'
          }
        ],

        // 字号
        curSize: 'fontSize18',
        defaultSize: 'fontSize18',
        listSize: [
          {
            icon: '&#xe623;',
            val: 'fontSize14'
          },
          {
            icon: '&#xe625;',
            val: 'fontSize18'
          },
          {
            icon: '&#xe624;',
            val: 'fontSize22'
          }
        ],

        // 对齐
        curAlign: 'leftAlign',
        defaultAlign: 'leftAlign',
        listAlign: [
          {
            icon: '&#xe60b;',
            val: 'leftAlign'
          },
          {
            icon: '&#xe609;',
            val: 'centerAlign'
          },
          {
            icon: '&#xe60d;',
            val: 'rightAlign'
          }
        ],

        // 颜色
        curColor: '#474746',
        defaultColor: '#474746',
        colorList: [
          '#000000', '#4f3210', '#520c00', '#033a72', '#055e3e',
          '#474747', '#9c5e23', '#a00000', '#4541af', '#02a76d',
          '#7e7e7e', '#af8549', '#fb2525', '#2a6fe8', '#17da74',
          '#c6c6c6', '#ff9201', '#ff6a59', '#509ffe', '#82b48e',
          '#ffffff', '#ffbd2b', '#ba9899', '#68d8ff', '#76ea7b',
        ],
        // 设置颜色弹窗
        isSetColorMd: false,

        // 图片
        isShowImgActive: false,
        // 添加图片链接
        isAddLinkImgMd: false,
        curImgLink: '',

        // 图片裁剪
        isCrop: false,
        cropImgUrl: false,


        // 视频
        isShowVideoActive: false,


        // 文字链接
        isAddLinkTextMd: false,
        curTextTitle: '',
        curTextLink: '',
        curADom: null,


        // 内容
        list: null
      }
    },
    computed: {
      curBoldIcon () {
        const res = this.listBold.find(it => it.val === this.curBold)
        return res.icon
      },

      // 当前字号图标
      curSizeIcon () {
        const res = this.listSize.find(it => it.val === this.curSize)
        return res.icon
      },

      // 当前对齐图标
      curAlignIcon () {
        const res = this.listAlign.find(it => it.val === this.curAlign)
        return res.icon
      },
    },
    watch: {
      isAddLinkTextMd (n) {
        if (!n) {
          this.curTextTitle = ''
          this.curTextLink = ''
          this.curADom = null
        }
      }
    },
    methods: {
      getContent () {
        const editorContent = this.editRoot
        const childNodes = editorContent.childNodes
        this.isShowTextActive = false
        this.isShowImgActive = false
        this.isShowVideoActive = false

        let list = []
        for (let it of childNodes) {
          let obj = {}
          const type = it.getAttribute('block_type')
          const havelink = it.getAttribute('have_link')

          if (type == 1) {
            let content = it.textContent
            const classList = [...it.classList]
            classList.shift()
            const className = {
              bold: this.defaultBold,
              size: this.defaultSize,
              align: this.defaultAlign,
              color: it.style.color.colorHex() || this.defaultColor,
            }
            classList.map(it => {
              if (it.includes('Bold')) {
                className.bold = it
              } else if (it.includes('Size')) {
                className.size = it
              } else if (it.includes('Align')) {
                className.align = it
              }
            })

            // 文本中有超链接
            if (havelink) {
              type = 4
              content = []
              let links = []
              // let i = 0
              for (let item of it.childNodes) {
                if (item.nodeType === 1 && item.nodeName === 'A') {
                  const str = '<*' + item.textContent + '*>'
                  const link = item.getAttribute('a-link')
                  content.push(str)
                  links.push(link)
                  // i++

                } else if (item.nodeType === 3) {
                  content.push(item.textContent)
                }
              }
              content = content.join('')
              obj.links = links
              obj.linkNum = links.length
            }

            obj.className = className
            obj.content = content
          } else if (type == 2) {
            obj.url = it.firstChild.getAttribute('src').split('/').pop()
            obj.link = it.getAttribute('img-link')
          } else if (type == 3) {
            obj.url = it.firstChild.getAttribute('src').split('/').pop()
          }
          obj.type = type
          list.push(obj)
        }
        console.log(list)
        this.list = list
        this.$store.commit('changeAd', { type: 'content', val: this.list })
      },

      setContent () {
        const con = this.$store.state.ad.content
        this.editRoot.innerHTML = ''
        let contentHTML = []
        let node
        for (let it of con) {
          if (it.type == 1) {
            node = this.createParagraphTem(it.content)
            const { align, bold, color, size } = it.className
            node.classList.add(align, bold, size)
            node.style.color = color
          } else if (it.type == 4) {
            node = this.createParagraphTem(it.content)
            const content = it.content
            const links = it.links
            const reg = /<\*(.*?)\*>/g
            let i = 0
            let html = content
            let match
            while (match = reg.exec(html)) {
              html = html.replace(match[0], `<a a-link="${links[i]}" block_type="4" contenteditablea="false">${match[1]}</a>`)
              i++
            }
            const { align, bold, color, size } = it.className
            node.classList.add(align, bold, size)
            node.style.color = color
            node.setAttribute('have_link', true)
            node.innerHTML = html
          } else if (it.type == 2) {
            node = this.createImgTem(this.$store.state.qiniuBaseUrl + it.url, it.link)
          } else if (it.type == 3) {
            node = this.createdVideoTem(this.$store.state.qiniuBaseUrl + it.url)
          }
          this.editRoot.appendChild(node)
        }
      },

      // 处理点击事件
      editHandleClick (e) {
        const blockType = e.target.getAttribute('block_type')
        this.isSetColorMd = false
        this.isShowImgActive = false
        this.isShowVideoActive = false
        if (blockType) {
          switch (Number(blockType)) {
            case -1:
              this.handleRoot(e.target)
              break;
            case 1:
              this.saveCurrentRange()
              this.handleParagraph(e.target)
              this.getHtmlStyle()
              this.handleTextActive(e.target)
              break;
            case 20:
              this.handleImgActive(e.target)
              break;
            case 21:
              this.handleImgActive(e.target)
              this.changeImgHeight(e.target)
              break;
            case 30:
              this.handleVideoActive(e.target)
              break;
            case 4:
              this.curADom = e.target
              const link = e.target.getAttribute('a-link')
              const title = e.target.textContent
              this.isAddLinkTextMd = true
              this.curTextTitle = title
              this.curTextLink = link
              break;
            default:
              break;
          }
        }
      },

      // 处理keydown 事件
      editHandleKeydown (e) {
        const curDom = this.currentParentDom()
        const blockType = Number(curDom.getAttribute('block_type'))
        if (blockType !== 1) {
          console.log('不能操作')
          e.stopPropagation()
          e.preventDefault()
        }
        if (e.keyCode === 46 || e.keyCode === 8) {
          const textLen = curDom.textContent.length
          if (!textLen) {
            curDom.textContent = ''
            const prevEle = curDom.previousElementSibling
            if (!prevEle || prevEle.getAttribute('block_type') != 1) {
              console.log('不能删除')
              e.stopPropagation()
              e.preventDefault()
            }
          }
        }
      },

      // 处理 keyup 事件
      editHandleKeyup (e) {
        const code = e.keyCode
        this.saveCurrentRange()
        this.clearOutline(this.editRoot)
        const curDom = this.currentParentDom()
        curDom.style.outline = this.outline
        switch (Number(code)) {
          case 13:
            this.selectAllParagraph()
            this.handleTextActive(curDom, 'enter')
            break;
          case 8:
          case 46:
            console.log('回退,删除')
            this.handleDeleteText(curDom)
            break;
          default:
            this.handleTextActive(curDom, 'enter')
            break;
        }
      },

      // 保存当前光标
      saveCurrentRange () {
        const selection = window.getSelection ? window.getSelection() : document.getSelection()
        if (!selection.rangeCount) return
        const content = this.$refs.content
        for (let i = 0; i < selection.rangeCount; i++) {
          const range = selection.getRangeAt(0)
          let start = range.startContainer
          let end = range.endContainer
          start = start.nodeType === Node.TEXT_NODE ? start.parentNode : start
          end = end.nodeType === Node.TEXT_NODE ? end.parentNode : end
          if (content.contains(start) && content.contains(end)) {
            this.curRange = range
            break
          }
        }
      },

      createdRange (dom) {
        const range = this.range
        const selection = this.selection
        const len = dom.textContent.length ? 1 : 0
        console.log(len)
        if (!this.curRange) {
          range.setStart(dom, len)
          range.setEnd(dom, len)
          selection.addRange(range)
          this.curRange = range
        }
      },

      // 恢复当前光标
      restoreCurrentRange () {
        const selection = window.getSelection ? window.getSelection() : document.getSelection()
        const curRange = this.curRange
        selection.removeAllRanges()
        if (curRange) {
          selection.addRange(curRange)
        }
      },

      // 移除当前光标
      removeCurrentRange () {
        const selection = window.getSelection ? window.getSelection() : document.getSelection()
        selection.removeAllRanges()
        this.clearOutline()
        this.curRange = null
      },

      // 清除外边框
      clearOutline (dom = this.editRoot) {
        if (dom.childNodes) {
          for (let it of dom.childNodes) {
            if (it.nodeType === 1) {
              this.clearOutline(it)
              it.style.outline = ''
            }
          }
        }
      },

      // 清空所有空段落中的<br>
      selectAllParagraph () {
        const arr = document.querySelectorAll('.box-text')
        for (let it of arr) {
          if (it.textContent === '') { it.textContent = '' }
        }
      },

      // 返回当前光标的dom元素
      currentParentDom () {
        const curRange = this.curRange
        let dom = curRange.commonAncestorContainer
        const nodeType = curRange.commonAncestorContainer.nodeType
        if (nodeType === 3) dom = curRange.commonAncestorContainer.parentElement
        return dom
      },

      // 创建段落模版
      createParagraphTem (con = '') {
        const divWrap = document.createElement('div')
        divWrap.className = 'box-text'
        divWrap.setAttribute('block_type', 1)
        divWrap.textContent = con
        return divWrap
      },

      // 创建图片模版
      createImgTem (url, link = '') {
        const div = document.createElement('div')
        div.className = 'box-img'
        div.setAttribute('block_type', 2)
        div.setAttribute('contenteditable', false)
        div.setAttribute('img-link', link)

        const img = document.createElement('img')
        img.src = url
        img.setAttribute('block_type', 20)

        const i = document.createElement('i')
        i.className = 'iconfont fotter_active'
        i.innerHTML = '&#xe603;'
        i.setAttribute('block_type', 21)

        div.appendChild(img)
        div.appendChild(i)
        return div
      },

      // 创建视频模板
      createdVideoTem (url) {
        const div = document.createElement('div')
        div.className = 'box-video'
        div.setAttribute('block_type', 3)
        div.setAttribute('contenteditable', false)

        const video = document.createElement('video')
        video.src = url
        video.setAttribute('controls', true)

        const mask = document.createElement('div')
        mask.className = 'video_mask'
        mask.setAttribute('block_type', 30)

        div.appendChild(video)
        div.appendChild(mask)
        return div
      },

      // 创建链接模板
      createdATem (title, link, isTarget = false) {
        const aWrap = document.createElement('a')
        aWrap.textContent = title
        if (isTarget) {
          aWrap.setAttribute('href', link)
        } else {
          aWrap.setAttribute('a-link', link)
        }
        aWrap.setAttribute('block_type', 4)
        aWrap.setAttribute('contenteditable', false)
        return aWrap
      },

      // 点击空白处
      handleRoot (dom) {
        const range = this.range
        const selection = this.selection
        const lastChild = dom.lastChild
        this.clearOutline(dom)

        if (lastChild && lastChild.getAttribute('block_type') == 1 && !lastChild.textContent) {
          lastChild.style.outline = this.outline
          this.saveCurrentRange()
          this.getHtmlStyle()
          this.handleTextActive(lastChild)
          return false
        }

        const divWrap = this.createParagraphTem()
        divWrap.style.outline = this.outline
        dom.appendChild(divWrap)
        selection.removeAllRanges()
        range.setStart(divWrap, 0)
        range.setEnd(divWrap, 0)
        selection.addRange(range)
        this.curRange = range
        this.getHtmlStyle()
        this.handleTextActive(divWrap)
      },

      handleParagraph (dom) {
        this.clearOutline()
        dom.style.outline = this.outline
      },

      /* 段落 */

      addFirstParagraph () {
        const range = this.range
        const selection = this.selection
        const divWrap = this.createParagraphTem()
        const frist = this.editRoot.firstChild
        this.clearOutline(this.editRoot)

        divWrap.style.outline = this.outline

        if (frist) {
          this.editRoot.insertBefore(divWrap, frist)
        } else {
          this.editRoot.appendChild(divWrap)
        }
        selection.removeAllRanges()
        range.setStart(divWrap, 0)
        range.setEnd(divWrap, 0)
        selection.addRange(range)
        this.curRange = range
        this.getHtmlStyle()
        this.handleTextActive(divWrap)
      },

      // 获取已经设置的文本样式
      getHtmlStyle () {
        const parEle = this.currentParentDom()
        const classList = [...parEle.classList]
        const arr = ['Bold', 'Size', 'Align']
        arr.map(it => {
          let name
          const res = classList.some(item => (name = item, item.includes(it)))
          res ? this['cur' + it] = name : this['cur' + it] = this['default' + it]
        })
        this.curColor = parEle.style.color.colorHex() || this.defaultColor
      },

      handleTextActive (dom, type) {
        const top = dom.offsetTop
        const posi = dom.getBoundingClientRect()
        const ationBar = document.querySelector('.ation_bar')
        ationBar.style.top = top + posi.height + 15 + 'px'
        const clientHeight = document.body.clientHeight / 2
        if (browserVersions().iPhone) {
          document.querySelector('html').scrollTop = top + posi.height + 250 - clientHeight
          document.body.scrollTop = top + posi.height + 250 - clientHeight
        } else {
          document.querySelector('html').scrollTop = top + posi.height + 150 - clientHeight
          document.body.scrollTop = top + posi.height + 150 - clientHeight
        }

        if (type === 'enter') {
          this.isShowTextActive = true
          this.curOperateDom = dom
          return false
        }
        console.log(this.curOperateDom, dom)

        if (dom !== this.curOperateDom) {
          this.isShowTextActive = true
          this.curOperateDom = dom
        } else {
          this.isShowTextActive = false
          this.curOperateDom = null
        }
      },

      // 加粗 字号 对齐 
      handlerTextBasis (type) {
        this.isSetColorMd = false
        this.restoreCurrentRange()
        const parEle = this.currentParentDom()
        let classList = [...parEle.classList]
        classList = classList.map(it => {
          if (it.includes(type)) parEle.classList.remove(it)
        })
        const listType = 'list' + type
        const curType = 'cur' + type
        const list = this[listType]
        let index = list.findIndex(it => it.val === this[curType])
        let val
        index++
        index > list.length - 1 ? val = list[0].val : val = list[index].val
        parEle.classList.add(val)
        this[curType] = val
        // this.handleTextActive(parEle)
      },

      // 颜色
      handlerColor (color) {
        const parEle = this.currentParentDom()
        parEle.style.color = color
        this.curColor = color
        this.isSetColorMd = false
        this.restoreCurrentRange()
      },

      // 删除文本
      handleDeleteText (dom) {
        const textLen = dom.textContent.length
        console.log(textLen)
        if (!textLen) dom.textContent = ''
      },

      /* 图片 */

      // 插入图片或视频
      async insertTem (typeFn, file) {
        this.isSetColorMd = false
        this.isShowTextActive = false
        const editRoot = this.editRoot
        const curDom = this.currentParentDom()
        const curClass = curDom.className
        const curStyleColor = curDom.style.color
        const startOffset = this.curRange.startOffset
        console.log(curDom, curClass, curStyleColor, 'lllllllllllll')
        const text = this.curRange.startContainer.textContent
        const url = await this.$store.dispatch('upLoadQIniu', file)
        const temWrap = await this[typeFn](this.$store.state.qiniuBaseUrl + url)

        if (startOffset === 0) {
          editRoot.insertBefore(temWrap, curDom)
        } else {
          const fristText = text.slice(0, startOffset)
          const lastText = text.slice(startOffset, text.length)
          const fristWrap = this.createParagraphTem(fristText)
          fristWrap.className = curClass
          fristWrap.style.color = curStyleColor
          editRoot.insertBefore(fristWrap, curDom)
          editRoot.insertBefore(temWrap, curDom)

          if (lastText) {
            const lastWrap = this.createParagraphTem(lastText)
            lastWrap.className = curClass
            lastWrap.style.color = curStyleColor
            editRoot.insertBefore(lastWrap, curDom)
          }
          editRoot.removeChild(curDom)
        }
        this.removeCurrentRange()
      },

      // 添加图片
      async addReadImg (file) {
        console.log('压缩前 ==>', file)
        const comFile = await new Compress().compress(file.file, 0.4, false)
        console.log('压缩后 ==>', comFile)
        this.insertTem('createImgTem', comFile)
      },
      // 显示隐藏图片顶部操作栏
      handleImgActive (dom) {
        this.removeCurrentRange()
        const parentEle = dom.parentElement
        this.isShowTextActive = false
        if (parentEle === this.curOperateDom) {
          this.isShowImgActive = false
          this.curOperateDom = null
        } else {
          this.isShowImgActive = true
          const posi = dom.getBoundingClientRect()
          const top = parentEle.offsetTop
          const imgOperate = document.querySelector('.img_operate')
          imgOperate.style.top = top + 'px'
          imgOperate.style.width = posi.width + 'px'
          this.curOperateDom = parentEle
        }
      },

      // 切换限制图片高度
      changeImgHeight (dom) {
        const parentEle = dom.parentElement
        parentEle.classList.toggle('max_height')
        this.isShowImgActive = true
        this.curOperateDom = parentEle
      },

      // 删除图片
      delImg () {
        const dom = this.curOperateDom
        const editRoot = this.editRoot
        this.$dialog.confirm({
          title: '温馨提示',
          message: '确认要删除此图片吗'
        }).then(() => {
          this.isAddLinkImgMd = false
          editRoot.removeChild(dom)
          this.isShowImgActive = false
          this.isShowVideoActive = false
          this.curOperateDom = null
        })
      },

      // 添加图片链接
      addImgLink () {
        const dom = this.curOperateDom
        const imgLink = dom.getAttribute('img-link')
        this.curImgLink = imgLink || ''
        this.isAddLinkImgMd = true
      },
      // 添加完成
      confirmAddImgLink (link) {
        const dom = this.curOperateDom
        dom.setAttribute('img-link', link)
        this.isAddLinkImgMd = false
      },

      // 裁剪图片
      cropImg () {
        const img = this.curOperateDom.firstChild.src
        // 调用裁剪组件
        this.cropImgUrl = img
        this.isCrop = true
      },
      // 裁剪完成
      cropImgDown (url) {
        this.curOperateDom.firstChild.src = url
      },

      /* 视频 */

      // 添加视频
      async addReadVideo (file) {
        this.insertTem('createdVideoTem', file.file)
      },

      // 视频操作
      handleVideoActive (dom) {
        this.removeCurrentRange()
        const parentEle = dom.parentElement

        this.isShowTextActive = false
        if (parentEle === this.curOperateDom) {
          this.isShowVideoActive = false
          this.curOperateDom = null
        } else {
          this.isShowVideoActive = true
          const posi = dom.getBoundingClientRect()
          const top = parentEle.offsetTop
          const imgOperate = document.querySelector('.video_operate')
          imgOperate.style.top = top + 'px'
          imgOperate.style.width = posi.width + 'px'
          this.curOperateDom = parentEle
        }
      },

      // 播放或暂停视频
      playVideo () {
        const parentEle = this.curOperateDom
        const video = parentEle.firstChild
        video.paused ? video.play() : video.pause()
      },


      // 替换视频
      replaceVideo (file) {
        this.curOperateDom.firstChild.src = file.content
      },

      /* 链接 */

      // 添加链接
      confirmAddTextLink (title, link) {
        const regLink = /^((https|http)?:\/\/)[^\s]+/
        if (title === '') {
          this.$toast('请输入正确的链接文案')
          return false
        }
        if (!regLink.test(link)) {
          this.$toast('请输入正确的链接地址')
          return false
        }
        const curADom = this.curADom
        if (curADom) {
          curADom.textContent = title
          curADom.setAttribute('a-link', link)
        } else {
          const curDom = this.currentParentDom()
          curDom.setAttribute('have_link', true)
          const a = this.createdATem(title, link)
          this.curRange.insertNode(a)
        }
        this.curADom = null
        this.isAddLinkTextMd = false
      }
    },
    created () {
      formatColor()
    },
    mounted () {
      this.editRoot = this.$refs.content
      this.selection = window.getSelection ? window.getSelection() : document.getSelection()
      this.range = document.createRange()

      // 格式化粘贴内容
      document.querySelector("div.content").addEventListener("paste", function (e) {
        e.preventDefault();
        var text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
      });

      this.setContent()
    },
    beforeDestroy () {
      // this.getContent()
    }
  }
</script>

<style  lang="scss">
  @import "../../../assets/css/editor.scss";
</style>
