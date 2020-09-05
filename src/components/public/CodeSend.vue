<template>
  <div class="line">
    <input type="text" placeholder="验证码" v-model="value" @input="changeVal">
    <button v-if="!btnStatus" @click="sendCode">发送验证码</button>
    <button class="sendBtn" v-else>还有{{btnSec}}秒</button>
  </div>
</template>

<script>
export default {
  props: {
    phone: {
      value: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  data(){
    return {
      btnStatus: false,
      btnSec: 60
    }
  },
  methods: {
    changeVal(){
      this.$emit('input', this.value);
    },
    async sendCode(){
      let self = this;
      let phone = this.phone;
      if(phone){
        if(this.common.phone(phone)){
          let {data:{errcode,codeToken}} = await this.$axios.get('/api/sendCode',{
            params: {
              phone
            }
          });
          if(errcode==0){
            this.btnStatus=true;
            this.$emit('add', codeToken);
            let timer = setInterval(function(){
              self.btnSec--;
              if(self.btnSec<=0){
                self.btnStatus=false;
                self.btnSec=60;
                clearInterval(timer);
              }
            }, 1000)
          }else{
            this.$message.info('验证码发送错误');
          }
        }
      }else{
        this.$message.info('您还没有填写手机号码');
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
.line {
  display: flex;
  margin-bottom: 10px;
  input {
    margin-right: 10px;
    border: 1px solid rgba(69, 75, 108, 0.15);
    border-radius: 8px;
    outline: 0;
    font-size: 14px;
    padding: 16px;
    height: 48px;
    flex: 1;
  }
  button {
    background: @color;
    color: #fff;
    font-size: 13px;
    border-radius: 8px;
    border: 0;
    width: 230px;
    margin: 0;
    height: 48px;
  }
  .sendBtn{
    width: 230px;
    background-color: #cacaca;
  }
}
</style>
