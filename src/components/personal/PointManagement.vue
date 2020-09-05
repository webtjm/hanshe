<template>
  <div class="container">
    <div class="title">
      当前积分：
      <span>{{total_integrals}}</span>
      分
    </div>
    <a-table :columns="columns" :dataSource="integrals" :pagination="pagination"
          :rowKey="record => record.id"
          @change="changePage">
      <span slot="count" class="count" slot-scope="text">
        {{text}}
      </span>
    </a-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        {
          title: "时间",
          dataIndex: "createTime",
          key: "createTime"
        },
        {
          title: "类型",
          dataIndex: "integralType",
          key: "integralType",
          slots: { title: "integralType" },
          scopedSlots: { customRender: "integralType" }
        },
        {
          title: "积分数",
          dataIndex: "integral",
          key: "integral",
          slots: { title: "integral" },
          scopedSlots: { customRender: "integral" }
        }
      ],
      integrals: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      total_integrals: ''
    };
  },
  created(){
    this.getIntergral()
  },
  methods: {
    async getIntergral(){
      let {data} = await this.$axios.get('/api/integral/findAll',{
        params: {
          page: this.pagination.current,
          size: this.pagination.pageSize
        }
      })
      if(data.errcode === 0 && data.data){
        data.data.forEach(item => {
          item.createTime = this.common.formatDate(item.createTime)
        })
        this.integrals = data.data
        this.pagination.total = data.count
        this.total_integrals = data.total_integrals
        
      }
    },
    changePage(e){
      this.pagination = e
      this.getIntergral()
      // this.pagination.current = 
      // this.pagination.pageSize = 10
    },
  }
};
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
.container {
  flex: 1;
  margin-left: 43px;
  border: 1px solid rgba(69, 75, 108, 0.15);
  font-size: 16px;
  color: #484848;
  padding: 24px 33px;
  min-width: 400px;
  .title {
    margin-bottom: 38px;
    font-size: 16px;
    color: #8d8d8d;
    span {
      color: #ff7044;
      font-size: 24px;
      font-weight: bold;
    }
  }
  .ant-table-thead{
    tr{
      th{
        background-color: #EBEDF2;
        color: @color;
        padding: 9px;
        text-align: center;
      }
    }
  }
  .ant-table-body{
    tr{
      td{
        text-align: center;
      }
    }
  }
  .count {
    font-size: 16px;
    color: #ff7044;
  }
}
</style>


