// 路由懒加载
export const getComponent = (com) => () =>
  import(`@/${com}`)


// 本地存储 默认是sessionStorage
export const setStore = (name, content, type = 'sessionStorage') => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window[type].setItem(name, content)
}

// 获取本地存储 
export const getStore = (name, type = 'sessionStorage') => {
  if (!name) return
  let content = window[type].getItem(name)
  return content || ''
}

// 删除本地存储 
export const removeStore = (name, type = 'sessionStorage') => {
  if (!name) return
  window[type].removeItem(name)
}

// 判断浏览器类型
export const browserVersions = () => {
  var u = navigator.userAgent,
    app = navigator.appVersion;

  return {
    // 是否为IE内核
    trident: u.indexOf('Trident') > -1,

    // 是否为opera内核
    presto: u.indexOf('Presto') > -1,

    // 是否为苹果、谷歌内核
    webKit: u.indexOf('AppleWebKit') > -1,

    // 是否为火狐内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,

    //是否为为移动终端
    mobile: !!u.match(/AppleWebKit.*Mobile.*/),

    // 是否为ios终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),

    // 是否为android终端或uc浏览器
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,

    // 是否为iPhone或者QQHD浏览器 
    iPhone: u.indexOf('iPhone') > -1,

    // 是否为iPad
    iPad: u.indexOf('iPad') > -1,

    // 是否为web应该程序，没有头部与底部
    webApp: u.indexOf('Safari') == -1
  }
}

// 排断是否是微信浏览器
export const isWechatrBrowse = () => {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true
  } else {
    return false
  }
}

// rem
export const setHtmlFontSize = () => {
  const html = document.documentElement;

  function onWindowResize() {
    html.style.fontSize = html.getBoundingClientRect().width / 20 + 'px';
  }
  window.addEventListener('resize', onWindowResize);
  onWindowResize();
}

// 设置广告标题
export const setPagesTitle = (title = '蜜传') => {
  document.title = title
}

// 格式化时间
export const formatDate = () => {
  Date.prototype.format = function (fmt) {
    var o = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'h+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds(),
      'q+': Math.floor((this.getMonth() + 3) / 3),
      'S': this.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  }
}

export const formatColor = () => {
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  /*RGB颜色转换为16进制*/
  String.prototype.colorHex = function () {
    var that = this;
    if (/^(rgb|RGB)/.test(that)) {
      var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
      var strHex = "#";
      for (var i = 0; i < aColor.length; i++) {
        var hex = Number(aColor[i]).toString(16);
        if (hex.length === 1) {
          hex = '0' + hex;
        }
        strHex += hex;
      }
      if (strHex.length !== 7) {
        strHex = that;
      }
      return strHex;
    } else if (reg.test(that)) {
      var aNum = that.replace(/#/, "").split("");
      if (aNum.length === 6) {
        return that;
      } else if (aNum.length === 3) {
        var numHex = "#";
        for (var i = 0; i < aNum.length; i += 1) {
          numHex += (aNum[i] + aNum[i]);
        }
        return numHex;
      }
    } else {
      return that;
    }
  };

  /*16进制颜色转为RGB格式*/
  String.prototype.colorRgb = function () {
    var sColor = this.toLowerCase();
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        var sColorNew = "#";
        for (var i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      //处理六位的颜色值
      var sColorChange = [];
      for (var i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
      }
      return "RGB(" + sColorChange.join(",") + ")";
    } else {
      return sColor;
    }
  };
}

// 参数统一格式
export const mallUnifiedFormat = (arr = [], type, curType) => {
  const data = []
  if (type === 'tb') {
    for (let it of arr) {
      if (it.small_images) {
        const {
          num_iid: id,
          title: name,

          pict_url: thumbnail,
          small_images: {
            string: gallery_urls
          },

          zk_final_price: price,

          coupon_info: price_coupons,
          coupon_share_url: coupon_link,
          coupon_start_time,
          coupon_end_time,

          volume: sales,

          item_url: detail_url
        } = it

        if (price_coupons && price_coupons.includes('减')) {
          const params = price_coupons.split('减')[1].slice(0, -1)
          data.push({
            curType: 1,
            id,
            name,
            thumbnail,
            price,
            sales,
            price_coupons: params,
            coupon_link,
            coupon_start_time,
            coupon_end_time,
            detail_url,
            gallery_urls,
            info: it,
          })
        }
      }

    }
  } else if (type === 'pdd') {
    for (let it of arr) {
      const {
        goods_id: id,
        goods_name: name,
        goods_thumbnail_url: thumbnail,
        min_group_price: price,
        coupon_discount: price_coupons,
        sold_quantity: sales,
        goods_gallery_urls: gallery_urls,
        coupon_start_time,
        coupon_end_time
      } = it

      data.push({
        curType: 2,
        id,
        name,
        thumbnail,
        price: price / 100,
        price_coupons: price_coupons / 100,
        coupon_start_time: new Date(coupon_start_time * 1000).format('yyyy-MM-dd'),
        coupon_end_time: new Date(coupon_end_time * 1000).format('yyyy-MM-dd'),
        coupon_link: '',
        gallery_urls,
        sales,
        detail_url: 'https://mobile.yangkeduo.com/goods2.html?goods_id=' + id,
        info: it,
      })
    }
  } else if (type === 'dtk') {
    for (let it of arr) {
      const {
        GoodsID: id,
        Title: name,
        Pic: thumbnail,
        Org_Price: price,
        Sales_num: sales,
        Quan_price: price_coupons,
        Quan_link: coupon_link,
        gallery_urls,
        coupon_start_time,
        Quan_time: coupon_end_time,
      } = it

      data.push({
        curType: curType,
        id,
        name,
        thumbnail,
        price,
        sales,
        price_coupons,
        coupon_link,
        coupon_start_time: new Date(new Date().toLocaleDateString()).format('yyyy-MM-dd'),
        coupon_end_time: coupon_end_time.split(' ')[0],
        gallery_urls: [],
        detail_url: 'https://item.taobao.com/item.htm?id=' + id,
        info: it,
      })
    }
  } else if (type === 'hdk') {
    for (let it of arr) {
      const {
        itemid: id,
        itemtitle: name,
        itempic: thumbnail,
        itemprice: price,
        itemsale: sales,
        itemsale2: sales2,
        couponmoney: price_coupons,
        couponurl: coupon_link,

        couponstarttime: coupon_start_time,
        couponendtime: coupon_end_time,

        taobao_image: gallery_urls
      } = it
      data.push({
        curType: curType,
        id,
        name,
        thumbnail,
        price,
        sales,
        sales2,
        price_coupons,
        coupon_start_time: coupon_start_time ? new Date(coupon_start_time * 1000).format('yyyy-MM-dd') : new Date(new Date().toLocaleDateString()).format('yyyy-MM-dd'),
        coupon_end_time: coupon_end_time ? new Date(coupon_end_time * 1000).format('yyyy-MM-dd') : new Date(new Date().toLocaleDateString()).format('yyyy-MM-dd'),

        coupon_link,
        detail_url: 'https://item.taobao.com/item.htm?id=' + id,

        gallery_urls: gallery_urls && gallery_urls.split(','),
        info: it,
      })
    }
  }

  return data
}
