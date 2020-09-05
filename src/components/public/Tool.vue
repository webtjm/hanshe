<template>
  <div class="toolWrapper">
    <div>
      <a-back-top class="tool toTop" :visibilityHeight="0">
        <div class="ant-back-top-inner">
          <i class="iconfont">&#xe60d;</i>
          <div class="tra"></div>
        </div>
      </a-back-top>
      <div class="tool" @click="toHome">
        <i class="iconfont">&#xe612;</i>
      </div>
      <div class="tool">
        <i class="iconfont">&#xe626;</i>
        <img alt="寒舍" src="@/assets/img/ercode.jpg">
      </div>
      <div class="tool">
        <i class="iconfont">&#xe607;</i>
        <div class="tel">
          <span>010-81002222</span>
          <span>4008703070</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toHome() {
      this.$router.push("/");
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
@import "../../assets/less/iconfont.less";
.toolWrapper {
  position: fixed;
  right: 88px;
  bottom: 100px;
  display: flex;
  .tool {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.5);
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 30px;
    color: #fff;
    margin-bottom: 8px;
    position: relative;
    i {
      font-size: 24px;
    }
    img {
      display: none;
      width: 127px;
      height: 127px;
      // padding: 10px;
      background-color: #fff;
      border-radius: 8px;
      margin-right: 4px;
      margin-top: 50px;
      position: absolute;
      right: 50px;
      top: -50px;
    }
    .tel{
      display: none;
      width: 127px;
      // color: @color;
      font-size: 16px;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 1px;
      margin-right: 4px;
      margin-top: 50px;
      position: absolute;
      right: 50px;
      top: -50px;
      padding: 6px 0;
      span{
        display: block;
        line-height: 30px;
      }
    }
  }
  .tool:hover {
    img {
      display: block;
    }
    .tel{
      display: block;
    }
  }
  .toTop {
    height: 40px;
    position: relative;
    right: 0;
    top: 0;
    i {
      top: -12px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 30px;
    }
    .tra {
      position: absolute;
      top: -40px;
      width: 0;
      height: 0;
      border-top: 20px solid transparent;
      border-left: 24px solid transparent;
      border-right: 24px solid transparent;
      border-bottom: 20px solid rgba(0, 0, 0, 0.5);
      
    }
  }
}
</style>

