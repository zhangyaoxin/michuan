import {
  Toast
} from 'vant'

// 验证规则
const regRule = {
  tel: /^1\d{10}$/,
  pw: /^.{6,20}$/,
  code: /^\d{5}$/,
}

const validator = {
  basic (type, val) {
    // console.log(type, val)
    let reg = regRule[type]
    if (!val) {
      return -1
    } else if (!reg.test(val)) {
      return -2
    } else {
      return 200
    }
  }
}

export const validate = (data) => {
  // console.log('需要验证的参数 ==>', data)
  const keys = Object.keys(data)
  // console.log(keys)
  let result = true

  for (let i of keys) {
    let res = validator.basic(i, data[i].val)
    const isMsg = data[i].isMsg || false
    const isAgainPw = data[i].oldPw || false
    let tip = i === 'tel' ? '手机号' :
      i === 'code' ? '验证码' :
        i === 'pw' && !isAgainPw ? '密码' :
          i === 'pw' && isAgainPw ? '确认密码' :
            ''

    if (res === -1) {
      result = false
      if (isMsg) {
        Toast('请输入' + tip)
      }
      break
    } else if (res === -2) {
      result = false
      if (isMsg) {
        Toast('请输入正确的' + tip)
      }
      break
    } else if (isAgainPw && data[i].val !== data[i].oldPw) {
      result = false
      if (isMsg) {
        Toast('请输入两次密码输入不一致')
      }
      break
    }
  }

  return result
}

// 后8位小数点
//  reg: /^[0-9]\d{0,9}(\.\d{1,8})?$/,

// 发布预算
const rewardRule = {
  preBvt: [{
    request: true,
    msg: '请输入广告预算'
  },
  {
    reg: /^[0-9]\d{0,9}(\.\d{1,2})?$/,
    msg: '请输入正确的广告预算，精确到小数点后1位'
  }
  ],
  browseBvt: [{
    request: true,
    msg: '请输入浏览预算'
  },
  {
    reg: /^[0-9]\d{0,9}(\.\d{1,2})?$/,
    msg: '请输入正确的浏览奖励，精确到小数点后1位'
  }
  ],
  shareBvt: [{
    request: true,
    msg: '请输入分享预算'
  },
  {
    reg: /^[0-9]\d{0,9}(\.\d{1,2})?$/,
    msg: '请输入正确的分享奖励，精确到小数点后1位'
  }
  ],
  bvtNum: [{
    request: true,
    msg: '请输入红包个数'
  },
  {
    reg: /^[1-9]\d*$/,
    msg: '请输入正确的红包个数'
  }
  ]
}

export const validReward = (data) => {
  const keys = Object.keys(data)
  let result = true
  for (let i of keys) {
    const val = data[i]
    const rules = rewardRule[i]
    const res = rules.every(it => {
      if (it.request && !val) {
        Toast(it.msg)
        return false
      } else if (it.reg && !it.reg.test(val)) {
        Toast(it.msg)
        return false
      } else {
        return true
      }
    })
    if (!res) {
      result = false
      break
    }
  }
  return result
}


// 优惠券

export class validCoupon {
  validate (info) {
    const {
      type,
      amount,
      share_times,
      describe,
      destroy_type,
      coupon_number,
      coupon_link,
      expire_time
    } = info
    let res = true
    const ticketType = type
    const regMinusNum = /^[1-9]\d*$/
    const regGetCon = /^[0-9]\d*$/
    const regDiscount = /^[0-9](\.\d{1,2})?$/


    if (ticketType === 1) {
      if (amount === '') {
        Toast('请输入优惠金额')
        res = false
        return false
      } else if (!regMinusNum.test(amount)) {
        Toast('请输入正确优惠金额')
        res = false
        return false
      }
    }
    if (ticketType === 2) {
      if (amount === '') {
        Toast('请输入折扣值')
        res = false
        return false
      } else if (!regDiscount.test(amount)) {
        Toast('请输入正确折扣值,保留小数点后两位')
        res = false
        return false
      }
    }

    if (share_times === '') {
      Toast('请输入领券所需要传播奖励次数')
      res = false
      return false
    } else if (!regGetCon.test(share_times)) {
      Toast('请输入正确的领券传播次数')
      res = false
      return false
    }


    // if (describe === '') {
    //   Toast('请输入领券所需要传播奖励次数')
    //   res = false
    //   return false
    // }

    if (destroy_type == 1) {
      const regCode = /^(\d|\w){1,12}$/
      if (coupon_number === '') {
        Toast('请输入优惠码')
        res = false
        return false
      } else if (!regCode.test(coupon_number)) {
        Toast('请输入数字或字母，在1-12个字符之间')
        res = false
        return false
      }
    }

    if (destroy_type == 2) {
      const regLink = /^((https|http)?:\/\/)[^\s]+/
      if (coupon_link === '') {
        Toast('请输入链接')
        res = false
        return false
      } else if (!regLink.test(coupon_link)) {
        Toast('请输入正确链接地址')
        res = false
        return false
      }
    }

    if (expire_time === '') {
      Toast('请选择有效期')
      res = false
      return false
    }
    return res

  }
}
