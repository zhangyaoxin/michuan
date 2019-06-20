<template>
  <div id="map">
    <!-- <v-nav></v-nav> -->
    <!-- <input v-model.number="center.lng">
    <input v-model.number="center.lat">
    <input v-model.number="zoom">-->
    <baidu-map
      class="bm-view"
      :scroll-wheel-zoom="true"
      :center="center"
      :zoom="zoom"
      @ready="handler"
      @moving="syncCenterAndZoom"
      @moveend="syncCenterAndZoom"
      @zoomend="syncCenterAndZoom"
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

import { BmOverlay } from "vue-baidu-map";

import VueJsonp from "vue-jsonp";
Vue.use(VueJsonp);

export default {
  name: "map",
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 18,
      imgsrc: require("@/assets/images/hb.png"),
      list: []
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
  },
  components: {
    /*前面的组件名称不能和html标签一样*/
    "v-nav": nav
  },
  methods: {
    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter();
      this.center.lng = lng;
      this.center.lat = lat;
      this.zoom = e.target.getZoom();
    },
    handler({ BMap, map }) {
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
      var host = "http://h5.bvcio.com/api";
      var appId = "wx19bdb96099591fef";
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
      localStorage.wxCode = code;
      var encode_url = encodeURI(
        document.location.toString().replace("/#/newMap", "")
      );
      var _url = encodeURIComponent(location.href.split("#")[0]);
      console.log(encode_url);
      var cdxUrl =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
        appId +
        "&redirect_uri=" +
        encode_url +
        "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
      if (code != "" && code != null) {
        if (localStorage.token && localStorage.openId) {
          getWxLocation();
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
              // alert(res.result.addressComponent.adcode)
            })
            .fail(function() {
              alert("服务器超时，请重试！");
            });
          if (localStorage.area_num == 0) {
            localStorage.area_num = 320100;
          }
          $.ajax({
            type: "get",
            url: host + "/merchant/list/index",
            async: false,
            dataType: "json",
            headers: {
              "mc-token": localStorage.token,
              platform: 2
            },
            data: {
              areaNum: localStorage.area_num,
              lon: localStorage.bd_lng,
              lat: localStorage.bd_lat
            },
            success: function(res) {
              if (
                res.response_code == 500 ||
                res.response_code == 502 ||
                res.response_code == 503 ||
                res.response_code == 300
              ) {
                doV1Login(appId, localStorage.wxCode, 2, "南京");
              }
              if (res.data.length == 0) {
                console.log("首页没店面数据");
                map.addControl(new BMap.NavigationControl()); //平移缩放控件（PC端默认位于地图左上方）
                //添加多个控件
                // map.addControl(new BMap.ScaleControl());//比例尺控件（默认位于地图左下方，显示地图的比例关系）
                map.addControl(new BMap.OverviewMapControl()); //缩略地图控件（默认位于地图右下方，是一个可折叠的缩略地图）
                map.centerAndZoom(
                  new BMap.Point(localStorage.bd_lng, localStorage.bd_lat),
                  15
                );
                return;
              } else {
                var points = []; //坐标点数组
                var label = []; //label数组
                var marker = []; //marker数组
                var marker_name = []; //marker logo数组
                //设置标注的图标
                var icon = new BMap.Icon(
                  "http://wxunion.cn/public/hb.png",
                  new BMap.Size(100, 100)
                );
                $.each(res.data, function(index, value) {
                  var marker = new BMap.Marker(
                    new BMap.Point(value.lon, value.lat),
                    {
                      icon: icon
                    }
                  );
                  map.addOverlay(marker);
                  var myIcon = new BMap.Icon(
                    "http://wxunion.cn/public/hb.png",
                    new BMap.Size(100, 100),
                    {
                      // offset: new BMap.Size(0, 0), // 指定定位位置
                      imageOffset: new BMap.Size(0, 0 - 26 * 34) // 设置图片偏移
                    }
                  );
                  var point = new BMap.Point(value.lon, value.lat);
                  points.push(point);
                  marker[index] = new BMap.Marker(point, { icon: myIcon });
                  var showNum = value.only_balance / 100;
                  if (showNum == 0.0) {
                    showNum = 0;
                  }
                  label[index] = new BMap.Label(
                    value.sub_title + "<br/>专用￥" + showNum,
                    {
                      offset: new BMap.Size(-15, 37)
                    }
                  );
                  label[index].setStyle({
                    border: "1px solid #e8e8e8",
                    fontSize: "14px",
                    padding: "5px",
                    color: "#FE3442",
                    backgroundColor: "rgba(255,255,255,0.6)",
                    fontWeight: "bold",
                    borderRadius: "10px"
                  });
                  marker[index].setLabel(label[index]);
                  map.addOverlay(marker[index]);
                  marker[index].addEventListener("click", function() {
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
                });
                map.setViewport(points);
              }
            },
            error: function(msg) {}
          });
        } else {
          doV1Login(appId, localStorage.wxCode, 2, "南京");
        }
      } else {
        window.location.href = cdxUrl;
      }
      function getWxLocation() {
        $.ajax({
          type: "post",
          url: host + "/wechat/jssdk/config/" + appId + "?url=" + _url,
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
                  map.addControl(new BMap.NavigationControl()); //平移缩放控件（PC端默认位于地图左上方）
                  //添加多个控件
                  // map.addControl(new BMap.ScaleControl());//比例尺控件（默认位于地图左下方，显示地图的比例关系）
                  map.addControl(new BMap.OverviewMapControl()); //缩略地图控件（默认位于地图右下方，是一个可折叠的缩略地图）
                  map.centerAndZoom(
                    new BMap.Point(localStorage.bd_lng, localStorage.bd_lat),
                    15
                  );
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
                      localStorage.area_num =
                        res.result.addressComponent.adcode;
                      // alert(res.result.addressComponent.adcode)
                    })
                    .fail(function() {
                      alert("服务器超时，请重试！");
                    });
                  if (localStorage.area_num == 0) {
                    localStorage.area_num = 320100;
                  }
                  $.ajax({
                    type: "get",
                    url: host + "/merchant/list/index",
                    async: false,
                    dataType: "json",
                    headers: {
                      "mc-token": localStorage.token,
                      platform: 2
                    },
                    data: {
                      areaNum: localStorage.area_num,
                      lon: localStorage.bd_lng,
                      lat: localStorage.bd_lat
                    },
                    success: function(res) {
                      if (
                        res.response_code == 500 ||
                        res.response_code == 502 ||
                        res.response_code == 503 ||
                        res.response_code == 300
                      ) {
                        doV1Login(appId, localStorage.wxCode, 2, "南京");
                      }
                      if (res.data.length == 0) {
                        console.log("meishuju");

                        doV1Login(appId, localStorage.wxCode, 2, "南京");
                        map.addControl(new BMap.NavigationControl()); //平移缩放控件（PC端默认位于地图左上方）
                        //添加多个控件
                        // map.addControl(new BMap.ScaleControl());//比例尺控件（默认位于地图左下方，显示地图的比例关系）
                        map.addControl(new BMap.OverviewMapControl()); //缩略地图控件（默认位于地图右下方，是一个可折叠的缩略地图）
                        map.centerAndZoom(
                          new BMap.Point(
                            localStorage.bd_lng,
                            localStorage.bd_lat
                          ),
                          15
                        );
                        return;
                      } else {
                        var points = []; //坐标点数组
                        var label = []; //label数组
                        var marker = []; //marker数组
                        var marker_name = []; //marker logo数组
                        //设置标注的图标
                        var icon = new BMap.Icon(
                          "http://wxunion.cn/public/hb.png",
                          new BMap.Size(100, 100)
                        );
                        $.each(res.data, function(index, value) {
                          var marker = new BMap.Marker(
                            new BMap.Point(value.lon, value.lat),
                            {
                              icon: icon
                            }
                          );
                          map.addOverlay(marker);
                          var myIcon = new BMap.Icon(
                            "http://wxunion.cn/public/hb.png",
                            new BMap.Size(100, 100),
                            {
                              // offset: new BMap.Size(0, 0), // 指定定位位置
                              imageOffset: new BMap.Size(0, 0 - 26 * 34) // 设置图片偏移
                            }
                          );
                          var point = new BMap.Point(value.lon, value.lat);
                          points.push(point);
                          marker[index] = new BMap.Marker(point, {
                            icon: myIcon
                          });
                          var showNum = value.only_balance / 100;
                          if (showNum == 0.0) {
                            showNum = 0;
                          }
                          label[index] = new BMap.Label(
                            value.sub_title + "<br/>专用￥" + showNum,
                            {
                              offset: new BMap.Size(-15, 37)
                            }
                          );
                          label[index].setStyle({
                            border: "1px solid #e8e8e8",
                            fontSize: "14px",
                            padding: "5px",
                            color: "#FE3442",
                            backgroundColor: "rgba(255,255,255,0.6)",
                            fontWeight: "bold",
                            borderRadius: "10px"
                          });
                          marker[index].setLabel(label[index]);
                          map.addOverlay(marker[index]);
                          marker[index].addEventListener("click", function() {
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
                        });
                        map.setViewport(points);
                      }
                    },
                    error: function(msg) {}
                  });
                  if (
                    res.response_code == 500 ||
                    res.response_code == 502 ||
                    res.response_code == 503
                  ) {
                    doV1Login(appId, localStorage.wxCode, 2, "南京");
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
          url: host + "/v1/wechat/login/" + appId + "/" + code,
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
              console.log("error");
            }
          },
          error: function(res) {
            window.location.href = cdxUrl;
          }
        });
      }
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
</style>