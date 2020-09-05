<template>
  <div>
    <img alt="寒舍" class="fullImg" :src="banner"/>
    <div class="wrapper">
      <OrderForm @change="onChange(1)" />
      <div class="box" v-for="item in data" :key="item.id">
        <img alt="寒舍" :src="imgUrl+item.picture"/>
        <div>
          <div class="detail">
            <div class="money">
              <span>RMB</span>
              {{item.price}}起
            </div>
            <div class="border"></div>
            <div class="name">{{item.name}}</div>
            <div class="address">
              <span>{{item.address}}</span>
              <span class="lookMap" @click="lookMap(item.address)">
                <i class="iconfont">&#xe603;</i>
                查看地图
              </span>
            </div>
            <div class="phone">{{item.phone}}</div>
          </div>
          <div class="detailBtn" @click="linkTo(item.id)">查看详情</div>
        </div>
      </div>
      <a-pagination
        showQuickJumper
        :defaultPageSize="size"
        :defaultCurrent="page"
        :total="total"
        @change="onChange"
      />
    </div>
  </div>
</template>

<script>
import OrderForm from "@/components/form/Order";
import {mapState} from 'vuex'
export default {
  data() {
    return {
      banner:'',
      data: [],
      page: 1,
      size: 5,
      total: 1
    };
  },
  async mounted() {
    
    this.getData();
    let {data} = await this.$axios.post('/api/getBanner?sequence=1')
    this.banner = this.imgUrl+data.data.picture
  },
  computed: {
    ...mapState('main', [
      'reData'
    ])
  },
  methods: {
    linkTo(id) {
      this.$router.push(`/singleStore?id=${id}`);
    },
    async getData() {
      let { city, province } = this.reData;
      city = city ? city : "";
      province = province ? province : "";
      var params = {
        page: this.page,
        limit: this.size,
        province,
        city
      }
      this.$axios.post('/api/getReHotel', params)
        .then(({data}) => {
          if (data.errcode === 0) {
            this.data = data.data;
            this.total = data.count;
          } else {
            this.$message.info(data.errmsg);
          }
        }).catch(err => {
          this.$message.info('服务器出错了')
        }) 
      
    },
    lookMap(address){
      window.open('http://map.baidu.com/?s=s%26wd%3D'+address)
    },
    onChange(page) {
      this.page = page;
      this.getData();
    }
  },
  components: {
    OrderForm
  }
};
</script>

<style lang="less" scoped>
@import "../assets/less/common.less";
@import "../assets/less/iconfont.less";
.top {
  width: 100%;
}
.wrapper {
  margin: 50px auto 100px;
  .ant-btn {
    display: block;
    margin: 40px auto 0;
    padding: 0px 34px;
    height: 50px;
    font-size: 22px;
    border-radius: 8px;
  }
  .box {
    width: 66%;
    display: flex;
    margin: 0 auto;
    margin-top: 45px;
    img {
      width: 482px;
      height: 254px;
      object-fit: cover;
      border-radius: 8px;
    }
    & > div {
      margin-left: 43px;
      display: flex;
      align-items: center;
      flex: 1;
      .detail {
        flex: 1;
        color: @color;
        .money {
          font-size: 26px;
        }
        .border {
          .litterBorder();
        }
        .name {
          font-size: 32px;
          font-family: hanzhen;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .address {
          margin-top: 45px;
          font-size: 16px;
          .lookMap {
            margin-left: 5px;
            color: #cacaca;
          }
        }
        .phone {
          margin-top: 15px;
          font-size: 16px;
        }
      }
      .detailBtn {
        height: 254px;
        cursor: pointer;
      }
    }
  }
}
</style>

