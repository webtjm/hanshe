<template>
  <div class="page" @click.self="close">
    <div class="wrapper">
      <a-icon type="close-circle"  @click="close" />
      <div class="loginWrapper">
        <div class="img">
          <img alt="寒舍" src="@/assets/img/logo.png">
        </div>
        <!-- 登录 -->
        <div v-show="type===0">
          <div class="loginWay">
            <span @click="changeWay" :class="loginWay===0?'selected':''">账号登录</span>
            <span @click="changeWay" :class="loginWay===1?'selected':''">短信登录</span>
          </div>
          <div class="container">
            <!-- 账号登录 -->
            <div v-show="loginWay===0">
              <input type="text" placeholder="手机号码" v-model="pwPhone">
              <input type="password" placeholder="登录密码" v-model="pwPassword">
              <div style="margin-bottom: 6px;">
                <a-checkbox @change="unLogin"  :checked="un_login===1">7天免登录</a-checkbox>
                <a-checkbox @change="rememberPass" :checked="remember">记住密码</a-checkbox>
              </div>
              <div class="tips">
                <span @click="changeType(2)">
                  没有账号？
                  <span>注册</span>
                </span>
                <span @click="changeType(1)">忘记密码？</span>
              </div>
              <button @click="pwLogin">登录</button>
            </div>
            <!-- 短信登录 -->
            <div v-show="loginWay===1">
              <input type="text" placeholder="手机号码" v-model="smsPhone">
              <CodeSend :phone="smsPhone" :value="smsCode" @input="(val)=>{this.smsCode=val}" @add="(val)=>{this.smsCodeToken=val}" />
              <div style="margin-bottom: 6px;">
                <a-checkbox @change="unLogin" :checked="un_login===1">7天免登录</a-checkbox>
              </div>
              <div class="tips">
                <span @click="changeType(2)">
                  没有账号？
                  <span>注册</span>
                </span>
                <span @click="changeType(1)">忘记密码？</span>
              </div>
              <button @click="smsLogin">登录</button>
            </div>
          </div>
        </div>
        <!-- 找回密码 -->
        <div v-show="type===1">
          <div class="loginWay">
            <span>找回密码</span>
          </div>
          <div class="container">
            <div>
              <input type="text" placeholder="手机号码" v-model="findPhone">
              <CodeSend :phone="findPhone" :value="findCode" @input="(val)=>{this.findCode=val}" @add="(val)=>{this.findCodeToken=val}" />
              <input type="text" placeholder="输入密码" v-model="findPass">
              <input type="text" placeholder="再次输入密码" v-model="findConfirmPass">
              <div class="tips">
                <span @click="changeType(2)">
                  没有账号？
                  <span>注册</span>
                </span>
                <span @click="changeType(0)">去登录</span>
              </div>
              <button @click="toFindPasssword">下一步</button>
            </div>
          </div>
        </div>
        <!-- 注册 -->
        <div v-show="type===2">
          <div class="loginWay">
            <span>注册</span>
          </div>
          <div class="container">
            <div>
              <input type="text" placeholder="姓名" v-model="regName">
              <input type="text" placeholder="手机号码" v-model="regPhone">
              <CodeSend :phone="regPhone" @input="(val)=>{this.regCode=val}" @add="(val)=>{this.regCodeToken=val}" />
              <input type="text" placeholder="设置密码" v-model="regPass">
              <input type="text" placeholder="再次输入密码" v-model="regConfirmPass">
              <a-checkbox @change="toWriteCard">填写完整信息</a-checkbox>
              <a-select
                v-show="ifCard"
                size="large"
                :defaultValue="idType"
                v-model="idType"
                style="width: 100%;margin: 4px 0 10px;"
                @change="selectIdType">
                <a-icon slot="suffixIcon" type="caret-down" />
                <a-select-option value="ID_CARD">身份证</a-select-option>
                <a-select-option value="DRIVER_LICENSE">驾驶证</a-select-option>
                <a-select-option value="TAIWAN_PASS">台湾居民来往大陆通行证</a-select-option>
                <a-select-option value="HK_AND_MACAU_PASS">港澳居民来往大陆通行证</a-select-option>
                <a-select-option value="FOREIGN_PASSPORT">外籍护照</a-select-option>
              </a-select>
              <input v-show="ifCard" type="text" placeholder="证件号码" v-model="regCard">
              <div class="tips">
                <span @click="changeType(0)">
                  已有账号？
                  <span>登录</span>
                </span>
                <span @click="changeType(1)">忘记密码？</span>
              </div>
              <button @click="toReg">下一步</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CodeSend from '@/components/public/CodeSend'
