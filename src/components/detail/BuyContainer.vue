<template>
  <div class="wrapper">
    <img alt="寒舍" :src="imgUrl+data.picture">
    <div class="main">
      <div class="title">{{data.name}}</div>
      <!-- <div class="time">发布于{{data.time}}</div> -->
      <div class="line" v-for="item in list" :key="item.title">
      {{item.title}}：{{item.content}}
      </div>
      <div class="price">
        <div v-if="data.price">
          ￥
          <span>{{data.price}}</span>
        </div>
        <button @click="linkTo" v-if="!nopay">{{btn}}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data:{
      type: Object,
      default: ()=> {
        return {}
      }
    },
    btn: {
      type: String,
      default: '购买 Buy'
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    nopay: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    linkTo(){
      if(this.data.stock === 0) {
        this.$message.info('该套餐已销售完，请选择其他套餐')
      }else{
        this.$router.push("/purchaseDetail?id="+this.data.id);
      }
      
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
.wrapper{
  display: flex;
  width: 70%;
  margin: 0 auto;
  img{
    width: 650px;
    height: 320px;
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
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
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
        cursor: pointer;
      }
    }
  }
}
</style>

