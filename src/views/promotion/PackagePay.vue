<template>
  <div>
    <div class="breadCrumb">
      <a-breadcrumb>
        <a-breadcrumb-item>当前位置：</a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link to="/">HANSHE HOTEL</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link to="/discountPackage">优惠套餐</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link :to="{path:'/packageDetail',query: {id: id}}">{{data.name}}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link :to="{path:'/purchaseDetail',query: {id: id}}">购买详情</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item class="actived">订单支付</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-card title="订单支付">
      <div class="orderWrapper">
        <img alt="寒舍" :src="imgUrl+combo.picture">
        <div class="orderDetail">
          <div class="name">{{combo.name}}</div>
          <!-- <div class="content">使用酒店：{{data.useHotel}}</div>
          <div class="content">有效天数：{{data.vaildity}}天</div>
          <div class="content">使用次数：{{data.useNumber}}次</div> -->
          <!-- <div class="content">购买份数：{{data.buyNumber}}份</div> -->
          <div class="tips">
            <span>
              <a-icon type="exclamation-circle"/>
              <span style="margin-left: 10px;">您需要在30分钟内完成支付，否则该订单将会被取消！</span>
              <span class="lastTime">{{remaining}}</span>
            </span>
            <!-- <span class="lastTime">180S</span> -->
          </div>
        </div>
        <div class="price">
          <div>
            ￥
            <span>{{data.price*buyNumber}}</span>
          </div>
        </div>
      </div>
    </a-card>
    <a-card title="支付方式">
      <div class="payWay">
        <!-- <div class="wayBtn" :class="payWay===0?'selectWay':''" @click="payWay=0">
          <img alt="寒舍" class="icon" src="@/assets/img/zhifubao.png" alt="">
          <img alt="寒舍" class="imgText" src="@/assets/img/zhifubao-text.png" alt="">
        </div> -->
        <div class="wayBtn" :class="payWay===1?'selectWay':''" @click="payWay=1">
          <img alt="寒舍" class="icon" src="@/assets/img/weixin.png">
          <span>微信支付</span>
        </div>
      </div>
    </a-card>
    <!-- <div class="page" v-show="showPay">
      <div class="code-wrap">
        <a-icon type="close" @click="toOrder" />
        <div class="title">请打开微信扫码支付</div>
        <div class="pay-num">支付金额：<span>{{totalPrice}}</span>元</div>
        <div style="width: 200px;" id="qrcode"></div>
      </div>
    </div> -->
    <!-- <payWrap ref="paywrap" v-show="showPay" :price="totalPrice" :url="url" @order="toOrder" /> -->
    <button class="payBtn" @click="toBuy">支付 Pay</button>
    <!-- <button @click="checkStatus">查看状态</button> -->
    <div class="page" v-show="showPay">
      <div class="code-wrap">
        <a-icon class="close-icon" type="close" @click="toOrder" />
        <div class="title">请打开微信扫码支付</div>
        <div class="pay-num">支付金额：<span>{{totalPrice}}</span>元</div>
        <div style="width: 200px;height: 200px;" id="qrcode"></div>
      </div>
    </div>
  </div>
</template>

<script>
import payWrap from '@/components/public/payWrap'
import QRCode from 'qrcodejs2'
export default {
  data(){
    return{
      payWay: 1,
      data: {},
      combo: {},
      id: '',
      orderId: '',
      showPay: false,
      url: '',
      buyNumber: 1,
      remainTime: 1800,
      clockId: ''
    }
  },
  computed:{
    totalPrice(){
      return this.buyNumber*this.data.price
    },
    remaining(){
      let minute = Math.floor(this.remainTime/60)
      let second = this.remainTime%60
      if(this.remainTime < 0) {
        return '0分钟0秒'
      }
      return minute + '分钟' + second + '秒'
    }
  },
  async mounted() {
    let { id } = this.$route.query;
    this.id = id;
    
    let { data } =await this.$axios.post("/api/getComboOrderInfo?orderId="+id)
    if(data.errcode===0){
      this.data = data.data;
      this.combo = data.combo
      this.toClock()
    }
  },
  
  methods:{
    toBuy(){
      this.$axios.post(`/api/pay?orderNo=${this.id}&price=${this.totalPrice}&productId=${this.combo.id}`).then(({data}) => {
        console.log(data)
        if(data.errcode === 0){
          this.url = data.code_url
          this.showPay = true
          this.$nextTick(()=> {
            let qrcode = new QRCode('qrcode', {
              width: 200,
              height: 200,
              text: data.code_url
            })
            
            this.checkStatus()
            
          })
          
        }
      })
    },
    async checkStatus(){
      this.timer = setInterval(async () => {
        this.$axios.post(`/api/queryOrder?orderNo=${this.id}`).then(({data}) => {
          if(data.errcode===0){
            this.$message.info('支付成功')
            console.log('tiaoz')
            this.$router.replace('/packageOrder?id='+this.id)
            window.clearInterval(this.timer)
          }
          console.log(data)
        })
        
      }, 2000)
    },
    toClock(){
      let initStart, start, end
      // 先清空定时器
      clearInterval(this.clockId)
      initStart = this.data.createTime,
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
      this.status = 1
      this.$message.info('关闭订单');
    },
    toOrder(){
      console.log('tiaoz')
      this.$router.replace('/packageOrder?id='+this.id)
      
    }
  },
  beforeDestroy(){
    window.clearInterval(this.clockId)
    window.clearInterval(this.timer)
  },
  components: {
    payWrap
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
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
        width: 320px;
        height: 185px;
        margin-right: 27px;
      }
      .orderDetail {
        flex: 1;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .name {
          font-size: 22px;
          color: @color;
          line-height: 24px;
          font-family: hanzhen;
          margin-top: 10px;
        }
        .content{
          font-size: 16px;
          color: @color;
        }
        .tips {
          font-size: 14px;
          color: #8e8e8e;
          display: inline-block;
          &>span{
            background-color: #fffcd4;
            padding: 8px 13px;
            border-radius: 8px;
          }
          i {
            color: #d81e06;
            position: inherit;
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


