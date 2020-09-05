<template>
  <div class="page">
    <div class="wrapper">
      <a-icon type="close-circle"  @click="close" />
      <div class="title">修改密码</div>
      <input type="text" placeholder="旧密码" v-model="oldPassword" />
      <input type="text" placeholder="新密码" v-model="newPassword" />
      <input type="text" placeholder="再次确认密码" v-model="confirmPassword" />
      <input type="text" placeholder="手机号码" v-model="phone" />
      <div class="line">
        <input type="text" placeholder="手机验证码" v-model="code" />
        <button v-if="!btnStatus" @click="sendCode">发送验证码</button>
        <button v-else>还有{{btnSec}}秒</button>
      </div>
      <button class="confirmBtn" @click="updatePassword">确 定</button>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      phone: '',
      code: '',
      codeToken: '',
      btnStatus: false,
      btnSec: 60
    }
  },
  methods: {
    close(){
      this.$emit('close');
    },
    async sendCode(){
      let self = this;
      let phone = this.phone;
      if(phone){
        if(this.common.phone(phone)){
          let {data:{errcode,code}} = await this.$axios.get('/api/sendCode',{
            params: {
              phone
            }
          });
          if(errcode==0){
            this.btnStatus=true;
            this.codeToken=code;
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
    },
    async updatePassword(){
      let code = this.code;
      let codeToken = this.codeToken;
      let oldPassword = this.oldPassword;
      let newPassword = this.newPassword;
      let confirmPassword = this.confirmPassword;
      let fd = new FormData();
      fd.append('code', code);
      fd.append('codeToken', codeToken);
      fd.append('oldPassword', oldPassword);
      fd.append('newPassword', newPassword);
      fd.append('confirmPassword', confirmPassword);
      if(code&&oldPassword&&newPassword&&confirmPassword){
        if(newPassword===confirmPassword){
          let {data} = await this.$axios.post('/api/updatePassword',fd,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          console.log(data);
          if(data.errcode===0){
            this.$message.info('修改成功')
            this.close();
          }else{
            this.$message.info(data.errmsg);
          }
        }else{
          this.$message.info('两次新密码不同')
        }
      }else{
        this.$message.info('信息填写不完全')
      }
    }
  }
}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
.page{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  z-index: 100;
  .wrapper{
    margin: 14% auto;
    background-color: #fff;
    border-radius: 8px;
    padding: 30px 34px;
    display: flex;
    flex-direction: column;
    position: relative;
    width: 460px;
    i{
      font-size: 32px;
      color: #fff;
      position: absolute;
      top: -40px;
      right: 0;
    }
    .title{
      font-size:16px;
      font-weight:bold;
      color: @color;
      margin-bottom: 18px;
    }
    input{
      width:100%;
      padding: 0 17px;
      height: 46px;
      font-size: 14px;
      border:1px solid rgba(69, 75, 108, 0.15);
      border-radius:8px;
      margin-bottom: 12px;
    }
    .confirmBtn{
      width: 100%;
      font-size:20px;
      color: #fff;
      height:50px;
      background:@color;
      border-radius:8px;
      border: 0;
      margin-top: 12px;
    }
    .line{
      display: flex;
      width: 100%;
      border:1px solid rgba(69, 75, 108, 0.15);
      padding-bottom: 1px;
      border-radius: 8px;
      input{
        flex: 1;
        margin: 0;
        margin-top: 1px;
        border: 0;
      }
      button{
        color: @color;
        font-size: 12px;
        height: 46px;
        background-color: rgba(0, 0, 0, 0);
        border: 0;
      }
    }
  }
}
</style>

