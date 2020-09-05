<template>
  <a-carousel arrows dotsClass="slick-dots slick-thumb">
    <a slot="customPaging" slot-scope="props">
      <img alt="寒舍" :src="imgUrl+img[props.i]" />
    </a>
    <div v-for="item in img" :key="item">
      <img alt="寒舍" :src="imgUrl+item" />
    </div>
  </a-carousel>
</template>
<script>
export default {
  props: {
    img: {
      type: Array,
      default: ()=> {
        return []
      }
    }
  }
};
</script>
<style scoped>
/* For demo */
.ant-carousel{
  width: 500px;
  height: 370px;
}
.ant-carousel >>> .slick-dots {
  height: auto;
}
.ant-carousel >>> .slick-slide img {
  display: block;
  margin: auto;
  width: 500px;
  height: 268px;
  border-radius: 8px;
}
.ant-carousel >>> .slick-thumb {
  bottom: -93px;
}
.ant-carousel >>> .slick-thumb li {
  width: 121px;
  height: 93px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  border: 2px solid #3A257B;
}
</style>
