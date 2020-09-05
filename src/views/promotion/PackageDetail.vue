<template>
  <div>
    <div class="breadCrumb">
      <a-breadcrumb>
        <a-breadcrumb-item>当前位置：</a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link to="/">HANSHE HOTEL</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link to="/discountPackage">优惠套餐</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item class="actived">{{data.name}}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <BuyContainer :data="data" :list="list" :nopay="nopay" />
    <CopyWriting :text="data.details" />
  </div>
</template>

<script>
import BuyContainer from "@/components/detail/BuyContainer";
import CopyWriting from "@/components/detail/CopyWriting";
export default {
  data() {
    return {
      data: {},
      list: [],
      nopay: false
    };
  },
  async mounted() {
    let { id,nopay } = this.$route.query;
    this.nopay = nopay
    let { data } = await this.$axios.post("/api/getComboInfo?id="+id);
    if(data.errcode===0){
      data.data.time = this.common.formatDate(data.data.createTime)
      this.data = data.data;
      // let hotel = data.hotelName
      
      this.list = [{
        title: '使用酒店',
        content: this.data.hotelName
      },{
        title: '有效天数',
        content: this.data.vaildity+'天'
      },{
        title: '使用次数',
        content: this.data.useNumber+'次'
      },{
        title: '使用人数',
        content: this.data.peopleNumber+'人'
      }]
    }
  },
  components: {
    BuyContainer,
    CopyWriting
  }
};
</script>

<style>
</style>
