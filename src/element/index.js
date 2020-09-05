// 导入自己需要的组件
import { Pagination, Loading, Message, Notification, Form, Radio, Input, FormItem, Switch, MessageBox, Button, Upload, Select, Option, Dialog, Checkbox, CheckboxGroup, Cascader, Carousel, CarouselItem } from 'element-ui'

const element = {
  install: function (Vue) {
    Vue.use(Pagination)
    Vue.use(Loading)
    Vue.use(Radio)
    Vue.use(Input)
    Vue.use(FormItem)
    Vue.component(Form.name, Form)
    Vue.use(Switch)
    Vue.use(Button)
    Vue.use(Upload)
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(Dialog)
    Vue.use(Checkbox)
    Vue.use(CheckboxGroup)
    Vue.use(Cascader )
    Vue.use(Carousel)
    Vue.use(CarouselItem)
    Vue.prototype.$message = Message
    Vue.prototype.$notify = Notification
    Vue.prototype.$confirm = MessageBox.confirm
  }
}
export default element