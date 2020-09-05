<template>
  <div class="page" @click="close">
    <div class="model" @click.stop="">
      <div class="content">是否取消该订单？</div>
      <div class="btnWrapper">
        <button>是</button>
        <button class="high">否</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    close(){
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
.page{
  background-color: rgba(0,0,0,0.4);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  .model{
    background-color: #fff;
    margin: 20% auto;
    width: 460px;
    padding: 20px 38px;
    .content{
      text-align: center;
      font-size: 20px;
      color: #484848;
      padding: 20px 0;
    }
    .btnWrapper{
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      button{
        width: 168px;
        height: 38px;
        font-size: 18px;
        color: #CACACA;
        border:1px solid rgba(69, 75, 108, 0.15);
        border-radius: 8px;
        background-color: #fff;
        outline: 0;
      }
      .high{
        color: #fff;
        background-color: @color;
      }
    }
  }
}
</style>

