<template>
  <div>
    <div class="breadCrumb">
      <a-breadcrumb>
        <a-breadcrumb-item>当前位置：</a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link to="/">HANSHE HOTEL</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link to="/personal">个人中心</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link to="/personal/eventReservation">活动预订</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item class="actived">预订详情</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="main">
      <div class="detail">
        <div class="box">
          <span>预订编号：{{data.orderId}}</span>
          <span v-show="data.status===0">状态：待确认</span>
          <span v-show="data.status===1">状态：待完成</span>
          <span v-show="data.status===2">状态：已完成</span>
          <span v-show="data.status===-1">状态：已取消</span>
        </div>
        <a-card title="预订信息">
          <div class="line">
            <span>活动名称</span>
            <div>{{data.activityName}}</div>
          </div>
          <div class="line">
            <span>活动时间</span>
            <div>{{time}}</div>
          </div>
          <div class="line">
            <span>活动城市</span>
            <div>{{data.cityName}}</div>
          </div>
          <div class="line">
            <span>活动目的地</span>
            <div>{{data.hotelName}}</div>
          </div>
          <div class="line">
            <span>活动参与人数</span>
            <div>{{data.number}}人</div>
          </div>
          <div class="line">
            <span>联系人</span>
            <div>{{data.contacts}}</div>
          </div>
          <div class="line">
            <span>联系电话</span>
            <div>{{data.phone}}</div>
          </div>
          <!-- <div class="line">
            <span>使用城市</span>
            <div>{{data.cityName}}</div>
          </div> -->
          <div class="line">
            <span>邮箱</span>
            <div>{{data.email}}</div>
          </div>
        </a-card>
      </div>
      <div class="about">
        <img alt="寒舍" :src="imgUrl+activity.picture">
        <div class="name">
          {{activity.activityName}}
        </div>
        <div class="content" v-html="activity.activityIntroduction">
        </div>
        <span class="lookMore">查看更多</span>
      </div>
    </div>
  </div>
</template>

<script>
function formatDate(date) {
    let dd = new Date(date);
    return (
        dd.getFullYear() + "年" + (dd.getMonth() + 1) + "月" + dd.getDate() + "日"
    );
}
import moment from "moment"
export default({
  data(){
    return {
      id: '',
      data: {},
      activity: {},
      time: ''
    }
  },
  created(){
    let {id} = this.$route.query;
    this.id = id;
    this.getDetail()
  },
  methods: {
    async getDetail(){
      let {data} = await this.$axios.post('/api/getActivityOrderInfo?orderId='+this.id)
      if(data.errcode===0){
        this.data = data.data
        this.activity = data.activity
        this.time = moment(data.data.activityTime).format("YYYY年MM月DD日 hh:mm")
      }
    }
  }
})
</script>

<style lang="less" scoped>
@import "../assets/less/main.less";
</style>
