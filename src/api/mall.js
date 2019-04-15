import axios from '@/utils/request'
import md5 from 'md5'
const pddId = 'af556483ab9b4a618dff8aa6e542469e'
const pddLyle = '0fcbe4f6508db779dcac46ed0947ad0db069923f'

const tbId = '25509823'
const tbLyle = '0e32c65c4d4d1ae58233b3f3ca278e7d'

const siginFn = (type, data = {}) => {
  let lyle = ''

  if (type === 'pdd') {
    data.client_id = pddId
    data.timestamp = parseInt(new Date().getTime() / 1000)
    lyle = pddLyle
  } else if (type === 'tb') {
    data.app_key = tbId
    data.timestamp = new Date().format('yyyy-MM-dd hh:mm:ss')
    lyle = tbLyle
  }

  const keys = Object.keys(data).sort()
  let str = lyle
  let params = '?'
  keys.map(it => {
    str += it + data[it]
    params += it + '=' + encodeURIComponent(data[it]) + '&'
  })
  const sign = md5(str + lyle).toUpperCase()
  return params + 'sign=' + sign
}

export default {
  // 获取拼多多商品列表
  getPddMallList: data => {
    const params = {
      type: 'pdd.ddk.goods.search',
      with_coupon: true,
      page_size: 10,
      page: 1,
      ...data
    }
    const url = siginFn('pdd', params)
    return axios.post('http://gw-api.pinduoduo.com/api/router' + url)
  },

  // 获取拼多多商品详情 只支持单个
  getPddMallDetail: data => {
    const params = {
      type: 'pdd.ddk.goods.detail',
      ...data
    }
    const url = siginFn('pdd', params)
    return axios.post('http://gw-api.pinduoduo.com/api/router' + url)
  },

  // 获取拼多多商品基本信息 支持多个
  getPddMoreMallDetail: data => {
    const params = {
      type: 'pdd.ddk.goods.basic.info.get',
      ...data
    }
    const url = siginFn('pdd', params)
    return axios.post('http://gw-api.pinduoduo.com/api/router' + url)
  },

  // 生成拼多多推广链接
  generatePddUrl: data => {
    const params = {
      type: 'pdd.ddk.goods.promotion.url.generate',
      p_id: '8203686_45314559',
      ...data
    }
    const url = siginFn('pdd', params)
    return axios.post('http://gw-api.pinduoduo.com/api/router' + url)
  },

  /* 淘宝 */
  // 获取淘宝商品列表
  getTbMallList: data => {
    const params = {
      method: 'taobao.tbk.dg.material.optional',
      sign_method: 'md5',
      format: 'json',
      v: '2.0',

      adzone_id: '80812400202',
      has_coupon: true,
      page_size: 10,
      start_price: 2,
      ...data
    }
    const url = siginFn('tb', params)
    return axios.get('http://www.zeallyle.com/mall/tb_list' + url)
  },

  // 获取淘宝商品详情
  getTbGalleryUrls: data => {
    const params = {
      method: 'taobao.tbk.item.info.get',
      sign_method: 'md5',
      format: 'json',
      v: '2.0',

      ...data
    }
    const url = siginFn('tb', params)
    return axios.get('http://www.zeallyle.com/mall/tb_list' + url)
  },

  // 获取淘宝猜你喜欢数据
  getTbMallGuessLikeList: data => {
    const params = {
      method: 'taobao.tbk.item.guess.like',
      sign_method: 'md5',
      format: 'json',
      v: '2.0',

      adzone_id: '80812400202',
      os: 'other',
      ua: navigator.userAgent.split(' ')[0],
      net: 'unknown',
      page_size: 20,
      ip: '180.102.210.62',
      ...data
    }
    const url = siginFn('tb', params)
    return axios.get('http://www.zeallyle.com/mall/tb_list' + url)
  },

  // 蜂蜜抵换优惠券
  micExchangeCoupon: data => {
    return axios.post('mall/deduction', data, {
      hasToken: true
    })
  },

  // 超值推荐
  getMallRecommendList: data => {
    const params = {
      method: 'taobao.tbk.uatm.favorites.item.get',
      sign_method: 'md5',
      format: 'json',
      v: '2.0',

      adzone_id: '100324550056',
      favorites_id: '19154449',
      fields: 'num_iid,title,pict_url,small_images,reserve_price,zk_final_price,user_type,provcity,item_url,seller_id,volume,nick,shop_title,zk_final_price_wap,event_start_time,event_end_time,tk_rate,status,type,coupon_click_url,coupon_info,coupon_start_time,coupon_end_time,click_url',
      has_coupon: true,
      page_size: 10,
      ...data
    }
    const url = siginFn('tb', params)
    return axios.get('http://www.zeallyle.com/mall/tb_list' + url)
  },

  // 获取限时抢数据
  getMallTimerList: data => {
    return axios.get('http://www.zeallyle.com/mall/fast_buy', {
      params: data
    })
  },

  // 为你推荐
  getToYouRecommendList: data => {
    return axios.get('http://www.zeallyle.com/mall/you_recommend', {
      params: data
    })
  },

  // 获取热门关键词
  getHotSearchMall: data => {
    return axios.get('http://www.zeallyle.com/mall/hot_search')
  },

  // 获取好单库数据
  getHdkMallList: data => {
    return axios.get('http://www.zeallyle.com/mall/hdk_list', {
      params: data
    })
  },

  // 获取好单库数据
  getHdkSearchList: data => {
    return axios.get('http://www.zeallyle.com/mall/hdk_search_list', {
      params: data
    })
  },

  // getHskTbMallList: data => {
  //   return axios.get('http://www.zeallyle.com/mall/hdk_tb_list', {
  //     params: data
  //   })
  // },

  // 获取热销榜数据
  getHotList: data => {
    return axios.get('http://www.zeallyle.com/mall/hot_list')
  },

  // 转换佣金接口
  conversionSponsoredLinks: data => {
    return axios.post('http://www.zeallyle.com/mall/rates_url', {
      apikey: 'michuanhdkdekey',
      tb_name: 'michuan2018',
      ...data
    })
  },

  // 生成淘口令
  createdTpwd: data => {
    const params = {
      method: 'taobao.tbk.tpwd.create',
      sign_method: 'md5',
      format: 'json',
      v: '2.0',

      ...data
    }
    const url = siginFn('tb', params)
    return axios.get('http://www.zeallyle.com/mall/tb_list' + url)
  },
}
