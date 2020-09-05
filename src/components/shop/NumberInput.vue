<template>
  <div>
    <div class="number-input-content">
      <span class="btn-reduce" @click="_onReduceTap()">
        <img class="icon" src="@/assets/img/icon-reduce.png" alt="寒舍">
      </span>
      <input class="input-number" :value="currentNum" type="number" readonly>
      <span class="btn-add" @click="_onAddTap()">
        <img class="icon" src="@/assets/img/icon-add.png" alt="寒舍">
      </span>
    </div>
  </div>
</template>

<script>
/**
 * 数量控制器组件
 */
export default {
  data() {
    return {
      currentNum:1
    };
  },
  props: {
    num: {
      type: Number,
      default: () => {
        return 1;
      }
    }
  },
  created () {
    this.currentNum = this.num
  },
  methods: {
    /**
     * 减少数量
     */
    _onReduceTap() {
      var currentNum = this.currentNum;
      if (currentNum > 1) {
        this.currentNum = parseInt(this.currentNum) - 1;
      }
    },
    /**
     * 增加数量
     */
    _onAddTap() {
      this.currentNum = parseInt(this.currentNum) + 1;
    }
  }
};
</script>

<style lang="less" scoped>
.number-input-content {
  display: flex;
  align-items: center;
  .btn-add {
    width: 31px;
    height: 33px;
    line-height: 31px;
    border-radius: 0px 4px 4px 0px;
    background-color: rgba(245, 247, 250, 1);
    text-align: center;
    border: 1px solid rgba(216, 220, 230, 1);
    cursor: pointer;
  }
  .btn-reduce {
    width: 31px;
    height: 33px;
    line-height: 31px;
    border-radius: 4px 0px 0px 4px;
    background-color: rgba(245, 247, 250, 1);
    text-align: center;
    border: 1px solid rgba(216, 220, 230, 1);
    cursor: pointer;
  }
  .input-number {
    height: 33px;
    border: 1px solid #eeeeee;
    border-left: 0;
    border-right: 0;
    text-align: center;
    color: rgba(16, 16, 16, 1);
    width: 68px;
    padding-left: 12px;
  }
  .icon {
    width: 12px;
    height: 12px;
  }
}
</style>