<template>
  <div class="hotWrapper">
    <div class="hot" v-for="(item,idx) in data" :key="idx" @click="toHotel(item.id)">
      <img alt="寒舍"
        :class="idx<2?'left':'right'"
        class="hotImg"
        :src="imgUrl+item.cover">
      <div
        class="hotContent"
        :class="idx<2?'right':'left'"
        :style="'background-color:'+colors[idx]">
        <div class="desTitle">Entertainment</div>
        <div class="border"></div>
        <div class="name">{{item.title}}</div>
        <div class="description">{{item.introduction}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      default: ()=>{
        return []
      },
      type: Array
    }
  },
  data(){
    return{
      colors: ['#454B6C', '#454B6C', '#099999', '#099999']
    }
  },
  methods: {
    toHotel(id){
      this.$router.push(`/articleDetail?id=${id}&type=1`);
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/font/myFont.css";
@media screen and (max-width: 1000px) {
  .hotWrapper{
    .hotContent{
      display: flex!important;
      align-items: center;
      justify-content: center;
    }
    .description,.desTitle, .border{
      display: none!important;
    }
  }
}
.hotWrapper{
  display: flex;
  width: 70%;
  flex-wrap: wrap;
  margin: 0 auto;
  .hot{
    display: flex;
    width: 50%;
    height: 0;
    padding-bottom: 25%;
    position: relative;
    .left{
      left: 0;
    }
    .right{
      right: 0
    }
    .hotImg{
      position: absolute;
      width: 50%;
      height: 100%;
      object-fit: cover;
      box-sizing: border-box;
      overflow: hidden;
    }
    .hotContent{
      position: absolute;
      display: inline-block;
      width: 50%;
      height: 100%;
      box-sizing: border-box;
      background-color: aqua;
      color: #fff;
      text-align: right;
      padding: 8% 7% 6% 6%;
      .desTitle{
        font-size:22px;
        // color:#454B6C;
        line-height:30px;
        text-align: right;
        font-family: Times New Roman;
      }
      .border{
        width:35px;
        height:6px;
        background:#fff;
        text-align: right;
        display: inline-block;
        margin-bottom: 15px;
      }
      .border::after{
        clear: both;
      }
      .name,.english{
        font-size:22px;
        font-family: hanzhenMin;
        // color:#454B6C;
        text-align: right;
      }
      & .english{
        font-size: 16px;
      }
      .description{
        font-size:14px;
        font-weight:500;
        text-align: left;
        // color:#454B6C;
        margin-top: 32px;
        position: relative;
        right: -14px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
      }
    }
  }
}
</style>

