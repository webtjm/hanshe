<template>
  <div>
    <div class="breadCrumb">
      <a-breadcrumb>
        <a-breadcrumb-item>当前位置：</a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link to="/">HANSHE HOTEL</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link v-if="type==0" to="/food">美食</router-link>
          <router-link v-if="type==1" to="/entertainment">休闲娱乐</router-link>
          <router-link v-if="type==2" to="/activity">更多优惠</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item class="actived">{{data.title}}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="outDetail">
      <DetailWrapper :data="data" />
    </div>
    <CopyWriting :text="data.content" />
  </div>
</template>

<script>
import DetailWrapper from '@/components/detail/DetailWrapper';
import CopyWriting from '@/components/detail/CopyWriting';
export default {
  data(){
    return {
      data: {},
      type: 0,
      typeData: [{
        name: '全部美食',
        link: 'food',
        icons: ['&#xe765;', '&#xe621;', '&#xe611;']
      },{
        name: '全部休闲娱乐',
        link: 'entertainment',
        icons: ['&#xe646;', '&#xe642;', '&#xe614;']
      },{
        name: '更多优惠',
        link: 'activity',
        icons: ['&#xe743;', '&#xe943;', '&#xe615;']
      }]
    }
  },
  async created(){
    let {id, type} = this.$route.query
    this.type = type
    let {data} = await this.$axios.get('/api/article/view?id='+id)
    if(data.errcode===0){
      let res = data.data[0]
      let date = new Date(res.createDate)
      res.time = this.common.formatDate(date)
      res.list = [{
        icon: this.typeData[type].icons[0],
        name: res.attributionsName[0],
        more: res.attributionsValue[0].split(',')
      },{
        icon: this.typeData[type].icons[1],
        name: res.attributionsName[1],
        more: res.attributionsValue[1].split(',')
      },{
        icon: this.typeData[type].icons[2],
        name: res.attributionsName[2],
        more: res.attributionsValue[2].split(',')
      }]
      let f = res.characteristic;
      if (f.indexOf("，") !== -1) {
        res.special = f.split("，");
      } else if(f.indexOf(",") !== -1) {
        res.special = f.split(",");
      } else{
        res.special = f.split("/")
      }
      this.data = res
    }
  },
  components: {
    DetailWrapper,
    CopyWriting
  }
}
</script>

<style>
.outDetail{
  width: 70%;
  margin: 0 auto;
}
</style>
