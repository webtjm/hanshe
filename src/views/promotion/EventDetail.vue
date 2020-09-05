<template>
  <div>
    <div class="breadCrumb">
      <a-breadcrumb>
        <a-breadcrumb-item>当前位置：</a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link to="/">HANSHE HOTEL</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link to="/event">活动举办</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item class="actived">{{data.activityName}}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="wrapper">
      <img alt="寒舍" :src="imgUrl+data.picture">
      <div class="main">
        <div class="title">{{data.activityName}}</div>
        <!-- <div class="time">发布于{{data.time}}</div> -->
        <div class="line">
        活动城市：{{data.city}}
        </div>
        <div class="line">
        活动酒店：{{data.hotelName}}
        </div>
        <div class="price">
          <button @click="toggleBookShow">预订 Booking</button>
        </div>
      </div>
    </div>
    <CopyWriting :text="data.activityDetails" />
    <!-- 预订项目 -->
    <div class="bookWrapper" v-if="showBook" @click.self="toggleBookShow">
      <div class="book">
        <a-icon type="close-circle"  @click="toggleBookShow" />
        <div class="title">基本信息</div>
        <div class="flexBox">
          <input type="text" placeholder="联系人" v-model="name">
          <span class="red">*</span>
        </div>
        <div class="flexBox">
          <input type="text" placeholder="联系电话" v-model="phone">
          <span class="red">*</span>
        </div>
        <input type="text" placeholder="邮箱" v-model="email">
        <input type="text" placeholder="定制需求" v-model="remark">
        <div class="dateWrapper flexBox">
          <!-- <a-range-picker @change="changeDate" /> -->
          
          <a-date-picker
            showTime
            size="large"
            style="width: 100%;"
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="活动时间"
            @change="onChange"
            :disabledDate="disabledStart"
          >
            <i slot="suffixIcon" class="iconfont" style="margin-right: 10px;">&#xe6be;</i>
          </a-date-picker>
          <span class="red">*</span>
        </div>
        <div class="flexBox">
          <input type="number" placeholder="活动参与人数" v-model="num">
          <span class="red">*</span>
        </div>
        <div class="title">活动地点<span class="red">*</span></div>
        <div class="line">
          <a-select
            size="large"
            dropdownClassName="12select"
            class="selectWrapper"
            v-model="city"
            @change="changeCity">
            <a-icon slot="suffixIcon" type="caret-down" />
            <a-select-option :value="item.city" v-for="item in citys" :key="item.city">{{item.city}}</a-select-option>
          </a-select>
          <a-select
            size="large"
            class="selectWrapper"
            v-model="hotel"
            @change="changeHotel"
          >
            <a-icon slot="suffixIcon" type="caret-down" />
            <a-select-option :value="item.name" v-for="item in hotels" :key="item.name">{{item.name}}</a-select-option>
          </a-select>
        </div>
        <button @click="toSubmit">提交</button>
      </div>
    </div>
    <!-- 预订成功 -->
    <div class="bookWrapper" v-if="succ" @click.self="succ=false">
      <div class="succ">
        <div>提交成功</div>
        <button @click="subSucc">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import CopyWriting from '@/components/detail/CopyWriting';
