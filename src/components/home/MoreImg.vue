<template>
  <div class="img-wrap">
    <div class="img" v-for="(item,index) in data" :key="index">
      <img alt="寒舍" @click="toMore(item.id)" :src="imgUrl+item[imgName]">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return [1, 2, 3, 4, 5, 6, 7, 8];
      }
    },
    imgName: {
      type: String,
      default: "cover"
    }
  },
  computed: {
    formatData() {
      let arr = [];
      let data = this.data;
      data.forEach((item, index) => {
        const page = Math.floor(index / 4);
        if (!arr[page]) {
          arr[page] = [];
        }
        arr[page].push(item);
      });
      return arr;
    }
  },
  methods: {
    toMore(id) {
      this.$emit("link", id);
    }
  }
};
</script>

<style scoped>
.img-wrap{
  width: 71%;
  margin: 0 auto 83px;
  display: flex;
  flex-wrap: wrap;
}
.img{
  width: 25%;
  height: 0;
  padding-bottom: 25%;
  position: relative;
}
.img>img{
  position: absolute;
  left: 3%;
  width: 94%;
  height: 94%;
  object-fit: cover;
}
</style>

