<template>
  <div>
    <img alt="寒舍" class="fullImg" :src="banner">
    <SecTitle title="热门目的地" english="Destination" :more="true"/>
    <Hot :data="hotHotel"/>
    <SecTitle title="全部目的地" english="Check All"/>
    <div class="box" v-for="item in data" :key="item.id">
      <ImgSwiper :img="item.imgs" />
      <div class="detail">
        <div class="big">Destination</div>
        <div class="border"></div>
        <div class="big">{{item.name}}</div>
        <div class="middle">{{item.eName}}</div>
        <div class="listWrapper">
          <div class="list">
            <i class="iconfont">&#xe604;</i>
            <span>房型</span>
            {{item.houseName?item.houseName:'无'}}
          </div>
          <div class="list">
            <i class="iconfont">&#xe60e;</i>
            <span>特色</span>
            {{item.characteristic?item.characteristic:'无'}}
          </div>
          <div class="list">
            <i class="iconfont">&#xe60c;</i>
            <span>乐享</span>
            {{item.comboName?item.comboName:'无'}}
          </div>
          <div class="list">
            <i class="iconfont">&#xe765;</i>
            <span>美食</span>
            {{item.food?item.food:'无'}}
          </div>
        </div>
        <div class="tips">
          {{item.sketch}}
        </div>
      </div>
      <div class="detailBtn" @click="linkTo(item.id)">
        预 订
        <div class="en">Reservations</div>
      </div>
    </div>
    <a-pagination
      showQuickJumper
      :defaultPageSize="size"
      :defaultCurrent="page"
      :total="total"
      @change="onChange" />
  </div>
</template>

<script>
import SecTitle from "@/components/public/SecTitle";
import Hot from "@/components/home/Hot";
import ImgSwiper from "@/components/home/ImgSwiper";
export default {
  data() {
    return {
      banner:'',
      hotHotel: [],
      page: 1,
      size: 5,
      total: 1,
      data: []
    };
  },
  async created(){
    // 热门目的地的接口
    this.hotHotel = await this.getHot('/api/getHotel');
    // 获取所有目的地
    this.getData()
    let {data} = await this.$axios.post('/api/getBanner?sequence=2')
    this.banner = this.imgUrl+data.data.picture
  },
  methods: {
    async getHot(url){
      let {data} = await this.$axios.get(url);
      if(data.errcode === 0){
        return data.data
      }else{
        this.$message.info(data.errmsg);
        return []
      }
    },
    async getData(){
      let page = this.page,
          size = this.size;
      let { data } = await this.$axios.post(`/api/getAllHotel?page=${page}&size=${size}`)
      // let { data } = await this.$axios.get('/api/getAllHotel', {
      //   params: {
      //     page: page,
      //     size: size
      //   }
      // })
      if(data.errcode === 0){
        this.data = data.data;
        this.data.forEach((item) => {
          item.imgs = item.pictureUrl.split(',')
          if(item.imgs.length>=4){
            item.imgs = item.imgs.splice(0,4)
          }
        })
        this.total = data.count;
      } else {
        this.$message.info(data.errmsg)
      }
    },
    onChange(page) {
      this.page = page;
      this.getData();
    },
    linkTo(id){
      this.$router.push(`/singleStore?id=${id}`);
    },
  },
  components: {
    SecTitle,
    Hot,
    ImgSwiper
  }
};
</script>

<style lang="less" scoped>
@import "../assets/less/common.less";
@media screen and (max-width: 1000px) {
  .en{
    display: none;
  }
}
.detailBtn{
  cursor: pointer;
}
.box {
  display: flex;
  width: 70%;
  margin: 0 auto;
  margin-bottom: 45px;
  .imgWrapper {
    width: 500px;
    & > img {
      width: 500px;
      height: 268px;
      object-fit: cover;
      border-radius: 8px;
    }
    .smallImg {
      display: flex;
      justify-content: space-between;
      img {
        width: 118px;
        height: 93px;
        object-fit: cover;
        border-radius: 8px;
        margin-top: 8px;
      }
    }
  }
  .detail {
    margin: 0 30px;
    color: @color;
    flex: 1;
    .big {
      font-size: 22px;
      font-family: hanzhen;
    }
    .border {
      .litterBorder();
      margin-top: 8px;
      margin-bottom: 8px;
    }
    .middle {
      font-size: 18px;
    }
    .listWrapper {
      margin-top: 10px;
      .list {
        font-size: 14px;
        color: @color;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        span {
          padding: 0 10px;
        }
      }
    }
    .tips {
      font-size: 16px;
      font-weight: 500;
      color: @color;
      opacity: 0.7;
      margin-top: 6px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
      overflow: hidden;
    }
  }
}
</style>
