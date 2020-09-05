<template>
  <div>
    <Swiper :data="swiper" />
    <!-- 客房预订 -->
    <SecTitle title="客房预订" english="Booking" />
    <OrderForm @change="toReserve" />
    
    <!-- 热门目的地 -->
    <SecTitle title="热门目的地" english="Destination" url="/destination" :more="true" />
    <Hot :data="hotHotel" />
    <!-- 乐享套餐 -->
    <!-- <SecTitle title="乐享套餐" english="Enjoy" :more="true" url="/promotion" />
    <PackageMore :data="hotPackage" :first="hotFirst" /> -->
    <!-- 餐厅美食 -->
    <!-- <SecTitle title="餐厅美食" english="Food" url="/food" />
    <Food :data="foods" /> -->
    <!-- 休闲娱乐 -->
    <SecTitle title="休闲娱乐" english="Leisure and entertainment" url="/entertainment" :more="true" />
    <Entermainment :data="entertainment" />
    <!-- 活动举办 -->
    <SecTitle title="活动举办" english="Events" :more="true" url="/event" />
    <CardSwiper :data="events" @link="toEvent" />
    <!-- 商店 -->
    <!-- <SecTitle title="商店" english="Shop" :more="true" url="/shop" />
    <CardSwiper /> -->
    <img src="@/assets/img/banner2.png" class="fullImg" alt="关于寒舍">
    <SecTitle title="更多优惠" english="Promotion" :more="true" url="/activity" />
    <MoreImg :data="promotion" @link="toOffers" />
  </div>
</template>

<script>
import SecTitle from '@/components/public/SecTitle'
import Swiper from '@/components/home/Swiper'
import OrderForm from '@/components/form/Order'
import Hot from '@/components/home/Hot'
import PackageMore from '@/components/detail/PackageMore'
import Entermainment from '@/components/home/Entermainment'
import Food from '@/components/home/Food'
import CardSwiper from '@/components/home/CardSwiper'
import MoreImg from '@/components/home/MoreImg'
import { constants } from 'crypto';
export default {
  data(){
    return{
      swiper: [],
      province: '',
      city: '',
      date: [],
      days: 0,
      hotHotel: [],
      entertainment: [],
      foods: [],
      hotFirst: [],
      hotPackage: [],
      promotion: [],
      events: []
    }
  },
  created(){
    (async () => {
      // 轮播图
      this.swiper = await this.postData('/api/getPicture?type=0')
      // 热门目的地的接口
      this.hotHotel = await this.getData('/api/getHotel');
      // 休闲娱乐
      this.entertainment = await this.getData('/api/article/findAll', {
        type: 2,
        size: 4
      })
      // 餐厅美食
      this.foods = await this.getData('/api/article/findAll',{
        type: 1,
        size: 3
      })
      // 更多优惠
      this.promotion = await this.getData('/api/article/findAll',{
        type: 3,
        size: 8
      })
      // 获取活动
      this.events = await this.postData('/api/getTopActivity')
      // 乐享套餐
      this.hotPackage = await this.postData('/api/getTopCombo')
      // 乐享套餐的第一
      if(this.hotPackage.length>0) {
        this.hotFirst = this.hotPackage.splice(0,1)
      }
      
    })();
  },
  methods:{
    async getData(url, params){
      let {data} = await this.$axios.get(url, {params});
      if(data.errcode === 0){
        return data.data
      }else{
        this.$message.info(data.errmsg);
        return []
      }
    },
    async postData(url, params){
      let {data} = await this.$axios.post(url, params);
      if(data.errcode === 0){
        return data.data
      }else{
        this.$message.info(data.errmsg);
        return []
      }
    },
    toReserve(){
      this.$router.push({path: '/reservations'})
    },
    toEvent(id){
      this.$router.push({path: '/eventDetail?id='+id})
    },
    toOffers(id){
      this.$router.push(`/articleDetail?id=${id}&type=2`);
    }
  },
  components: {
    SecTitle,
    Swiper,
    Hot,
    Food,
    CardSwiper,
    OrderForm,
    PackageMore,
    MoreImg,
    Entermainment
  }
}
</script>

<style lang="less" scoped>
.fullImg{
  margin-top: 78px;
}

</style>

