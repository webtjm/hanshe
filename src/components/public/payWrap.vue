<template>
  <div class="page"  @click="toOrder">
    <div class="code-wrap">
      <a-icon class="close-icon" type="close" @click="toOrder" />
      <div class="title">请打开微信扫码支付</div>
      <div class="pay-num">支付金额：<span>{{price}}</span>元</div>
      <div style="width: 200px;height: 200px;" id="qrcode"></div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  props: {
    price: {
      type: Number,
      default: 0
    },
    url: {
      type: String,
      default: ''
    }
  },
  methods: { 
    getCode(){
      console.log(this.url)
      this.$nextTick(() => {
        let url = this.url
        let qrcode = new QRCode('qrcode', {
          width: 200,
          height: 200,
          text: url
        })
      })
      
    },
    toOrder(){
      this.$emit('order')
    }
  }
}
</script>

<style>
.page{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
}
.code-wrap{
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%);
  /* height: 370px; */
  padding: 20px;
  width: 400px;
  text-align: center;
  border-radius: 4px;
  background-color: #fff;
}
.close-icon{
  position: absolute;
  right: 20px;
  top: 20px;
}
.title{
  font-size: 24px;
}
.pay-num span{
  color: #d81e06;
}
#qrcode{
  margin: 20px auto;
}
#qrcode img{
  position: absolute;
  left: 50%;
  transform: translate(-50%);
}
</style>
