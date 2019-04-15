export const msgTypeList = [{
    title: '充值',
    msg_id: 2,
    msg_type: 'recharge',
    icon: require('../images/msg_recharge.png')
  },
  {
    title: '提现',
    msg_id: 4,
    msg_type: 'transfer',
    icon: require('../images/msg_transfer.png')
  }, {
    title: '商城',
    msg_id: 3,
    msg_type: 'mall',
    icon: require('../images/msg_mall.png')
  },
  {
    title: '系统',
    msg_id: 1,
    msg_type: 'system',
    icon: require('../images/msg_system.png')
  },
]

export const returnMsgType = id => {
  for (let it of msgTypeList) {
    if (id == it.msg_id) {
      return it.msg_type
    }
  }
}
