<template>
  <div>
    <img alt="寒舍" class="fullImg" :src="banner"/>
    <SecTitle title="全部美食" english="All Food" :noBottom="true" />
    <FilterForm @filter="filterEvent" @clear="refresh" />
    <div class="wrapper">
      <LookDetail v-for="(item,idx) in data" :data="item" :key="idx" @detail="toDetail" />
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
import LookDetail from "@/components/detail/LookDetail";
export default {
  data() {
    return {
      banner: '',
      type: 1,
      page: 1,
      size: 5,
      total: 1,
      data: [],
      hotel: '',
      icons: ['&#xe765;', '&#xe621;', '&#xe611;'],
      filter: false
    };
  },
  async mounted() {
    this.getData();
    let {data} = await this.$axios.post('/api/getBanner?sequence=6')
    this.banner = this.imgUrl+data.data.picture
  },
  methods: {
    async getData() {
      let { data } = await this.$axios.get("/api/article/findAll", {
        params: {
          type: this.type,
          page: this.page,
          size: this.size
        }
      });
      this.formatData(data);
    },
    getFilterData(){
      this.$axios
          .get("/api/article/findByDestination", {
            params: {
              typeId: this.type,
              page: this.page,
              size: this.size,
              hotelName: this.hotel
            }
          })
          .then(({ data }) => {
            this.formatData(data);
          });
    },
    filterEvent(obj) {
      let { city, hotel } = obj;
      this.filter = true;
      if (hotel) {
        this.page = 1;
        this.size = 5;
        this.hotel = hotel
        this.getFilterData()
      } else {
        this.$message.info('您还没有选择酒店')
      }
    },
    formatData(data) {
      if (data.errcode === 0) {
        this.data = data.data;
        this.total = data.count;
        this.data.forEach(item => {
          let date = new Date(item.createDate);
          item.time = this.common.formatDate(date);
          item.list = [
            {
              icon: this.icons[0],
              name: item.attributionsName[0],
              more: item.attributionsValue[0].split(",")
            },
            {
              icon: this.icons[1],
              name: item.attributionsName[1],
              more: item.attributionsValue[1].split(",")
            },
            {
              icon: this.icons[2],
              name: item.attributionsName[2],
              more: item.attributionsValue[2].split(",")
            }
          ];
          let f = item.characteristic;
          if (f.indexOf("，") !== -1) {
            item.special = f.split("，");
          } else if (f.indexOf(",") !== -1) {
            item.special = f.split(",");
          } else {
            item.special = f.split("/");
          }
        });
      }
    },
    toDetail(id) {
      this.$router.push(`/articleDetail?id=${id}&type=0`);
    },
    onChange(page) {
      this.page = page;
      if(this.filter === true){
        this.getFilterData()
      }else{
        this.getData();
      }
    },
    refresh(){
      this.filter = false
      this.page = 1
      this.getData();
    }
  },
  components: {
    SecTitle,
    FilterForm,
    Pagination,
    LookDetail
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  margin-top: 40px;
}
</style>

