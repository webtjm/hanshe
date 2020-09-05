<template>
  <div>
    <div class="breadCrumb">
      <a-breadcrumb>
        <a-breadcrumb-item>当前位置：</a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link to="/">HANSHE HOTEL</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link to="/reservations">预订</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link :to="{path:'/singleStore',query: {id: hotel.id}}">{{hotel.name}}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link :to="{path:'/bookDetail',query: {hid: hotel.id, id: house.id}}">预订详情</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item class="actived">订单支付</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-card title="订单支付">
      <div class="orderWrapper">
        <img :src="imgUrl+hotel.picture">
        <div class="orderDetail">
          <div class="name">{{hotel.name}}</div>
          <div class="name">{{hotel.eName}}</div>
          <div class="type">{{house.name}} - {{room.name}} {{house.bedType}} 1间</div>
          <div class="orderTime">
            {{resident.residentTime}}
            <span>入住 -</span>
            {{resident.exitTime}}
            <span>离店</span> 共{{resident.days}}晚
          </div>
          <div class="tips">
            <a-icon type="exclamation-circle"/>
            <span>您需要在30分钟内完成支付，否则该订单将会被取消！</span>
            <span class="lastTime">{{remaining}}</span>
          </div>
        </div>
        <div class="price">
          <div>
            ￥
            <span>{{order.totalPrice}}</span>
          </div>
        </div>
      </div>
    </a-card>
    <a-card title="支付方式">
      <div class="payWay">
        <!-- <div class="wayBtn" :class="payWay===0?'selectWay':''" @click="payWay=0">
          <img class="icon" src="@/assets/img/zhifubao.png" alt="">
          <img class="imgText" src="@/assets/img/zhifubao-text.png" alt="">
        </div> -->
        <div class="wayBtn" :class="payWay===1?'selectWay':''" @click="payWay=1">
          <img class="icon" src="@/assets/img/weixin.png">
          <span>微信支付</span>
        </div>
      </div>
    </a-card>
    <payWrap ref="paywrap" v-show="showPay" :price="order.totalPrice" @order="toDetail" :url="url" />
    <button v-if="status===0" class="payBtn" @click="toBuy">支付 Pay</button>
    <button v-else class="payBtn">订单已关闭 Close</button>
  </div>
</template>

<script>
import payWrap from '@/components/public/payWrap'
import { clearInterval } from 'timers';
function formatDate(date) {
    let dd = new Date(date);
    return (
        dd.getFullYear() + "年" + (dd.getMonth() + 1) + "月" + dd.getDate() + "日"
    );
}
export default {
  data(){
    return{
      id: '',
      hotel: {},
      house: {},
      room: {},
      order: {},
      resident: {},
      payWay: 1,
      showPay: false,
      url: '',
      remainTime: 1800,
      clockId: '',
      status: 0,
      timer: 0
    }
  },
  created(){
    let {id} = this.$route.query;
    this.id = id;
    this.$axios.post('/api/getOrderInfo?orderId='+id).then(({data}) => {
      if(data.errcode === 0){
        this.hotel = data.hotel
        this.house = data.house
        this.order = data.order
        this.room = data.room
        this.resident = data.resident
        this.resident.days = this.common.compareData([this.common.formatLineDate(this.resident.residentTime), this.common.formatLineDate(this.resident.exitTime)])
        this.resident.residentTime = this.common.formatDate(this.resident.residentTime)
        this.resident.exitTime = this.common.formatDate(this.resident.exitTime)
        this.toClock()
      }else{
        this.$message.info('出错了，请稍后再试')
      }
    }).catch(err=>{
      this.$message.info('出错了，请稍后再试')
    })
  },
  computed:{
    remaining(){
      let minute = Math.floor(this.remainTime/60)
      let second = this.remainTime%60
      if(this.remainTime < 0) {
        return '0分钟0秒'
      }
      return minute + '分钟' + second + '秒'
    }
  },
  methods: {
    toClock(){
      let initStart, start, end
      // 先清空定时器
      clearInterval(this.clockId)
      initStart = this.order.createTime,
      console.log(initStart)
      // initStart = 1563852709627,
      end = initStart + 30*60*1000
      this.clockId = setInterval(() => {
        start = new Date().getTime()
        this.remainTime = Math.floor((end - start)/1000)
        if(this.remainTime < 1){
          this.closeOrder()
        }
      }, 1000)
    },
    closeOrder(){
      clearInterval(this.clockId)
      this.lastTime = 0
      this.$axios.post('/api/cannelReserve?orderNo='+this.id).then(({data}) => {
        if(data.errcode===0){
          this.status = -1
          this.$message.info('关闭订单');
        }
      })
      
    },
    toBuy(){
      this.$axios.post(`/api/pay?orderNo=${this.id}&price=${this.order.totalPrice}&productId=${this.house.id}`).then(({data}) => {
        if(data.errcode === 0){
          this.url = data.code_url
          this.showPay = true
          this.$nextTick(() => {
            this.$refs.paywrap.getCode();
            this.checkStatus()
          })
        }
      })
    },
    toDetail(){
      this.$router.replace('/orderDetail?id='+this.id)
      window.clearInterval(this.timer)
    },
    checkStatus(){
      this.timer = setInterval(async () => {
        this.$axios.post(`/api/queryOrder?orderNo=${this.id}`).then(({data}) => {
          if(data.errcode===0){
            this.$message.info('支付成功')
            
            this.$router.replace('/orderDetail?id='+this.id)
            window.clearInterval(this.timer)
          }
          console.log(data)
        })
        
      }, 2000)
      
    }
  },
  components: {
    payWrap
  }
};
</script>

