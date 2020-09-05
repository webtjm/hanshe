export default {
  password: function(str){
    var reg=/^[_0-9a-z]{6,16}$/;
    if(reg.test(str)){
      return true;
    }else{
      return false;
    }
  },
  phone: function(str){
    var reg=/^1[3|4|5|7|8|9]\d{9}$/;
    if(reg.test(str)){
      return true;
    }else{
      return false
    }
  },
  email: function(str){
    var reg=/^[0-9a-zA-Z_\.\-]+\@+[0-9a-zA-Z_\.\-]+\.(com|com.cn|edn|hk|cn|net)$/;
    
    if(reg.test(str)){
        return true;
    }else{
      return false
    }
  },
  idcard: function(str){
    var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
    if(!regIdNo.test(str)){ 
      return false; 
    }else{
      return true;
    }
  },
  formatDate:function(date){
    date = new Date(date)
    return date.getFullYear()+'年'+(date.getMonth()+1)+'月'+(date.getDate())+'日'
  },
  formatLineDate: function(date) {
    date = new Date(date)
    return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+(date.getDate())
  },
  today: function(){
    var day2 = new Date();
    day2.setTime(day2.getTime());
    return (day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day2.getDate())
  },
  tomorrow: function(){
    var day3 = new Date();
    day3.setTime(day3.getTime()+24*60*60*1000);
    return (day3.getFullYear()+"-" + (day3.getMonth()+1) + "-" + day3.getDate())
  },
  formatDay(date){
    date = new Date(date)
    let day = date.getDay()
    switch(day){
        case 1:
            return '星期一'
        case 2:
            return '星期二'
        case 3:
            return '星期三'
        case 4:
            return '星期四'
        case 5:
            return '星期五'
        case 6:
            return '星期六'
        default:
            return '星期天'
    }
  },
  formatCity(province, city){
    if(province === '日本'){
      if(city === '日本'){
        return '日本'
      }else{
        return province+city
      }
    }else if(province === city){
      return province
    }else{
      return province+city
    }
  },
  compareData(date) {
    if(date[0] && date[1]){
      let startArr = date[0].split("-");
      let startTime = new Date(startArr[0], startArr[1] - 1, startArr[2]).getTime();
      let endArr = date[1].split("-");
      let endTime = new Date(endArr[0], endArr[1] - 1, endArr[2]).getTime();
      let intervalTime = endTime - startTime;
      let intervalDay = intervalTime.toFixed(2) / 86400000;
      return intervalDay;
    }else{
      return 0;
    }
  },
  validityDate(start, validity){
    let end = start+(validity*1000*60*60*24)
    return this.formatDate(start)+'-'+this.formatDate(end)
  }
}