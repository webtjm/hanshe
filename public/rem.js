// 基准大小
const baseSize = 32
// 设置 rem 函数
function setRem() {
  // 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
  let clientWidth = document.documentElement.clientWidth
  console.log(clientWidth)
  if(clientWidth > 1366) {
    scale = clientWidth / 850
  } else{
    scale = clientWidth / 750
  }
  // console.log('scale',scale)
  // 设置页面根节点字体大小
  document.documentElement.style.fontSize = baseSize * scale + 'px'
  console.log(baseSize * scale)
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function() {
  setRem()
}