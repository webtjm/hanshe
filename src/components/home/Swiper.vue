<template>
  <a-carousel :autoplay="true" :autoplaySpeed="3000" arrows dotsClass="slick-dots slick-thumb">
    <a slot="customPaging" slot-scope="props">
      <div class="custom-dot"></div>
    </a>
    <div
      slot="prevArrow" slot-scope="props"
      class="custom-slick-arrow"
      style="left: 5%;zIndex: 1"
    >
      <img src="@/assets/img/icon-left.png" alt="">
    </div>
    <div
      slot="nextArrow" slot-scope="props"
      class="custom-slick-arrow"
      style="right: 5%"
    >
      <img src="@/assets/img/icon-right.png" alt="">
    </div>
    <div v-for="(item,idx) in data" :key="idx" @click="linkTo(item.id)">
      <img :src="imgUrl+item.picture" alt="">
    </div>
  </a-carousel>
</template>
<script>
export default {
  props: {
    data: {
      default: ()=> {
        return []
      },
      type: Array
    }
  },
  methods: {
    linkTo (id) {
      if(id==23){
        this.$router.push('./aboutHaien')
      }else if(id==22){
        this.$router.push('./familyFarm')
      }else{
        return
      }
    }
  },
}
</script>
<style scoped>
/* For demo */
.ant-carousel >>> .slick-slide {
  height: 928px;
  overflow: hidden;
}
.ant-carousel >>> .slick-thumb {
  bottom: 120px;
}
.ant-carousel >>> .slick-thumb li div{
  width: 16px;
  height: 16px;
  background-color: #979184;
  border: 3px solid #fff;
  border-radius: 16px;
  margin: 0 8px;
}

.ant-carousel >>> .slick-thumb .slick-active div{
  background-color: #EFEEED;
}

.ant-carousel >>> .custom-slick-arrow img {
  width: 29px;
  height: 54px;
}
.ant-carousel >>> .custom-slick-arrow:before {
  display: none;
}
.ant-carousel >>> .custom-slick-arrow:hover {
  opacity: 0.5;
}

.ant-carousel >>> .slick-slide img {
  width: 100%;
  height: 928px;
  object-fit: cover;
}
</style>
