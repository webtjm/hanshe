<template>
  <div class="titleWrapper" :class="noBottom?'noBottom':''">
    <div class="center">
      <div class="title">{{title}}</div>
      <div>{{english}}</div>
    </div>
    <div class="right" @click="toMore" v-if="more">
      More >>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '标题'
    },
    english: {
      type: String,
      default: 'Title'
    },
    more: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    },
    noBottom: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toMore(){
      console.log('12',this.url)
      if(this.url){
        this.$router.push(this.url)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
@import '../../assets/font/myFont.css';
.titleWrapper{
  padding: 50px 0;
  color: @color;
  position: relative;
  text-align: center;
  .center{
    font-size: 28px;
    .title{
      font-size: 24px;
      font-family: gongye;
    }
  }
  .right{
    position: absolute;
    top: 50%;
    right: 15%;
    font-size: 16px;
    font-family: hanzhenMin;
    font-weight: bold;
    cursor: pointer;
  }
}
.noBottom{
  padding: 50px 0 0;
}
</style>

