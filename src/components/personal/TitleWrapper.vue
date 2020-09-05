<template>
  <div class="typeWrapper">
    <div
      v-for="(title,idx) in data"
      :key="idx"
      :class="idx===actived?'selected':''"
      @click="changeType(idx)"
    >
      {{title}}
      <div class="border" v-if="idx===actived"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: []
    },
    actived: {
      type: Number,
      default: 0
    }
  },
  methods: {
    changeType(idx){
      this.$emit('change', idx);
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
.typeWrapper{
  border-bottom: 1px solid rgba(141,141,141,0.4);
  font-size: 20px;
  padding: 10px 20px;
  div{
    display: inline-block;
    margin-right: 20px;
    position: relative;
    cursor: pointer;
    .border{
      border-bottom: 4px solid @color;
      width: 30px;
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translate(-50%);
    }
  }
  .selected{
    color: @color;
    font-weight: bold;
  }
}
</style>

