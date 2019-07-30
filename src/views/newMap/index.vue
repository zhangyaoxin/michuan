<template>
  <div id="map">
    <v-nav ref="navs" v-on:address="getcity" ></v-nav>
    <!-- <input v-model.number="center.lng">
    <input v-model.number="center.lat">
    <input v-model.number="zoom">-->
    <baidu-map
      class="bm-view"
      :class="zoom"
      :scroll-wheel-zoom="true"
      :center="center"
      :zoom="zoom"
      @ready="handler"
      @moving="syncCenterAndZoom"
      @moveend="syncCenterAndZoom"
      @zoomend="syncCenterAndZoomend"
    >
      <!-- <bm-marker v-for="(item,index) in list"  :key="index" :position="{lng: item.lon, lat: item.lat}"  :icon="{url: imgsrc, size: {width:26, height: 34}}"></bm-marker> -->
      <!-- <my-overlay v-for="(item,index) in list"  :key="index" :position="{lng: item.lon, lat: item.lat}" :text="item.sub_title"></my-overlay> -->
    </baidu-map>
    <router-link :to="{path:'red_package'}" class="package">
      <img src="./../../assets/images/package_card.png" alt>
    </router-link>
  </div>
</template>
<script>
import nav from "./nav.vue";
import ajes from '@@@/area.js'

import { BmOverlay } from "vue-baidu-map";

import VueJsonp from "vue-jsonp";
Vue.use(VueJsonp);

