<template>
  <div class="outer">
    <img alt="寒舍" :src="imgUrl+data.cover">
    <div class="detail">
      <div class="title">{{data.title}}</div>
      <div class="infor">
        <div>
          <div class="special" v-for="(item,idx) in data.special" :key="idx">{{item}}</div>
        </div>
        <!-- <div class="time">{{data.time}} 发布</div> -->
      </div>
      <div class="list">
        <div class="line" v-for="(item,idx) in data.list" :key="idx">
          <i class="iconfont" v-html="item.icon"></i>
          <span>{{item.name}}：</span>
          <span class="more">{{item.more.join('，')}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imgStyle: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: {
        title: "",
        special: [],
        time: "",
        list: [
          {
            icon: "",
            name: "",
            content: "",
            more: []
          }
        ]
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
.outer {
  display: flex;
  flex: 1;
  img {
    object-fit: cover;
    width:501px;
    height:264px;
    border-radius: 8px;
  }
  .foodImg{
    width: 460px;
    height: 400px;
  }
  .detailImg{
    width: 650px;
    height: 320px;
  }
  .detail {
    flex: 1;
    margin: 0 36px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: @color;
    .title {
      font-size: 28px;
      font-family: hanzhen;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .infor {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 1px dashed #cacaca;
      padding-bottom: 6px;
      margin-bottom: 10px;
      font-size: 14px;
      div:first-child{
        flex: 1;
      }
      .special {
        padding: 4px 10px;
        background-color: #ff7044;
        color: #fff;
        display: inline-block;
        border-radius: 30px;
        margin-right: 6px;
        margin-bottom: 6px;
      }
      .time {
        color: #cacaca;
      }
    }
    .list {
      line-height: 30px;
      .line{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
      .iconfont {
        font-size: 20px;
        margin-right: 6px;
      }
      .more{
        line-height: 30px;
        overflow: hidden;
      }
    }
  }
}
</style>