<style lang="less" scoped>
@import "../assets/less/common.less";
.breadCrumb {
  border-top: 2px solid @color;
  padding-top: 25px;
  padding-bottom: 37px;
  .ant-breadcrumb {
    width: 65%;
    margin: 0 auto;
    font-size: 14px;
    & > span:last-child {
      color: @color;
    }
  }
}
.ant-card {
  width: 65%;
  border-radius: 8px;
  padding: 0 20px;
  margin: 0 auto;
  margin-bottom: 13px;
  & > :first-of-type {
    padding-left: 13px;
    font-size: 20px;
    font-weight: 500;
    color: #484848;
  }
  & > :nth-of-type(2) {
    padding: 20px 0px 20px 14px;
    .orderWrapper {
      display: flex;
      justify-content: space-between;
      & > img {
        width: 270px;
        height: 145px;
        margin-right: 27px;
      }
      .orderDetail {
        flex: 1;
        .name {
          font-size: 22px;
          color: @color;
          line-height: 24px;
          font-weight: bolder;
        }
        .type {
          font-size: 16px;
          color: rgba(72, 72, 72, 1);
          margin-top: 12px;
        }
        .orderTime {
          font-size: 16px;
          color: rgba(72, 72, 72, 1);
          margin: 10px 0;
          span {
            color: #8e8e8e;
          }
        }
        .tips {
          background-color: #fffcd4;
          padding: 8px 13px;
          font-size: 14px;
          color: #8e8e8e;
          border-radius: 8px;
          display: inline-block;
          i {
            color: #d81e06;
          }
          .lastTime {
            color: #ff7044;
          }
        }
      }
      .price{
        display: flex;
        align-items: flex-end;
        div{
          color: #FF7044;
          font-size: 20px;
          font-weight: bold;
          span{
            font-size: 30px;
          }
        }
      }
    }
    .payWay{
      display: flex;
      .wayBtn{
        width: 245px;
        height: 70px;
        border:1px solid rgba(69, 75, 108, 0.15);
        border-radius:8px;
        margin-right: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        .icon{
          height: 48px;
          margin-right: 18px;
        }
        .imgText{
          width: 110px;
        }
        span{
          font-size:28px;
          font-weight:bold;
          color:rgba(0,0,0,1);
          line-height:82px;
        }
      }
      .selectWay{
        box-shadow:0px 2px 16px 0px rgba(69,75,108,0.5);
      }
    }
  }
}
.payBtn{
  display: block;
  background-color: @color;
  width: 370px;
  height: 68px;
  border-radius: 8px;
  font-size: 26px;
  color: #fff;
  border: 0;
  margin: 57px auto;
}
</style>
