<template>
  <div class="personal">
    <div class="line">
      <span class="title">姓名</span>
      <span>{{user.username}}</span>
    </div>
    <div class="line">
      <span class="title">性别</span>
      <a-radio-group v-model="user.gender">
        <a-radio class="abc" value="MALE">男</a-radio>
        <a-radio class="abc" value="FEMALE">女</a-radio>
      </a-radio-group>
    </div>
    <div class="line">
      <span class="title">生日</span>
      <input type="text" v-model="user.birthday">
    </div>
    <div class="line">
      <span class="title">证件类型</span>
      <a-select
        v-model="user.idType"
        class="select"
        @change="selectIdType">
        <a-icon slot="suffixIcon" type="caret-down" />
        <a-select-option value="ID_CARD">身份证</a-select-option>
        <a-select-option value="DRIVER_LICENSE">驾驶证</a-select-option>
        <a-select-option value="TAIWAN_PASS">台湾居民来往大陆通行证</a-select-option>
        <a-select-option value="HK_AND_MACAU_PASS">港澳居民来往大陆通行证</a-select-option>
        <a-select-option value="FOREIGN_PASSPORT">外籍护照</a-select-option>
      </a-select>
    </div>
    <div class="line">
      <span class="title">证件号码</span>
      <input type="text" v-model="user.identity">
    </div>
    <div class="line">
      <span class="title">手机号码</span>
      <span>{{user.phone}}</span>
    </div>
    <div class="line">
      <span class="title">电子邮箱</span>
      <input type="text" v-model="user.email">
    </div>
    <div class="line">
      <span class="title">联系地址</span>
      <input type="text" v-model="user.address">
    </div>
    <div class="saveBtn" @click="updateUserInfor">保 存</div>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data(){
    return{
      user: {},
    }
  },
  mounted(){
    var obj = localStorage.getItem('userInfo')
    this.user = this.$qs.parse(obj)
  },
  methods: {
    selectIdType(val){
      this.user.idType = val
    },
    async updateUserInfor(){
      let user = this.user
      this.$axios.post('/api/update', {
        username: user.username,
        email: user.email,
        phone: user.phone,
        identity: user.identity,
        birthday: user.birthday,
        address: user.address,
        gender: user.gender,
        idType: user.idType
      }).then((res) => {
        console.log(res)
        this.$message.info('保存成功')
      }).catch(err=>{
        cosnole.log(err)
      })
      
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
.personal {
  flex: 1;
  margin-left: 43px;
  border: 1px solid rgba(69, 75, 108, 0.15);
  font-size: 16px;
  color: #484848;
  padding: 24px 0;
  min-width: 400px;
  .line {
    padding: 5px;
    height: 50px;
    line-height: 50px;
    .title {
      width: 145px;
      text-align: center;
      font-size: 16px;
      color: #8d8d8d;
      display: inline-block;
      padding: 0;
    }
    .select{
      width: 260px !important;
    }
    span {
      padding-left: 16px;
    }
    input {
      border: 1px solid rgba(69, 75, 108, 0.15);
      padding: 0 12px;
      height: 32px;
      outline: 0;
    }
    .ant-radio-checked {
      .ant-radio-inner {
        border-color: @color !important;
      }
      .ant-radio-inner:after {
        background-color: @color !important;
      }
    }
  }
  .saveBtn {
    width: 120px;
    padding: 12px 0;
    text-align: center;
    border-radius: 8px;
    background-color: @color;
    font-size: 16px;
    color: #fff;
    margin: 20px auto;
    display: block;
    cursor: pointer;
  }
}
</style>

