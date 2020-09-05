<template>
  <div class="cardList">
    <div class="card" v-for="item in card" :key="item.id">
      <img alt="寒舍" class="bg-img" src="@/assets/img/cardBg.png"/>
      <div class="name">{{item.comboName}}</div>
      <div class="detail">
        <span>卡号：{{item.cardNumber}}</span>
        <button @click="toPackage(item.comboId)">查看详情</button>
        <button @click="showCardDetail(item.id)">使用记录</button>
      </div>
      <!-- 已过期 -->
      <img alt="寒舍" v-show="item.status == -2"  class="tip-img" src="@/assets/img/expired.png">
      <!-- 已使用 -->
      <img alt="寒舍" v-show="item.status == 2"  class="tip-img" src="@/assets/img/used.png">
    </div>
    <a-pagination style="width: 100%;" v-model="page" :defaultPageSize="size" :total="total" @change="changePage" />
    <!-- 卡片 -->
    <div class="page" v-if="showCard">
      <div class="singleCard">
        <a-icon type="close-circle" @click="showCard=false" />
        <img alt="寒舍" src="@/assets/img/cardBg.png"/>
        <div class="cardTitle">有效期：{{singleCard.validityDate}}</div>
        <div class="cardContent">
          <div>
            <span>使用次数</span>
            <span>已使用次数</span>
            <span>可使用次数</span>
          </div>
          <div>
            <span>{{singleCard.canUseNumber}}次</span>
            <span>{{singleCard.useNumber}}次</span>
            <span>{{singleCard.number}}次</span>
          </div>
        </div>
        <div class="cardTitle">使用历史</div>
        <div class="cardContent">
          <div>
            <span>使用时间</span>
            <span>使用城市</span>
            <span>使用目的地</span>
          </div>
          <div v-if="singleCard.use.length===0">无</div>
          <div v-for="(item,idx) in singleCard.use" :key="idx">
            <span>{{item.time}}</span>
            <span>{{item.cityName}}</span>
            <span>{{item.hotelName}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      card: [],
      singleCard: {},
      showCard: false,
      page: 1,
      size: 6,
      total: 1
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let { data } = await this.$axios.post(
        `/api/getCard?page=${this.page}&size=${this.size}`
      );
      console.log(data);
      if (data.errcode === 0 && data.data) {
        this.total = data.count
        this.card = data.data;
      }
    },
    changePage(page){
      this.page = page
      this.getData()
    },
    toPackage(id) {
      this.$router.push("/packageDetail?id=" + id + "&nopay=true");
    },
    showCardDetail(id) {
      this.$axios.post("/api/getUseRecord?id=" + id).then(({ data }) => {
        data.number = data.canUseNumber - data.useNumber;
        data.validityDate = this.common.validityDate(
          data.buyTime,
          data.vaildity
        );
        data.use.forEach(item => {
          item.time = this.common.formatDate(item.createTime);
        });
        this.singleCard = data;
        this.showCard = true;
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
.cardList {
  display: flex;
  flex-wrap: wrap;
  // width: 1000px;
  // padding: 22px;
  // border: 1px solid rgba(69, 75, 108, 0.15);
  
  .card {
    width: 450px;
    height: 142px;
    border-radius: 4px;
    overflow: hidden;
    margin: 0px 15px 10px 0;
    position: relative;
    .bg-img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }
    .tip-img{
      position: absolute;
      top: 0;
      right: 0;
      width: 98px;
      height: 98px;
      z-index: -1;
    }
    .name {
      font-size: 23px;
      color: #fff;
      font-weight: bolder;
      margin: 26px 18px;
    }
    .detail {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #fff;
      margin: 0 18px;
      span {
        flex: 1;
      }
      button {
        background-color: rgba(0, 0, 0, 0.5);
        padding: 4px 8px;
        font-size: 12px;
        color: #fff;
        border-radius: 16px;
        border: 1px solid #cacaca;
        transform: scale(0.8);
      }
    }
  }
}
.page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
  .singleCard {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    width: 460px;
    color: @color;
    text-align: center;
    font-size: 16px;
    i {
      position: absolute;
      top: -25px;
      right: -25px;
      font-size: 25px;
      color: #fff;
    }
    img {
      width: 100%;
    }
    .cardTitle {
      margin: 12px auto;
      border: 1px solid @color;
      padding: 6px 10px;
      border-radius: 10px;
      display: inline-block;
      text-align: center;
    }
    .cardContent {
      padding-bottom: 20px;
      & > div {
        display: flex;
        justify-content: space-around;
        text-align: center;
        span {
          line-height: 26px;
        }
      }
    }
  }
}
</style>

