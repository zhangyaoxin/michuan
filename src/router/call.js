import {
  getComponent
} from '@/utils/utils'

export default [{
  path: '/call',
  name: 'call',
  component: getComponent('views/call/index'),
  meta: {
    title: '蜜传',
  }
}]
