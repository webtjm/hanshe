<template>
  <div class="wrapper">
    <div class="mainWrapper">
      <img alt="寒舍" :src="imgUrl+data.picture">
      <div class="mainContent">
        <div class="title">{{data.name}}</div>
        <div class="intro">
          <ul>
            <li>
              <img alt="寒舍" src="@/assets/img/icon-bed.png">
              <span>床型</span>
              <span>{{data.bedType}}</span>
            </li>
            <li>
              <img alt="寒舍" src="@/assets/img/icon-area.png">
              <span>面积</span>
              <span>{{data.area}}</span>
            </li>
            <li>
              <img alt="寒舍" src="@/assets/img/icon-car.png" style="position:relative;left: -2px;">
              <span>接机</span>
              <span>{{data.isAirport===1?'包含':'不包含'}}</span>
            </li>
            <li>
              <img alt="寒舍" src="@/assets/img/icon-breakfast.png">
              <span>早餐</span>
              <span>{{data.isBreakfast===1?'包含':'不包含'}}</span>
            </li>
            <li>
              <img alt="寒舍" src="@/assets/img/canting-tianchong.png">
              <span>餐厅</span>
              <span>{{data.restaurant?data.restaurant:'无'}}</span>
            </li>
            <li>
              <img alt="寒舍" src="@/assets/img/zhuang.png">
              <span>充电桩</span>
              <span>{{data.charge?data.charge:'无'}}</span>
            </li>
          </ul>
          <div class="content">
            {{data.content}}
          </div>
        </div>
      </div>
    </div>
    <div class="tips">
      <div class="left">
        <div style="margin-right:26%;"><span>
          <img alt="寒舍" src="@/assets/img/bed.png">
          {{data.bedType}}
        </span></div>
        <div><span>是否可取消：{{data.isCancelTime ? '' : '不'}}可取消</span></div>
      </div>
      
      <div class="btnContainer">
        <div><span>标准入住人数：{{data.residence}}</span></div>
        <div>
          <span style="color:#FF7044;">￥</span>
          <span class="price">{{data.relPrice}}<span style="color:#8D8D8D;font-size:14px;margin-left:5px;font-weight:normal">起</span></span>
          <button v-if="data.status===1" style="background-color: #ccc;">满房 Full</button>
          <button v-else @click="toBook">预定 Booking</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: ()=> {
        return {}
      }
    }
  },
  methods: {
    toBook(){
      this.$router.push(`/bookDetail?id=${this.data.id}&hid=${this.data.hotelId}`)
    }
  }
}
</script>

<style scoped lang="less">
@import '../../assets/less/common.less';
.wrapper{
  border-bottom: 1px dashed #8D8D8D;
  width: 62.5%;
  margin: 30px auto;
  color: @color;
  .mainWrapper{
    display: flex;
    &>img{
      width: 503px;
      height: 260px;
      margin-right: 34px;
      object-fit: cover;
    }
    .mainContent{
      flex: 1;

      .title{
        font-size: 32px;
        font-weight: bolder;
      }
      .time{
        font-size: 14px;
        color: #8D8D8D;
        border-bottom: 1px solid #8D8D8D;
        margin-bottom: 10px;
        padding: 10px 0;
      }
      .intro{
        font-size: 14px;
        color: #8D8D8D;
        display: flex;
        ul{
          width: 190px;
          list-style: none;
          padding: 0;
          margin: 0;
          li{
            line-height: 36px;
            img{
              width: 18px;
              margin-right: 10px;
            }
            span{
              margin-right: 4px;
            }
          }
        }
        .content{
          flex: 1;
          margin-left: 10px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 7;
          overflow: hidden;
        }
      }
    }
  }
  .tips{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    .left{
      display: flex;
      width: 503px;
      margin-right:34px;
      align-items: center;
      span{
        font-size: 16px;
        color: #8D8D8D;
        img{
          width: 34px;
          height: 22px;
          margin-right: 30px;
        }
      }
    }
    .btnContainer{
      flex: 1;
      font-size: 16px;
      font-size: 16px;
      color: #8D8D8D;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .price{
        font-size: 32px;
        color: #FF7044;
        font-weight: bold;
        padding: 0px 18px 0px 1px;
      }
      button{
        background-color: #FF7044;
        color: #fff;
        font-size: 18px;
        padding: 0 15px;
        // padding: 4px 8px;
        height: 46px;
        border-radius: 8px;
        border: 0;
        position: relative;
        top: -10px;
        cursor: pointer;
      }
    }
  }
}
</style>