export default {
  name: "map",
  data() {
    return {
      center: { lng: 118.754473, lat: 32.040781 },
      zoom: 15,
      imgsrc: require("@/assets/images/hb.png"),
      list: [],
      address:null,
      map:null,
      Bmap:null,
      code:'',
      cityName:'南京',
      nowAddress:{lng:0,lat:0},
      lastAddress:{lng:0,lat:0},
      isChange:false,
      loginHref :'',
      // appId :'wx19bdb96099591fef',
      // appId :'wxba613552f366aafb',//本地测试
      appId :'wxdddfda3352cb6a08',//测试环境
      host : "http://h5.bvcio.com/api",
      marker:[]
    };
  },
  mounted: function() {
    $(function() {
      console.log(document.documentElement.clientHeight + "px");
      console.log($(".bm-view").css("height"));
      var navHeight = document.getElementsByClassName("nav_bar")[0]
        .clientHeight;
      $(".bm-view").css(
        "height",
        document.documentElement.clientHeight - navHeight + "px"
      );
    });
    this.$watch('address', (e) => {
      //修改中心点
      var lon = e.poi.split(',')[0];
      var lat = e.poi.split(',')[1];
      console.log('地图展示')
      if(e.city && e.poi){
        for(var i in ajes.city_list){
          if(ajes.city_list[i].indexOf(e.city) != -1){
            console.log(e.city,'切换中心点定位',ajes.city_list[i],i)
            localStorage.area_num = i
            localStorage.bd_lng = lon
            localStorage.bd_lat = lat
          }
        }
        this.getlist(this.Bmap,this.map)
      }
    })
    if(this.addressData.city){
      this.cityName = this.$store.state.addressData.city;
      this.nowAddress.lng =this.$store.state.addressData.lng;
      this.nowAddress.lat =this.$store.state.addressData.lat;
      this.isChange = true;
      console.log('定位城市',this.$store.state.addressData.city,this.cityName)
    }
  },
  components: {
    /*前面的组件名称不能和html标签一样*/
    "v-nav": nav,
  },
  computed:{
    addressData (){
      return this.$store.state.addressData
    }
  },
  methods: {
    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter();
      this.center.lng = lng;
      this.center.lat = lat;
      this.zoom = e.target.getZoom();
      
      console.log(this.center,this.zoom,this.lastAddress)
      if(this.zoom<10){
        this.hideLabel()
      }else{
        this.showLabel()
      }
    },
    syncCenterAndZoomend(e){
      const { lng, lat } = e.target.getCenter();
      this.center.lng = lng;
      this.center.lat = lat;
      this.zoom = e.target.getZoom();
      if(this.lastAddress.lng-lng>1 || this.lastAddress.lng-lng<-1 ||this.lastAddress.lat-lat>1 || this.lastAddress.lat-lat<-1 ){
        console.log(this.center,'重新请求',this.lastAddress)
        localStorage.bd_lng = lng
        localStorage.bd_lat = lat
        this.getlist(this.Bmap,this.map,true)
      }

    },
    hideLabel(){
      $.each(this.marker,(index,item)=> {
        if(item.getLabel()){
          item.getLabel().setStyle({display:"none"})
        }
      })
    },
    showLabel(){
      $.each(this.marker,(index,item)=> {
        if(item.getLabel()){
          item.getLabel().setStyle({display:"block"})
        }
      })
    },
    handler({ BMap, map }) {
      this.map = map;
      this.Bmap = BMap;
      function wgs84togcj02(lng, lat) {
        var that = this;
        var x_PI = (3.14159265358979324 * 3000.0) / 180.0;
        var PI = 3.1415926535897932384626;
        var a = 6378245.0;
        var ee = 0.00669342162296594323;
        var dlat = that.transformlat(lng - 105.0, lat - 35.0);
        var dlng = that.transformlng(lng - 105.0, lat - 35.0);
        var radlat = (lat / 180.0) * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
        dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return [mglng, mglat];
      }
      function gcj02tobd09(lng, lat) {
        var that = this;
        var x_PI = (3.14159265358979324 * 3000.0) / 180.0;
        var PI = 3.1415926535897932384626;
        var a = 6378245.0;
        var ee = 0.00669342162296594323;
        var z =
          Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat];
      }

      function transformlat(lng, lat) {
        var x_PI = (3.14159265358979324 * 3000.0) / 180.0;
        var PI = 3.1415926535897932384626;
        var a = 6378245.0;
        var ee = 0.00669342162296594323;
        var ret =
          -100.0 +
          2.0 * lng +
          3.0 * lat +
          0.2 * lat * lat +
          0.1 * lng * lat +
          0.2 * Math.sqrt(Math.abs(lng));
        ret +=
          ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
            2.0) /
          3.0;
        ret +=
          ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) *
            2.0) /
          3.0;
        ret +=
          ((160.0 * Math.sin((lat / 12.0) * PI) +
            320 * Math.sin((lat * PI) / 30.0)) *
            2.0) /
          3.0;
        return ret;
      }

      function transformlng(lng, lat) {
        var x_PI = (3.14159265358979324 * 3000.0) / 180.0;
        var PI = 3.1415926535897932384626;
        var a = 6378245.0;
        var ee = 0.00669342162296594323;
        var ret =
          300.0 +
          lng +
          2.0 * lat +
          0.1 * lng * lng +
          0.1 * lng * lat +
          0.1 * Math.sqrt(Math.abs(lng));
        ret +=
          ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
            2.0) /
          3.0;
        ret +=
          ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) *
            2.0) /
          3.0;
        ret +=
          ((150.0 * Math.sin((lng / 12.0) * PI) +
            300.0 * Math.sin((lng / 30.0) * PI)) *
            2.0) /
          3.0;
        return ret;
      }
      //地图定位精确方法
      let _this = this; // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
      function getParameter(param) {
        var query = window.location.search; //获取URL地址中？后的所有字符
        var iLen = param.length; //获取你的参数名称长度
        var iStart = query.indexOf(param); //获取你该参数名称的其实索引
        if (iStart == -1)
          //-1为没有该参数
          return "";
        iStart += iLen + 1;
        var iEnd = query.indexOf("&", iStart); //获取第二个参数的其实索引
        if (iEnd == -1)
          //只有一个参数
          return query.substring(iStart); //获取单个参数的参数值
        return query.substring(iStart, iEnd); //获取第二个参数的值
      }
      var code = getParameter("code");
      var urlAreaNum = getParameter("area_num");
      localStorage.wxCode = code;
      var encode_url = encodeURI(
        document.location.toString().replace("/#/newMap", "")
      );
      var _url = encodeURIComponent(location.href.split("#")[0]);
      console.log(encode_url);
      var cdxUrl =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
        _this.appId +
        "&redirect_uri=" +
        encode_url +
        "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
      this.loginHref = cdxUrl;
      if(this.isChange){
        console.log('手动更换城市后不进行重复定位', _this.cityName,_this.Bmap,_this.map)
        /* map.centerAndZoom(
          new BMap.Point(localStorage.bd_lng, localStorage.bd_lat),
          12
        ); */
        _this.cityName = _this.$store.state.addressData.city
        _this.getlist(_this.Bmap,_this.map)
      }else{
        if (code != "" && code != null) {
          if (localStorage.token && localStorage.openId) {
            console.log('getWxLocation执行')
            getWxLocation();
          } else {
            doV1Login(_this.appId, localStorage.wxCode, 2, "南京");
          }
        }else if(urlAreaNum){
          localStorage.area_num = urlAreaNum
          for(var i in ajes.city_list){
            // console.log(i.substr(0, 4),localStorage.area_num.substr(0, 4))
            if(i.substr(0, 4)== localStorage.area_num.substr(0, 4)){
              _this.cityName = ajes.city_list[i].replace('市','')
              _this.$refs.navs.cityInputVal = _this.cityName;
              _this.$refs.navs.addressCity = _this.cityName;
            }
          }
          _this.getlist(_this.Bmap,_this.map)
        }
         else {
          window.location.href = cdxUrl;
        }}
      function getWxLocation() {
        $.ajax({
          type: "post",
          url: _this.host + "/wechat/jssdk/config/" + _this.appId + "?url=" + _url,
          dataType: "json",
          headers: {
            "mc-token": localStorage.token,
            platform: 2
          },
          success: function(res) {
            wx.config(res);
            wx.ready(function() {
              wx.getLocation({
                type: "gcj02", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function(res) {
                  var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                  var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                  var speed = res.speed; // 速度，以米/每秒计
                  var accuracy = res.accuracy; // 位置精度
                  var s = gcj02tobd09(longitude, latitude);
                  localStorage.bd_lng = s[0].toString();
                  localStorage.bd_lat = s[1].toString();
                  /* map.addControl(new BMap.NavigationControl()); //平移缩放控件（PC端默认位于地图左上方）
                  //添加多个控件
                  map.addControl(new BMap.ScaleControl());//比例尺控件（默认位于地图左下方，显示地图的比例关系）
                  map.addControl(new BMap.OverviewMapControl()); //缩略地图控件（默认位于地图右下方，是一个可折叠的缩略地图） */
                  /* map.centerAndZoom(
                    new BMap.Point(localStorage.bd_lng, localStorage.bd_lat),
                    15
                  ); */
                  var api =
                    "https://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=" +
                    localStorage.bd_lat +
                    "," +
                    localStorage.bd_lng +
                    "&output=json&pois=1&latest_admin=1&ak=trHdY75cpqkWWaUchb0Uf8ctUdrjh8tz";
                  $.ajax({
                    url: api, //可以不是本地域名
                    type: "get",
                    dataType: "jsonp", //jsonp格式访问
                    jsonpCallback: "jsonp1" //获取数据的函数
                  })
                    .done(function(res) {
                      localStorage.area_num = res.result.addressComponent.adcode;
                      console.log('市区代码', res)
                      _this.cityName = res.result.addressComponent.city.replace('市','')
                      _this.$refs.navs.cityInputVal = _this.cityName;
                      _this.$refs.navs.addressCity = _this.cityName;
                      var addressData= {};
                      addressData.city = _this.cityName;
                      addressData.poi = {lng:localStorage.bd_lng,lat:localStorage.bd_lat};
                      addressData.area_num = res.result.addressComponent.adcode;
                      _this.$store.commit('setAddress',addressData)
                      localStorage.checkCity = _this.cityName

                      _this.getlist(_this.Bmap,_this.map)
                    })
                    .fail(function() {
                      alert("服务器超时，请重试！");
                    });
                  if (localStorage.area_num == 0) {
                    localStorage.area_num = 320100;
                    this.code =localStorage.area_num
                  }
                  
                  if (
                    res.response_code == 500 ||
                    res.response_code == 502 ||
                    res.response_code == 503
                  ) {
                    doV1Login(_this.appId, localStorage.wxCode, 2, "南京");
                  }
                }
              });
            });
          },
          error: function(res) {}
        });
      }
      function doV1Login(appId, code, login_platform, login_location) {
        $.ajax({
          type: "post",
          url: _this.host + "/v1/wechat/login/" + appId + "/" + code,
          dataType: "json",
          data: {
            login_platform: login_platform,
            login_location: login_location
          },
          success: function(res) {
            if (res.status == true) {
              console.log("登录成功");
              //缓存一些必要的参数
              localStorage.token = res.data.token;
              localStorage.userPhone = res.data.user.phone;
              localStorage.userHead = res.data.user.thumbnail;
              localStorage.nickName = res.data.user.nickname;
              localStorage.openId = res.data.user.openid;
              if (localStorage.token && localStorage.openId) {
                getWxLocation();
              } else {
                doV1Login(appId, localStorage.wxCode, 2, "南京");
              }
            } else {
              console.log("error 登陆失败");
            }
          },
          error: function(res) {
            window.location.href = cdxUrl;
          }
        });
      }
    },
    getcity(data){
      this.address = data;
    },
    getlist(Bmap,map,move){
      console.log('切换城市请求')
      let _this = this;
      $.ajax({
            type: "get",
            url: "http://h5.bvcio.com/api/merchant/list/index",
            async: false,
            dataType: "json",
            headers: {
              "mc-token": localStorage.token,
              platform: 2
            },
            data: {
              areaNum: localStorage.area_num?localStorage.area_num:320100,
              lon: localStorage.bd_lng,
              lat: localStorage.bd_lat
            },
            success: function(res) {
              console.log('切换城市请求success')
              if (
                res.response_code == 500 ||
                res.response_code == 502 ||
                res.response_code == 503 ||
                res.response_code == 300
              ) {
                _this.doV1Login(this.appId, localStorage.wxCode, 2, "南京");
              }
              if (res.data.length == 0) {
                console.log("首页没店面数据");
                map.addControl(new BMap.NavigationControl()); //平移缩放控件（PC端默认位于地图左上方）
                //添加多个控件
                map.addControl(new BMap.ScaleControl());//比例尺控件（默认位于地图左下方，显示地图的比例关系）
                map.addControl(new BMap.OverviewMapControl()); //缩略地图控件（默认位于地图右下方，是一个可折叠的缩略地图）
                map.centerAndZoom(
                  new BMap.Point(localStorage.bd_lng, localStorage.bd_lat),
                  15
                );
                return;
              } else {
                var points = []; //坐标点数组
                var label = []; //label数组
                // var marker = []; //marker数组
                var marker_name = []; //marker logo数组
                var minlat = [];
                var minlng = []
                //设置标注的图标
                var icon = new BMap.Icon(
                  "http://wxunion.cn/public/hb.png",
                  new BMap.Size(100, 100)
                );
                function gcj02tobd09(lng, lat) {
                  var that = this;
                  var x_PI = (3.14159265358979324 * 3000.0) / 180.0;
                  var PI = 3.1415926535897932384626;
                  var a = 6378245.0;
                  var ee = 0.00669342162296594323;
                  var z =
                    Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
                  var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
                  var bd_lng = z * Math.cos(theta) + 0.0065;
                  var bd_lat = z * Math.sin(theta) + 0.006;
                  return [bd_lng, bd_lat];
                }
                map.clearOverlays()
                $.each(res.data, function(index, value) {
                  var s = gcj02tobd09(value.lon, value.lat);
                  value.lon = s[0].toString();
                  value.lat = s[1].toString();
                  // console.log(value,'changeaddress')
                  if( false && value.only_balance<1){

                  }
                  else{
                  // var marker = new BMap.Marker(
                  //   new BMap.Point(value.lon, value.lat),
                  //   {
                  //     icon: icon
                  //   }
                  // );
                  // map.addOverlay(marker);
                  var myIcon = new BMap.Icon(
                    "http://wxunion.cn/public/hb.png",
                    new BMap.Size(26, 34),
                    {
                      // offset: new BMap.Size(0, 0), // 指定定位位置
                      // imageOffset: new BMap.Size(0,0), // 设置图片偏移
                      anchor: new BMap.Size(13, 34), 
                    }
                  );
                  var point = new BMap.Point(value.lon, value.lat);
                  
                  points.push(point);
                  _this.marker[index] = new BMap.Marker(point, { icon: myIcon });
                  var showNum = value.only_balance / 100;
                  if (showNum == 0.0) {
                    showNum = 0;
                  }
                  label[index] = new BMap.Label(
                    "<div class='label_cont'>"+value.sub_title + "</div><br/>专用￥" + showNum,
                    {
                      offset: new BMap.Size(-15, 37)
                    }
                  );
                  label[index].setStyle({
                    border: "1px solid #e8e8e8",
                    fontSize: "14px",
                    padding: "5px",
                    color: "#FE3442",
                    whiteSpace: "normal",
                    backgroundColor: "rgba(255,255,255,0.6)",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    width:"7em",
                  });
                  _this.marker[index].setLabel(label[index]);
                  map.addOverlay(_this.marker[index]);
                  _this.marker[index].addEventListener("click", function() {
                    location.href =
                      "http://h5.bvcio.com/mc_b/shop.html?shopId=" +
                      value.hashID +
                      "&token=" +
                      localStorage.token +
                      "&dist=" +
                      value.dist +
                      "&only_balance=" +
                      value.only_balance;
                  });
                  }
                });
                map.addControl(new BMap.NavigationControl()); //平移缩放控件（PC端默认位于地图左上方）
                //添加多个控件
                map.addControl(new BMap.ScaleControl());//比例尺控件（默认位于地图左下方，显示地图的比例关系）
                map.addControl(new BMap.OverviewMapControl()); //缩略地图控件（默认位于地图右下方，是一个可折叠的缩略地图）
                // map.setViewport(points);
                //非定位城市
                if(!move)
                {if(_this.$store.state.addressData.city != localStorage.checkCity)
                {  var pIndex = points.length-1;
                  if(pIndex>0){
                  console.log(points[pIndex],'商户超过1个')
                    map.centerAndZoom(
                      points[pIndex],14
                    );
                  }else if(pIndex == 0){
                    map.centerAndZoom(
                      points[0],14
                    );
                    console.log(points,'只有一家商户')
                  }
                  else{
                    console.log('没有商户但是还进来的情况')
                    if(localStorage.bd_lng && localStorage.bd_lat){
                      map.centerAndZoom(
                        new BMap.Point(localStorage.bd_lng, localStorage.bd_lat),14
                      );
                    } 
                  }
                }else{
                  var lng = _this.$store.state.addressData.poi.lng
                  var lat = _this.$store.state.addressData.poi.lat

                  map.centerAndZoom(
                    new BMap.Point(lng, lat),14
                  );
                }
                }
                _this.lastAddress ={
                  lnt:localStorage.bd_lng,
                  lat:localStorage.bd_lat
                }
                console.log('切换中心点3',localStorage.bd_lng, localStorage.bd_lat,points)
                console.log('定位地址',_this.$store.state.addressData,'选择地址',localStorage.checkCity)
                // map.addOverlay(new BMap.Marker(new BMap.Point(localStorage.bd_lng, localStorage.bd_lat)))
              }
            },
            error: function(msg) {}
      });
    },
    doV1Login(appId, code, login_platform, login_location) {
      $.ajax({
        type: "post",
        url: this.host + "/v1/wechat/login/" + appId + "/" + code,
        dataType: "json",
        data: {
          login_platform: login_platform,
          login_location: login_location
        },
        success: function(res) {
          if (res.status == true) {
            console.log("登录成功");
            //缓存一些必要的参数
            localStorage.token = res.data.token;
            localStorage.userPhone = res.data.user.phone;
            localStorage.userHead = res.data.user.thumbnail;
            localStorage.nickName = res.data.user.nickname;
            localStorage.openId = res.data.user.openid;
            /* if (localStorage.token && localStorage.openId) {
              getWxLocation();
            } else {
              doV1Login(appId, localStorage.wxCode, 2, "南京");
            } */
          } else {
            console.log("error 登陆失败");
          }
        },
        error: function(res) {
          window.location.href = this.loginHref;
        }
      });
    },
    goBackNowCity(){
      localStorage.bd_lng = this.addressData.poi.lng
      localStorage.bd_lat = this.addressData.poi.lat
      localStorage.area_num =  this.addressData.area_num
      this.getlist(this.Bmap,this.map)
    }
  }
};
</script>

<style scoped>
.bm-view {
  width: 100%;
  min-height: 400px;
}
.BMap_cpyCtrl {
  display: none;
}
.anchorBL {
  display: none;
}
.package {
  width: 3.666667rem;
  height: 3.666667rem;
  position: fixed;
  right: 5px;
  bottom: 150px;
  z-index: 999;
}
.package img {
  width: 100%;
  height: 100%;
  z-index: 999;
}
/* .label_cont{
  
} */
</style>