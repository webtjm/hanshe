<template>
  <div class="copyWriting">
    <div v-html="text"></div>
    <!-- <img :src="img" alt=""> -->
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.copyWriting{
  display: flex;
  width: 70%;
  margin: 70px auto;
  div{
    flex: 1;
    margin-right: 30px;
    font-size:16px;
    color: #8d8d8d;
    line-height:30px;
  }
  img{
    width: 462px;
    height: 288px;
  }
}
</style>

