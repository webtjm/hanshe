<template>
  <div class="wrapper">
    <div class="box" v-for="item in data" :key="item.id" @click="toFood(item.id)">
      <img alt="寒舍" :src="imgUrl+item.cover">
      <span class="title">{{item.title}}</span>
    </div>
    <div class="more" @click="toMore">
      <div class="english">More</div>
      <div class="border"></div>
      <div class="title">查看更多</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    toFood(id){
      this.$router.push(`/articleDetail?id=${id}&type=0`);
    },
    toMore(){
      this.$router.push('/food')
    }
  }
}
</script>

.<style lang="less" scoped>
@import '../../assets/less/common.less';
@import "../../assets/font/myFont.css";
@media screen and (max-width: 1000px) {
  .wrapper{
    .box{
      .title{
        font-family: hansans!important;
      }
    }
    .more{
      padding: 30px!important;
      box-sizing: border-box;
    }
  }
}
.wrapper{
  display: flex;
  width: 70%;
  margin: 0 auto;
  .box{
    width: 25%;
    height: 275px;
    position: relative;
    font-family:hanzhenMin;
    img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    span{
      font-size:20px;
      color:#fff;
      line-height:20px;
      text-shadow:0px 1px 5px rgba(72,72,72,0.59);
      position: absolute;
      left: 28px;
      bottom: 43px;
    }
  }
  .more{
    flex: 1;
    height: 275px;
    background-color: #EBEDF2;
    text-align: right;
    color: @color;
    box-sizing: border-box;
    padding-right: 60px;
    padding-top: 100px;
    .english{
      font-size: 20px;
      font-weight:bolder;
    }
    .border{
      width: 54px;
      height: 10px;
      margin: 10px 0;
      background-color: @color;
      display: inline-block;
      border-radius: 2px;
    }
    .title{
      font-size:26px;
      font-weight:bolder;
      line-height:24px;
    }
  }
}
</style>

