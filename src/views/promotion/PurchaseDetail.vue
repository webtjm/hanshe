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
          <router-link :to="{path:'/packageDetail',query: {id: data.id}}">{{data.name}}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item class="actived">购买详情</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="mainDetail">
      <div class="detail">
        <a-card title="套餐信息">
          <div class="line">
            <span>套餐名称</span>
            <div>{{data.name}}</div>
          </div>
          <div class="line">
            <span>使用酒店</span>
            <div>{{data.hotelName}}</div>
          </div>
          <div class="line">
            <span>有效天数</span>
            <div>{{data.vaildity}}天</div>
          </div>
          <div class="line">
            <span>使用次数</span>
            <div>{{data.useNumber}}次</div>
          </div>
          <div class="line">
            <span>购买数量</span>
            <div>{{buyNumber}}</div>
          </div>
        </a-card>
      </div>
      <div class="detail">
        <a-card title="订单明细">
          <div class="line">
            <span>套餐费</span>
            <div>{{data.price}}*1份</div>
          </div>
          <!-- <div class="line">
            <span>优惠信息</span>
            <div>{{data.preferentialInformation}}</div>
          </div> -->
          <div class="bottom">
            <span>总金额</span>
            <div class="price">
              ￥
              <span>{{data.price*buyNumber}}</span>
            </div>
          </div>
        </a-card>
      </div>
      <button class="payBtn" @click="toConfirm">确认 Confirm</button>
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
  data(){
    return {
      id: '',
      data: {
        comboName: '',
        buyLimit: '',
        price: '',
        totalPrice: '',
      },
      buyNumber: 1
    }
  },
  async created() {
    let { id } = this.$route.query;
    this.id = id;
    let {data} = await this.$axios.post("/api/getComboInfo?id="+id)
    if(data.errcode===0){
      this.data = data.data;
    }
  },
  methods: {
    ...mapMutations('main', [
      'setShowLogin'
    ]),
    toConfirm(){
      // this.$router.push('/packagePay?id='+this.id)
      this.$axios.post("/api/buyCombo?comboId="+this.id).then(({data}) => {
        if(data.errcode===0){
          if(data.data){
            let id = data.data;
            this.$router.push('/packagePay?id='+id)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
.mainDetail{
  width: 70%;
  margin: 0 auto;
  .detail{
    .ant-card{
      width: 100%;
      border-radius: 8px;
      margin-bottom: 13px;
      padding: 0 20px;
      &>:first-of-type{
        padding-left: 13px;
        font-size:20px;
        font-weight:500;
        color:#484848;
      }
      &>:nth-of-type(2){
        padding: 20px 0px 20px 14px;
      }
      .ant-card-body{
        &>span{
          color: #CACACA;
          font-size: 16px;
        }
        .line{
          display: flex;
          // height: 40px;
          align-items: center;
          &>span{
            font-size:16px;
            color:rgba(141,141,141,1);
            display: inline-block;
            width: 120px;
            line-height: 40px;
          }
        }
        .bottom{
          font-size: 20px;
          color: #8d8d8d;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .price{
            color: @priceColor;
            font-size: 25px;
            margin-left: 200px;
            span{
              font-size: 30px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
  .payBtn{
    background-color: @color;
    width: 370px;
    height: 68px;
    border-radius: 8px;
    font-size: 26px;
    color: #fff;
    border: 0;
    margin: 60px auto;
    display: block;
  }
}
</style>
