<template>
  <div>
    <img alt="寒舍" class="fullImg" :src="banner">
    <SecTitle title="全部套餐" english="All packages" :noBottom="true" />
    <PackageSort @sort="sortPackage" @clear="clear" />
    <div class="wrapper">
      <PackageWrapper v-for="item in data" :key="item.id" :data="item" @link="toDetail" />
    </div>
    <a-pagination
      showQuickJumper
      :defaultPageSize="limit"
      :defaultCurrent="page"
      :total="total"
      @change="onChange"
    />
  </div>
</template>

<script>
import SecTitle from '@/components/public/SecTitle'
import PackageSort from '@/components/form/PackageSort'
import PackageWrapper from '@/components/detail/PackageWrapper'

export default {
  data(){
    return{
      banner: '',
      data: [],
      page: 1,
      limit: 5,
      total: 1
    }
  },
  async mounted(){
    this.getAll();
    let {data} = await this.$axios.post('/api/getBanner?sequence=4')
    this.banner = this.imgUrl+data.data.picture
  },
  methods: {
    async getAll(){
      var params = {
        page: this.page,
        limit: this.limit
      }
      let {data} = await this.$axios.post('/api/getAllCombo', params)
      if(data.errcode===0){
        this.data = data.data
        this.total = data.count
      }
    },
    async sortPackage(obj){
      console.log('sss')
      this.page = 1
      this.limit = 5
      let {city, usageDay, peopleNumber, price1, price2, comboType, hotel, promotion} = obj
      var params = {
        city,
        hotelName: hotel,
        top: promotion,
        type: comboType,
        minPrice: price1,
        maxPrice: price2,
        peopleNumber
      }
      this.$axios.post('/api/getAllCombo', params).then(({data}) => {
        if(data.errcode===0 && data.data.length>0){
          this.data = data.data
        }else{
          this.$message.info('没有结果，请重新筛选')
        }
      })
    },
    toDetail(id){
      this.$router.push('/packageDetail?id='+id)
    },
    clear(){
      this.page = 1
      this.limit = 5
      this.getAll()
    },
    onChange(page) {
      this.page = page;
      this.getAll();
    }
  },
  components: {
    SecTitle,
    PackageSort,
    PackageWrapper
  }
}
</script>

<style lang="less" scoped>
.wrapper{
  width: 68.5%;
  margin: 46px auto;
}
</style>

