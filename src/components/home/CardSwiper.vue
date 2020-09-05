<template>
  <div class="cardWrapper">
    <div class="icon">
      <i class="iconfont">&#xe7f2;</i>
    </div>
    <div class="card" v-for="item in data" :key="item.id">
      <div class="title">
        <div>{{item.activityName}}</div>
        <div class="border"></div>
      </div>
      <img alt="寒舍" :src="imgUrl+item.picture">
      <div class="content">{{item.activityIntroduction}}</div>
      <button @click="toDetail(item.id)">查看详情</button>
    </div>
    <div class="icon">
      <i class="iconfont">&#xe664;</i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: ()=> {
        return []
      }
    }
  },
  methods: {
    toDetail(id){
      this.$emit('link', id)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
@import '../../assets/less/iconfont.less';
@media screen and (max-width: 1000px) {
  button{
    font-size: 14px!important;
    width: fit-content!important;
    line-height: unset!important;
  }
  .card{
    height: fit-content!important;
    padding: 20px;
    .content{
      line-height: unset!important;
      height: fit-content!important;
    }
  }
}
.cardWrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  .icon{
    .iconfont{
      font-size: 50px;
      color: #EBEDF2;
    }
  }
  .card{
    width:366px;
    height:558px;
    border:1px solid rgba(69, 75, 108, 0.15);
    box-shadow:0px 2px 15px 0px rgba(235,237,242,1);
    padding: 37px;
    box-sizing: border-box;
    color: @color;
    margin: 0 25px;
    .title{
      font-size:20px;
      font-weight:bold;
      line-height:30px;
      // font-family: hanzhen;
      .border{
        width:35px;
        height:6px;
        background:@color;
        opacity: 0.8;
        // position: relative;
        // left: 230px;
        margin-top: 5px;
      }
    }
    img{
      width: 100%;
      height: 234px;
      object-fit: cover;
      margin: 27px 0;
    }
    .content{
      font-size:16px;
      line-height:30px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      height: 90px;
    }
    button{
      background-color: #fff;
      border:1px solid rgba(69, 75, 108, 0.15);
      border-radius:8px;
      width: 188px;
      height: 44px;
      display: block;
      margin: 0 auto;
      margin-top: 26px;
    }
  }
}
</style>

