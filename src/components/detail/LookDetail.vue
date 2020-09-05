<template>
  <div class="activity">
    <DetailWrapper :data="data" />
    <div class="detailBtn" @click="toDetail(data.id)">查看详情</div>
  </div>
</template>

<script>
import DetailWrapper from '@/components/detail/DetailWrapper'
export default {
  props: {
    data: {
      type: Object,
      default: {
        title: "",
        special: [],
        time: "",
        list: [
          {
            icon: "",
            name: "",
            content: "",
            more: []
          }
        ]
      }
    }
  },
  methods: {
    toDetail(id){
      this.$emit('detail', id)
    }
  },
  components: {
    DetailWrapper
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
.activity {
  display: flex;
  margin: 23px auto 0;
  width: 62.5%;
}
</style>
