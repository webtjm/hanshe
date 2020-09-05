<template>
  <div>
    <img alt="寒舍" class="fullImg" :src="banner">
    <SecTitle title="全部活动" english="All activities" :noBottom="true" />
    <FilterForm @filter="filterEvent" @clear="getAll" />
    <div class="wrapper">
      <div class="activity" v-for="item in data" :key="item.id">
        <img alt="寒舍" :src="imgUrl+item.picture">
        <div class="detail">
          <div class="title">{{item.activityName}}</div>
          <div class="content">{{item.activityIntroduction}}</div>
        </div>
        <div class="detailBtn" @click="toDetail(item.id)">查看详情</div>
      </div>
    </div>
    <a-pagination
      showQuickJumper
      :defaultPageSize="size"
      :defaultCurrent="page"
      :total="total"
      @change="onChange"
    />
  </div>
</template>

<script>
import SecTitle from "@/components/public/SecTitle";
import FilterForm from "@/components/form/Filter";
import Pagination from "@/components/home/Pagination";
export default {
  data(){
    return{
      banner: '',
      data: [],
      page: 1,
      size: 5,
      total: 1
    }
  },
  async mounted(){
    this.getAll()
    let {data} = await this.$axios.post('/api/getBanner?sequence=5')
    this.banner = this.imgUrl+data.data.picture
  },
  methods: {
    getAll(){
      var params = {
        page: this.page,
        size: this.size
      }
      this.$axios.post('/api/getAllActivity', params).then(({data})=> {
        if(data.errcode===0){
          this.data = data.data
          this.total = data.count
        }
      }).catch(err => {
      })
    },
    toDetail(id){
      this.$router.push('/eventDetail?id='+id)
    },
    filterEvent(obj){
      let {city, hotel} = obj
      this.page = 1
      var params = {
        page: this.page,
        limit: this.size,
        hotelName: hotel
      }
      this.$axios.post('/api/getAllActivity', params).then(({data}) => {
        if(data.errcode===0){
          if(data.data.length>0){
            this.data = data.data
          }else{
            this.$message.info('暂无筛选结果，请重新筛选')
          }
        }
      })
    },
    onChange(page) {
      this.page = page;
      this.getAll();
    }
  },
  components: {
    SecTitle,
    FilterForm,
    Pagination
  }
};
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
.wrapper {
  margin-top: 40px;
  .activity {
    display: flex;
    margin: 23px auto 0;
    width: 62.5%;
    img {
      object-fit: cover;
      width:501px;
      height:264px;
      border-radius: 8px;
    }
    .detailBtn{
      cursor: pointer;
    }
    .detail {
      flex: 1;
      margin: 0 40px;
      color: @color;
      .title {
        font-size: 28px;
        font-family: hanzhen;
        margin-bottom: 40px;
      }
      .content {
        font-size: 16px;
        line-height: 30px;
      }
    }
  }
}
</style>