function formatObj(obj, key){
  return obj.map(item => {
    return item[key]
  })
}
import {mapMutations} from 'vuex'
export default {
  data(){
    return{
      id: '',
      showBook: false,
      succ: false,
      data: {},
      name: '',
      phone: '',
      email: '',
      remark: '',
      num: '',
      startTime: '',
      citys: [],
      city: '城市',
      hotels: [],
      hotel: '酒店',
      hotelId: 0,
      orderId: ''
    }
  },
  async mounted(){
    let self = this
    this.id = this.$route.query.id;
    // 获取所有城市
    let {data} = await this.$axios.post('/api/getCityByActivity?activityId='+this.id)
    if(data.errcode===0&&data.data.length>0){
      this.citys = data.data
      // console.log(this.citys)
    }
    this.$axios.post('/api/getActivityInfo?activityId='+this.id).then(({data}) => {
      // console.log(data)
      if(data.errcode === 0){
        let date = new Date(data.data.updateTime)
        data.data.time = date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日'
        this.data = data.data
      }
    }).catch(err => {
      // console.log(err)
    })
  },
  methods:{
    ...mapMutations('main', [
      'setShowLogin'
    ]),
    toggleBookShow(){
      if(this.showBook){
        this.showBook=false;
      }else{
        this.showBook=true;
      }
    },
    onChange(value, dateString) {
      this.startTime = dateString
    },
    disabledStart(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day');
    },
    async changeCity(val){
      console.log(val)
      this.city=val
      let hotel  =await this.$axios.post('/api/getHotelByCity?city='+this.city)
      if(hotel.data.errcode === 0 && hotel.data.data){
        var arr = []
        hotel.data.data.forEach(item => {
          if(this.data.hotelName.indexOf(item.name)!=-1){
            arr.push(item)
          }
        })
        this.hotels = arr
        this.hotel = this.hotels[0].name
        this.hotelId = this.hotels[0].id
      }else{
        this.$message.info('请重新选择筛选条件')
      }
    },
    changeHotel(val){
      this.hotel=val
      this.hotels.forEach(item => {
        if(item.name===val){
          this.hotelId = item.id
        }
      })
    },
    toSubmit(){
      
      if(this.name && this.phone && this.startTime && this.hotelId) {
        
        if(!this.common.phone(this.phone)) {
          this.$message.info('手机号码不规范');
          return false
        }
        if(this.email && !this.common.email(this.email)) {
          this.$message.info('邮箱不规范');
          return false
        }
        if(this.num <= 0) {
          this.$message.info('活动参与人数不能小于1')
          return false
        }
        
        this.$axios.post(`/api/reserveActiyity?number=${this.num}&hotelId=${this.hotelId}&email=${this.email}&phone=${this.phone}&activityId=${this.id}&contacts=${this.name}&activityTime=${this.startTime}&remark=${this.remark}`).then(({data}) => {
          console.log(data)
          if(data.errcode===0){
            this.showBook=false;
            this.succ=true;
            this.orderId = data.orderId
          }else{
            this.$message.info(data.errmsg)
            // this.showBook=false;
          }
        }).catch(err=>{
          console.log(err)
          this.$message.info('你还未登录')
          this.showBook=false;
          this.setShowLogin(true)
        })
        
      }else{
        this.$message.info('信息填写不完全')
      }
      
    },
    subSucc(){
      this.succ=false
      this.$router.push('/activityOrder?id='+this.orderId)
    }
  },
  components: {
    CopyWriting
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
button{
  cursor: pointer;
}
.bookWrapper{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  .book{
    margin: 5% auto;
    position: relative;
    padding: 30px;
    width: 460px;
    background-color: #fff;
    &>i{
      position: absolute;
      right: 0;
      top: -40px;
      font-size: 30px;
      color: #fff;
    }
    .title{
      font-size: 14px;
      color: @color;
      margin-bottom: 13px;
      .red {
        display: inline-block;
        margin-left: 4px;
        position: relative;
        top: 6px;
        color: red;
        font-size: 22px;
      }
    }
    .flexBox {
      display: flex;
      .red {
        display: inline-block;
        margin-left: 4px;
        position: relative;
        top: 14px;
        color: red;
        font-size: 22px;
      }
    }
    input{
      width: 100%;
      padding: 16px;
      font-size: 14px;
      border:1px solid rgba(69, 75, 108, 0.15);
      border-radius:8px;
      margin-bottom: 12px;
    }
    .selectWrapper{
      width: 100%;
      margin-bottom: 12px;
      .ant-select-selection{
        height: 100px;
      }
    }
    .line{
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      .selectWrapper{
        width: 49%;
        .ant-select-arrow{
          top: 0;
          right: 0;
        }
      }
      
    }
    button{
      width: 100%;
      height: 56px;
      font-size: 20px;
      color: #fff;
      background-color: @color;
      margin: 30px 0 10px;
      border: 0;
      border-radius: 8px;
    }
  }
  .dateWrapper{
    margin-bottom: 12px;
    .ant-calendar-picker{
      width: 100%;
    }
  }
  .succ{
    background-color: #fff;
    margin: 19% auto;
    width: 302px;
    text-align: center;
    padding: 40px 0 20px;
    div{
      color: @color;
      font-size: 20px;
    }
    button{
      width: 170px;
      color: #fff;
      font-size: 18px;
      border-radius: 8px;
      margin-top: 36px;
      background-color: @color;
      border: 0;
      padding: 10px 0;
    }
  }
}
.wrapper{
  display: flex;
  width: 70%;
  margin: 0 auto;
  img{
    width: 608px;
    height: 320px;
    object-fit: cover;
    margin-right: 28px;
  }
  .main{
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    .title{
      font-size: 32px;
      color: @color;
      line-height: 50px;
      font-family: hanzhen;
    }
    .time{
      border-bottom: 1px dashed #cacaca;
      margin-bottom: 10px;
      padding-bottom: 10px;
      text-align: right;
      font-size: 14px;
      color: #cacaca;
    }
    .line{
      font-size: 14px;
      color: #8d8d8d;
      line-height: 22px;
    }
    .price{
      color: @priceColor;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      div{
        margin-right: 40px;
        font-size: 22px;
        span{
          font-size: 48px;
          font-weight: bold;
        }
      }
      button{
        padding: 0 15px;
        height: 42px;
        font-size: 18px;
        color: #fff;
        background-color: @priceColor;
        border-radius: 8px;
        border: 0;
      }
    }
  }
}
</style>



