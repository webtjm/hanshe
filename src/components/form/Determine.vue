<template>
  <div class="form-wrap">
    <div class="form-content">
      <div class="box">
        <div class="name">入住日期</div>
        <div class="ename">Check-in date</div>
        <a-date-picker
          size="large"
          @change="changeStart"
          v-model="starDay"
          :disabledDate="disabledStart">
          <i slot="suffixIcon" class="iconfont">&#xe6be;</i>
        </a-date-picker>
      </div>
      <div class="box">
        <div class="name">退房日期</div>
        <div class="ename">Check-out date</div>
        <a-date-picker
          size="large"
          @change="changeEnd"
           v-model="endDay"
          :disabledDate="disabledEnd">
          <i slot="suffixIcon" class="iconfont">&#xe6be;</i>
        </a-date-picker>
      </div>
      <div class="box">
        <div class="name">晚</div>
        <div class="ename">Nights</div>
        <div class="inp">
          <span>{{days}}</span>
        </div>
      </div>
      <a-button @click="determine" type="primary">确定修改 Determine</a-button>
    </div>
    
  </div>
</template>

<script>
import moment from "moment";
import {mapState, mapMutations} from 'vuex'
export default {
  data() {
    return {
      start: "",
      end: "",
      startDate: "",
      endDate: "",
      stayDay: null,
      endDay: null
    };
  },
  computed: {
    ...mapState('main', [
      'reData'
    ]),
    days() {
      let days = this.common.compareData([this.startDate, this.endDate]);
      if (days) {
        return days;
      } else {
        return 0;
      }
    }
  },
  created() {
    let { date, days } = this.reData;
    if(date && date[0] && date[1]){
      this.startDate = date[0];
      this.endDate = date[1];
      this.starDay = moment(date[0], "YYYY-MM-DD")
      this.endDay = moment(date[1], "YYYY-MM-DD")
      // this.start = moment(date[0], "YYYY-MM-DD");
      // this.end = moment(date[1], "YYYY-MM-DD");
    }else{
      this.startDate = this.common.today()
      this.endDate = this.common.tomorrow()
      this.starDay = moment()
      this.endDay = moment().add(1, 'days')
      // this.start = moment(this.startDate, "YYYY-MM-DD")
      // this.end = moment(this.endDate, "YYYY-MM-DD");
    }
  },
  methods: {
    ...mapMutations('main', [
      'setReData'
    ]),
    changeStart(val, str) {
      this.startDate = str;
      this.endDay = moment(val).add(1, 'days')
      this.endDate = moment(val).add(1, 'days').format('YYYY-MM-DD')
    },
    changeEnd(val, str) {
      this.endDate = str;
    },
    determine() {
      let data = this.reData;
      data.date = [this.startDate, this.endDate];
      data.days = this.days;
      this.setReData(data);
      this.$message.info('修改成功');
    },
    disabledStart(current) {
      // Can not select days before today and today
      // console.log(current)
      return current && current < moment().endOf('day');
    },
    disabledEnd(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day');
    }
  }
};
</script>

<style lang="less" scoped>
@import "./form.less";
.form-wrap{
  .form-content{
    display: flex;
    align-items: flex-end;
    button{
      margin-left: 18px;
      height: 57px;
    }
  }
}
</style>
