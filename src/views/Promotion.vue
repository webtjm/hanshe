<template>
  <div>
    <img alt="寒舍" :src="banner" class="fullImg">
    <SecTitle title="热门套餐" english="Promotion" :more="true" />
    <PackageMore :data="promotion" :first="first"  />
    <SecTitle title="全部套餐" english="Promotion" :noBottom="true" />
    <PackageSort @sort="sortPackage" @clear="clear" />
    <div class="packageWrapper">
      <PackageWrapper v-for="item in data" :key="item.id" :data="item" @link="toDetail" />
    </div>
    <SecTitle title="推荐活动" english="Promotion" :more="true" url="/event" />
    <MoreImg :data="activity" imgName="picture" @link="toEvent" />
  </div>
</template>

<script>
import SecTitle from '@/components/public/SecTitle'
import PackageSort from '@/components/form/PackageSort'
import PackageMore from '@/components/detail/PackageMore'
import PackageWrapper from '@/components/detail/PackageWrapper'
import MoreImg from '@/components/home/MoreImg'
export default {
  data(){
    return{
      banner: '',
      data: [],
      promotion: [],
      first: [],
      activity: [],
      page: 1,
      size: 5,
      city: '',
      hotelName: '',
      top: '',
      type: ''
    }
  },
  async mounted(){
    this.getAll();
    this.getPromotion();
    this.getActivity();
    let {data} = await this.$axios.post('/api/getBanner?sequence=3')
    this.banner = this.imgUrl+data.data.picture
  },
  methods: {
    async getAll(){
      var params = {
        page: this.page,
        size: this.size
      }
      let {data} = await this.$axios.post('/api/getAllCombo', params)
      if(data.errcode===0){
        this.data = data.data
      }
    },
    async sortPackage(obj){
      this.page = 1
      this.size = 5
      var params = {
        city,
        hotelName: hotel,
        top: promotion,
        type: comboType,
        minPrice: price1,
        maxPrice: price2,
        peopelNumber
      }
      let {city, usageDay, peopleNumber, price1, price2, comboType, hotel, promotion} = obj
      this.$axios.post('/api/getAllCombo', params).then(({data}) => {
        if(data.errcode===0 && data.data.length>0){
          this.data = data.data
        }else{
          this.$message.info('没有结果，请重新筛选')
        }
      })
    },
    clear(){
      this.page = 1
      this.size = 5
      this.getAll()
    },
    async getPromotion(){
      let {data} = await this.$axios.post('/api/getTopCombo')
      if(data.errcode===0){
        this.promotion = data.data
        // 乐享套餐的第一
        this.first = this.promotion.splice(0,1)
      }
    },
    async getActivity(){
      let {data} = await this.$axios.post('/api/getTopActivity')
      if(data.errcode===0){
        this.activity = data.data
      }
    },
    toDetail(id){
      this.$router.push('/packageDetail?id='+id)
    },
    toEvent(id){
      this.$router.push({path: '/eventDetail?id='+id})
    }
  },
  components: {
    SecTitle,
    PackageSort,
    PackageMore,
    PackageWrapper,
    MoreImg
  }
}
</script>

.<style lang="less" scoped>
.packageWrapper{
  width: 68.5%;
  margin: 40px auto 0;
}
</style>

