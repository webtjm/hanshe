<template>
  <div class="pagination">
    <span>上一页</span>
    <span
      v-for="item in total"
      :key="item"
      :class="item===page?'active':''"
    >{{item}}</span>
    <span>下一页</span>
    <span>共{{total}}页</span>
    到
    <span>{{page}}</span>
    页
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 1
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
.pagination {
  margin-bottom: 65px;
  margin-top: 86px;
  text-align: center;
  color: @color;
  span{
    display: inline-block;
    text-align: center;
    min-width: 40px;
    height: 40px;
    line-height: 40px;
    padding: 0 9px;
    font-size:14px;
    color:rgba(141,141,141,1);
    border: 1px solid #f2f2f2;
    border-radius: 4px;
    margin: 0 7px;
  }
  .active{
    background-color: @color;
    color: #fff;
    border: 1px solid @color;
  }
}
</style>
