
/**
 * 压缩图片
 *
 * @param {Object} file 需压缩文件
 * @param {Number} quality 压缩质量 0-1
 * @param {Boolean} isPreview 是的需要预览
 */
class Compress {
  constructor() { }

  async compress (file, quality, isPreview) {
    console.log(file.size)
    // 先排断是否是图片
    if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;

    // 小于100kb 的不压缩
    if (file.size < 100 * 1024) {
      return file
    }

    // 将 图片文件 转为 dataUrl (Base64)
    const dataUrl = await this.fileToDataUrl(file)
    // console.log('dataUrl ==>', dataUrl)

    // 将 dataUrl 转为 Image对象
    const image = await this.dataUrlToImage(dataUrl)
    // console.log('image ==>', image)

    // 将 Image对象 转为 Canvas对象
    const cvs = await this.imageToCanva(image)
    // console.log('cvs ==>', cvs)

    // 压缩 直接压缩成 Bolb对象
    const blod = await this.canvasResizeToFile(cvs, quality)
    // console.log('blod', blod)
    return blod

  }

  // File ==> dataUrl
  fileToDataUrl (file) {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function () {
        resolve(this.result)
      }
    })
  }

  // dataUrl ==> Image
  dataUrlToImage (dataUrl) {
    return new Promise(resolve => {
      const image = new Image()
      image.src = dataUrl
      image.onload = function () {
        resolve(image)
      }
    })
  }

  // Image ==> Canvas
  imageToCanva (image) {
    const cvs = document.createElement('canvas')
    const ctx = cvs.getContext('2d')
    cvs.width = image.width
    cvs.height = image.height
    ctx.drawImage(image, 0, 0, cvs.width, cvs.height)
    return cvs
  }

  // Canvas ==> File
  canvasResizeToFile (canvas, quality) {
    return new Promise(resolve => {
      return canvas.toBlob(file => {
        resolve(file)
      }, 'image/jpeg', quality)
    })
  }
}

export default Compress