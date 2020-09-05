// 导入自己需要的组件
import { Button } from 'element-ui'

const mint = {
  install: function (Vue) {
    Vue.component(Button.name, Button)
  }
}
export default mint