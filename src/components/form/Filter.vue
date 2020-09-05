<template>
  <div class="form-wrap">
    <div class="form-content">
      <div class="box">
        <div class="name">城市</div>
        <div class="ename">City</div>
        <a-select
          showSearch
          placeholder=""
          size="large"
          optionFilterProp="children"
          style="width: 270px;"
          class="selection"
          @change="selectCity"
          :filterOption="filterOption"
          v-model="city"
        >
          <a-icon slot="suffixIcon" type="caret-down" />
          <a-select-option
            v-for="(item,idx) in citys"
            :key="idx"
            :value="item">{{item}}</a-select-option>
        </a-select>
      </div>
      <div class="box">
        <div class="name">目的地</div>
        <div class="ename">Destination</div>
        <a-select
          showSearch
          placeholder=""
          size="large"
          optionFilterProp="children"
          style="width: 270px;"
          class="selection"
          @change="selectPlace"
          :filterOption="filterOption"
          v-model="val"
        >
          <a-icon slot="suffixIcon" type="caret-down" />
          <a-select-option
            v-for="(item,idx) in list"
            :key="idx"
            :value="item.name">{{item.name}}</a-select-option>
        </a-select>
      </div>
      <a-button type="primary" @click="toFilter">筛选 Filter</a-button>
      <a-button @click="toClear">重置 Clear</a-button>
    </div>
  </div>
</template>

<script>
function formatObj(obj, key){
  return obj.map(item => {
    return item[key]
  })
}
export default {
  data(){
    return{
      citys: [],
      city: '',
      list: [],
      val: ''
    }
  },
  async created(){
    // 获取所有城市
    let { data } = await this.$axios.get("/api/getCity");
    if (data.errcode === 0 && data.data.length > 1) {
      this.citys = formatObj(data.data, "city");
    }
  },
  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    async selectCity(val){
      this.city = val;
      this.hotel = ''
      let hotel  =await this.$axios.post('/api/getHotelByCity?city='+this.city)
      if(hotel.data.errcode === 0 && hotel.data.data.length>0){
        this.list = hotel.data.data
        this.val = ''
      }else{
        this.$message.info('没有城市')
      }
    },
    selectPlace(val){
      this.val = val;
    },
    toFilter(){
      this.$emit('filter', {
        city: this.city,
        hotel: this.val
      })
    },
    toClear(){
      this.city = ''
      this.val = ''
      this.$emit('clear')
    }
  }
}
</script>

<style lang="less" scoped>
@import "./form.less";
.form-wrap{
  .form-content{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .box{
      margin: 0 10px;
    }
    button{
      height: 57px;
      margin: 0 10px;
    }
  }
}
</style>