import CryptoJs from 'crypto-js'
// 加密
function encrypt (word) {
  let encrypted = CryptoJs.AES.encrypt(word, 'chenrm')
  return encrypted.toString()
}
// 解密方法
function decrypt(word) {
  let text = CryptoJs.AES.decrypt(word, 'chenrm')
  let plaintext = text.toString(CryptoJs.enc.Utf8)
  return plaintext
}
import {mapMutations, mapState} from 'vuex'
export default {
  data() {
    return {
      type: 0,
      loginWay: 0,
      // 密码登录
      pwPhone: '',
      pwPassword: '',
      // 短信登录
      smsPhone: '',
      smsCode: '',
      smsCodeToken: '',
      // 七天免登录
      un_login: 0,
      remember: false,
      // 注册
      ifCard: false,
      idType: 'ID_CARD',
      regName: '',
      regPhone: '',
      regCode: '',
      regCodeToken: '',
      regPass: '',
      regConfirmPass: '',
      regCard: '',
      // 找回密码
      findPhone: '',
      findCode: '',
      findCodeToken: '',
      findPass: '',
      findConfirmPass: ''
    };
  },
  mounted(){
    let hanshe = localStorage.getItem('hanshe')
    if(hanshe) {
      hanshe = hanshe.split(',')
      this.pwPhone = hanshe[0]
      this.pwPassword = decrypt(hanshe[1])
      
    }

    var that=this;
			document.οnkeydοwn=function(e){
				var key=window.event.keyCode;
				if(key==13){
					that.pwLogin();
				}
			}

  },
  methods: {
    ...mapMutations('main', [
      'setShowLogin',
      'setLoginState',
      'setUserInfor'
    ]),
    changeWay() {
      let way = this.loginWay;
      this.un_login = 0
      if (way === 0) {
        this.loginWay = 1;
      } else {
        this.loginWay = 0;
      }
    },
    changeType(type){
      this.type = type;
    },
    close(){
      this.setShowLogin(false)
    },
    selectIdType(val){
      this.idType = val
    },
    toWriteCard(){
      if(this.ifCard){
        this.ifCard = false
        this.idType = 'ID_CARD'
        this.regCard = ''
      }else{
        this.ifCard = true
      }
    },
    // 短信登录
    async smsLogin(){
      let phone = this.smsPhone;
      let code = this.smsCode;
      let cor_code = this.smsCodeToken;
      let un_login = this.un_login
      if(phone&&code){
        let fd = new FormData();
        fd.append('phone', phone);
        fd.append('code', code);
        fd.append('cor_code', cor_code);
        fd.append('un_login', un_login)
        let {data} = await this.$axios.post('/api/loginBySMS',fd,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        if(data.errcode===0){
          // 成功就去隐藏换header，提示登录成功
          this.setShowLogin(false)
          this.setLoginState(true)
          localStorage.setItem('hsToken', data.user_info)
          // 去获取用户信息
          this.getUserInfor();
        }else{
          this.$message.info(data.errmsg);
        }
      }else{
        // 信息未填写完全
        this.$message.info('信息未填写完全')
      }
    },
    // 账号登录
    async pwLogin(){
      console.log('sss')
      let phone = this.pwPhone;
      let password = this.pwPassword;
      let un_login = this.un_login
      if(phone&&password){
        let fd = new FormData();
        fd.append('phone', phone);
        fd.append('password', password);
        fd.append('un_login', un_login)
        let {data} = await this.$axios.post('/api/loginByPW',fd,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        if(data.errcode===0){
          // 成功就去隐藏换header，提示登录成功
          this.setShowLogin(false)
          this.setLoginState(true);
          localStorage.setItem('hsToken', data.user_info)
          if(this.remember) {
            this.toRememberPass(phone, password)
          }else{
            this.clearRememberPass()
          }
          // 去获取用户信息
          this.getUserInfor();
        }else{
          this.$message.info(data.errmsg);
        }
      }else{
        // 信息未填写完全
      }
    },
    unLogin(e){
      console.log(e.target.checked)
      if(e.target.checked === true) {
        this.un_login = 1
      } else{
        this.un_login = 0
      }
    },
    // 注册
    async toReg(){
      let username = this.regName;
      let password = this.regPass;
      let confirmPassword = this.regConfirmPass;
      let phone = this.regPhone;
      let identity = this.regCard;
      let idType = this.idType;
      let code = this.regCode;
      let codeToken = this.regCodeToken;
      // 首先判断手机号是否注册过了
      let ifPhone = await this.$axios.get('/api/checkPhone',{
        params: {
          phone
        }
      })
      if(ifPhone.errcode===100){
        this.$message.info(ifPhone.errmsg);
        return false;
      }
      let ifCard = this.ifCard
      // 首先判断证件格式是否正确
      if(identity && ifCard){
        let ifIdCard = await this.$axios.get('/api/checkId',{
          params: {
            type: idType,
            identity
          }
        })
        if(ifIdCard.errcode===100){
          this.$message.info('证件号码不符合规范')
          return false;
        }
      }
      let params = {
        username,
        password,
        confirmPassword,
        phone,
        code,
        codeToken
      }
      if(ifCard) {
        params.identity = identity
        params.idType = idType
      }
      // 判断数据是否填写完全
      if(username&&password&&confirmPassword&&phone&&code){
        let {data:{errcode,errmsg}} = await this.$axios.post('/api/register', params);
        if(errcode===0){
          this.$message.info('注册成功');
          // 去登录
          this.changeType(0);
          // this.$store.main.commit('setShowLogin', false);
        }else{
          this.$message.info(errmsg);
        }
      }else{
        this.$message.info('注册信息填写不完全');
      }
      
    },
    // 记住密码
    rememberPass(e){
      this.remember = e.target.checked
    },
    // 做记住密码的操作
    toRememberPass(phone, password){
      let crypt = encrypt(password)
      let arr = [phone,crypt]
      localStorage.setItem('hanshe', arr)
    },
    clearRememberPass(){
      localStorage.setItem('hanshe', '')
    },
    // 找回密码
    async toFindPasssword(){
      let phone = this.findPhone;
      let code = this.findCode;
      let codeToken = this.findCodeToken;
      let password = this.findPass;
      let confirmPassword = this.findConfirmPass;
      // 判断手机号码格式
      if(phone&&code&&password&&confirmPassword){
        let fd = new FormData();
        fd.append('phone', phone);
        fd.append('code', code);
        fd.append('codeToken', codeToken);
        fd.append('password', password);
        fd.append('confirmPassword', confirmPassword);
        let {data} = await this.$axios.post('/api/RetrievePassword',fd,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        if(data.errcode===0){
          this.$message.info('修改成功');
          // 去登录
          this.changeType(0);
        }else{
          this.$message.info(data.errmsg);
        }
      }else{
        // 信息未填写完全
        this.$message.info('信息未填写完全')
      }
    },
    // 获取用户个人信息
    async getUserInfor(){
      let {data} = await this.$axios.get('/api/userInfo');
      if(data.errcode===0){
        this.setUserInfor(data.user);
      }
    }
  },
  components: {
    CodeSend
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
.page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
  .wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    i {
      font-size: 32px;
      color: #fff;
      position: absolute;
      top: -40px;
      right: 0;
    }
    .loginWrapper {
      background-color: #fff;
      width: 460px;
      box-sizing: border-box;
      padding: 34px;
      border-radius: 8px;
      .img {
        background-color: #fff;
        position: absolute;
        top: -37px;
        left: 50%;
        transform: translateX(-50%);
        width: 84px;
        height: 84px;
        border-radius: 70px;
        text-align: center;
        line-height: 84px;
        img {
          width: 54px;
          height: 58px;
        }
      }
      .loginWay {
        margin: 28px 0;
        display: flex;
        justify-content: space-around;
        font-size: 14px;
        font-weight: 500;
        color: #cacaca;
        .selected {
          color: @color;
        }
      }
      .container {
        & > div {
          input {
            width: 100%;
            border: 1px solid rgba(69, 75, 108, 0.15);
            border-radius: 8px;
            height: 48px;
            outline: 0;
            font-size: 14px;
            // color: rgba(202, 202, 202, 1);
            padding: 16px;
            box-sizing: border-box;
            margin-bottom: 12px;
          }
          .line {
            display: flex;
            input {
              margin-right: 10px;
            }
            button {
              background: @color;
              color: #fff;
              font-size: 13px;
              border-radius: 8px;
              border: 0;
              width: 220px;
              margin: 0;
              height: 48px;
            }
          }
          .ant-select{
            .ant-select-selection--single{
              height: 72px;
              .ant-select-selection__rendered{
                line-height: 68px;
              }
            }
          }
          .tips {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #8d8d8d;
            span {
              span {
                color: @color;
              }
            }
          }
          button {
            width: 100%;
            height: 56px;
            background: @color;
            color: #fff;
            font-size: 24px;
            border-radius: 8px;
            margin-top: 30px;
            border: 0;
            outline: 0;
          }
        }
      }
    }
  }
}
</style>

