<template>
  <section class="cityChoiceBox" id="cityChoiceBox" 
    @touchstart='touchStart'
    @touchmove='touchMove'
    @touchend='touchEnd'>
    <article class="cityChoice-top transit" v-bind:class="{focus:isCancel}">
      <transition
        enter-active-class="animated fadeInLeft"
        leave-active-class="animated fadeOutLeft"
      >
        <span class="fa fa-angle-left" v-if="!isCancel" v-on:click="cityClose"></span>
      </transition>

      <div class="search clearflex" style=" background:#f7f8fa;">
          <img src="@/assets/images/icon-mall_search@2x.png" alt="">
          <input 
          type="text"
          class="search-input"
          v-model.trim="ssval"
          v-on:focus="search"
          placeholder="请输入城市名"/>
      </div>
   <!--    <input
        type="text"
        class="search-input"
        placeholder="中文/拼音/首写字母"
        v-model.trim="ssval"
        v-on:focus="search"
      > -->
      <transition
        enter-active-class="animated fadeInRight"
        leave-active-class="animated fadeOutRight"
      >
        <i v-if="isCancel" v-on:click="isCancel=false" class="cancel">取消</i>
        <i v-else @click="search" class="cancel">搜索</i>
      </transition>
    </article>
    <article class="city_now" v-show="!isCancel">
      <div class="now_address">
        <p>当前定位</p>
        <div class="address_ad">
          <div class="address_lt" @click="resetAd"><img src="@/assets/images/icon-now-city@2x.png" alt=""><span class="address_name">{{cityName}}</span></div>
          <div class="reset" v-if="false" @click="resetAd">重新定位</div>
        </div>
      </div>
    </article>
    <article class="city-Box" v-show="!isCancel">
      
      <div class="city-sidaber" id="city-sidaber" v-show="!isCancel">
        <p
          v-for="(sidaber,index) in sidabers"
          v-on:touchstart="mousedownFun(index)"
          v-on:touchend="mouseupFun(index)"
          v-text="sidaber"
        ></p>
      </div>
      <div class="host-city">
        <h3>热门城市</h3>
        <div  class="host_city_list">
          <span
            v-for="(item,index) in hostCitys"
            v-text="item.city"
            v-on:click="cityactive(index,hostCitys)"
          ></span>
        </div>
      </div>

      <div class="city-content">
        <h3>A</h3>
        <!-- <p v-for="(item,index) in citys[0].list" v-on:click="cityactive(index,citys[0].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityA" v-on:click="cityactive(index,cityA)">{{item.city}}</p>

        <h3>B</h3>

        <!-- <p v-for="(item,index) in citys[1].list" v-on:click="cityactive(index,citys[1].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityB" v-on:click="cityactive(index,cityB)">{{item.city}}</p>

        <h3>C</h3>

        <!-- <p v-for="(item,index) in citys[2].list" v-on:click="cityactive(index,citys[2].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityC" v-on:click="cityactive(index,cityC)">{{item.city}}</p>

        <h3>D</h3>

        <!-- <p v-for="(item,index) in citys[3].list" v-on:click="cityactive(index,citys[3].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityD" v-on:click="cityactive(index,cityD)">{{item.city}}</p>

        <h3>E</h3>

        <!-- <p v-for="(item,index) in citys[4].list" v-on:click="cityactive(index,citys[4].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityE" v-on:click="cityactive(index,cityE)">{{item.city}}</p>

        <h3>F</h3>

        <!-- <p v-for="(item,index) in citys[5].list" v-on:click="cityactive(index,citys[5].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityF" v-on:click="cityactive(index,cityF)">{{item.city}}</p>

        <h3>G</h3>

        <!-- <p v-for="(item,index) in citys[6].list" v-on:click="cityactive(index,citys[6].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityG" v-on:click="cityactive(index,cityG)">{{item.city}}</p>

        <h3>H</h3>

        <!-- <p v-for="(item,index) in citys[7].list" v-on:click="cityactive(index,citys[7].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityH" v-on:click="cityactive(index,cityH)">{{item.city}}</p>

        <h3>J</h3>

        <!-- <p v-for="(item,index) in citys[8].list" v-on:click="cityactive(index,citys[8].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityJ" v-on:click="cityactive(index,cityJ)">{{item.city}}</p>

        <h3>K</h3>

        <!-- <p v-for="(item,index) in citys[9].list" v-on:click="cityactive(index,citys[9].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityK" v-on:click="cityactive(index,cityK)">{{item.city}}</p>

        <h3>L</h3>

        <!-- <p v-for="(item,index) in citys[10].list" v-on:click="cityactive(index,citys[10].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityL" v-on:click="cityactive(index,cityL)">{{item.city}}</p>

        <h3>M</h3>

        <!-- <p v-for="(item,index) in citys[11].list" v-on:click="cityactive(index,citys[11].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityM" v-on:click="cityactive(index,cityM)">{{item.city}}</p>

        <h3>N</h3>

        <!-- <p v-for="(item,index) in citys[12].list" v-on:click="cityactive(index,citys[12].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityN" v-on:click="cityactive(index,cityN)">{{item.city}}</p>

        <h3>P</h3>

        <!-- <p v-for="(item,index) in citys[13].list" v-on:click="cityactive(index,citys[13].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityP" v-on:click="cityactive(index,cityP)">{{item.city}}</p>

        <h3>Q</h3>

        <!-- <p v-for="(item,index) in citys[14].list" v-on:click="cityactive(index,citys[14].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityQ" v-on:click="cityactive(index,cityQ)">{{item.city}}</p>

        <h3>R</h3>

        <!-- <p v-for="(item,index) in citys[15].list" v-on:click="cityactive(index,citys[15].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityR" v-on:click="cityactive(index,cityR)">{{item.city}}</p>

        <h3>S</h3>

        <!-- <p v-for="(item,index) in citys[16].list" v-on:click="cityactive(index,citys[16].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityS" v-on:click="cityactive(index,cityS)">{{item.city}}</p>

        <h3>T</h3>

        <!-- <p v-for="(item,index) in citys[17].list" v-on:click="cityactive(index,citys[17].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityT" v-on:click="cityactive(index,cityT)">{{item.city}}</p>

        <h3>W</h3>

        <!-- <p v-for="(item,index) in citys[18].list" v-on:click="cityactive(index,citys[18])">{{item.name}}</p> -->
        <p v-for="(item,index) in cityW" v-on:click="cityactive(index,cityW)">{{item.city}}</p>

        <h3>X</h3>

        <!-- <p v-for="(item,index) in citys[19].list" v-on:click="cityactive(index,citys[19].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityX" v-on:click="cityactive(index,cityX)">{{item.city}}</p>

        <h3>Y</h3>

        <!-- <p v-for="(item,index) in citys[20].list" v-on:click="cityactive(index,citys[20].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityY" v-on:click="cityactive(index,cityY)">{{item.city}}</p>

        <h3>Z</h3>

        <!-- <p v-for="(item,index) in citys[21].list" v-on:click="cityactive(index,citys[21].list)">{{item.name}}</p> -->
        <p v-for="(item,index) in cityZ" v-on:click="cityactive(index,cityZ)">{{item.city}}</p>
      </div>

      <div v-show="zimShow" class="zimShow" v-text="zimText"></div>
    </article>

    <article class="search-box" id="search-box" v-show="isCancel">
      <p
        class="sousuo"
        v-for="(item,index) in sousuos"
        v-on:click="cityactive(index,sousuos)"
      >{{item.city}}</p>
    </article>
  </section>
</template>

<script>
import cityList from '@/assets/js/city.json'
export default {
  name: "city",
  component:{
    cityList
  },
  data() {
    return {
      isCancel: false,
      cityName:'南京',
      zimShow: false,
      startX:0,   //触摸位置
      endX:0,     //结束位置
      moveX: 0,   //滑动时的位置
      disX: 0,    //移动距离
      deleteSlider: '',//滑动时的效果,使用v-bind:style="deleteSlider"
      ssval: "",

      zimText: "",

      sidabers: [
        "#",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "M",
        "N",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "W",
        "X",
        "Y",
        "Z"
      ],
      outrun:true,
      citys:
      [
				{city:'南宁',py:'nanning'},{city:'桂林',py:'guilin'},{city:'百色',py:'baise'},{city:'北海',py:'beihai'},{city:'崇左',py:'chongzuo'},
				{city:'防城港',py:'fangchenggang'},{city:'贵港',py:'guigang'},{city:'河池',py:'hechi'},{city:'贺州',py:'hezhou'},
				{city:'来宾',py:'laibin'},{city:'柳州',py:'liuzhou'},{city:'钦州',py:'qinzhou'},{city:'梧州',py:'wuzhou'},{city:'玉林',py:'yulin'},
				{city:'武鸣县',py:'wumingxian'},{city:'隆安县',py:'longanxian'},{city:'马山县',py:'mashanxian'},{city:'上林县',py:'shanglinxian'},
				{city:'宾阳县',py:'binyangxian'},{city:'横县',py:'hengxian'},{city:'阳朔县',py:'yangshuoxian'},{city:'临桂县',py:'linguixian'},
				{city:'灵川县',py:'lingchuanxian'},{city:'全州县',py:'quanzhouxian'},{city:'平乐县',py:'pinglexian'},{city:'兴安县',py:'xinganxian'},
				{city:'灌阳县',py:'guanyangxian'},{city:'荔浦县',py:'lipuxian'},{city:'资源县',py:'ziyuanxian'},{city:'永福县',py:'yongfuxian'},
				{city:'龙胜',py:'longsheng'},{city:'恭城',py:'gongcheng'},{city:'凌云县',py:'lingyunxian'},
				{city:'平果县',py:'pingguoxian'},{city:'西林县',py:'xilinxian'},{city:'乐业县',py:'leyexian'},
				{city:'德保县',py:'debaoxian'},{city:'田林县',py:'tianlinxian'},{city:'田阳县',py:'tianyangxian'},{city:'靖西县',py:'jingxixian'},
				{city:'田东县',py:'tiandongxian'},{city:'那坡县',py:'napoxian'},{city:'隆林',py:'longlin'},{city:'合浦县',py:'hepuxian'},
				{city:'凭祥市',py:'pingxiangshi'},{city:'宁明县',py:'ningmingxian'},{city:'扶绥县',py:'fusuixian'},{city:'龙州县',py:'longzhouxian'},
				{city:'大新县',py:'daxinxian'},{city:'天等县',py:'tiandengxian'},{city:'东兴市',py:'dongxingshi'},{city:'上思县',py:'shangsixian'},
				{city:'桂平市',py:'guipingshi'},{city:'平南县',py:'pingnanxian'},{city:'宜州市',py:'yizhoushi'},{city:'天峨县',py:'tianexian'},
				{city:'凤山县',py:'fengshanxian'},{city:'南丹县',py:'nandanxian'},{city:'东兰县',py:'donglanxian'},
				{city:'都安',py:'duan'},{city:'罗城',py:'luocheng'},{city:'巴马',py:'bama'},{city:'环江',py:'huanjiang'},
				{city:'大化',py:'dahua'},{city:'钟山县',py:'zhongshanxian'},{city:'昭平县',py:'zhaopingxian'},{city:'富川',py:'fuchuan'},
				{city:'合山市',py:'heshanshi'},{city:'象州县',py:'xiangzhouxian'},{city:'武宣县',py:'wuxuanxian'},{city:'忻城县',py:'xinchengxian'},{city:'金秀',py:'jinxiu'},
				{city:'柳江县',py:'liujiangxian'},{city:'柳城县',py:'liuchengxian'},{city:'鹿寨县',py:'luzhaixian'},{city:'融安县',py:'ronganxian'},
				{city:'融水',py:'rongshui'},{city:'三江',py:'sanjiang'},{city:'灵山县',py:'lingshanxian'},{city:'浦北县',py:'pubeixian'},{city:'岑溪市',py:'cenxishi'},
				{city:'苍梧县',py:'cangwuxian'},{city:'藤县',py:'tengxian'},{city:'蒙山县',py:'mengshanxian'},{city:'北流市',py:'beiliushi'},
        {city:'容县',py:'rongxian'},{city:'陆川县',py:'luchuanxian'},{city:'博白县',py:'bobaixian'},{city:'兴业县',py:'xingyexian'},{city:'深圳',py:'shenzhen'}
        ] ,
      hostCitys: [],
      searchCity:[]
    };
  },
  methods: {
    //调用城市选择组件

    cityFun: function() {
      var cityChoiceBox = document.getElementById("cityChoiceBox");

      var citySidaber = document.getElementById("city-sidaber");

      var clientW =
        document.documentElement.clientWidth || document.body.clientWidth;

      cityChoiceBox.style.left = clientW + "px";

      cityChoiceBox.style.display = "block";

      this.starMove(cityChoiceBox, { left: 0 }, function() {
        citySidaber.style.display = "block";
      });
      this.cityName = this.$parent.addressCity
    },

    //关闭城市选择组件

    cityClose: function() {
      this.isCancel = false;

      var cityChoiceBox = document.getElementById("cityChoiceBox");

      var citySidaber = document.getElementById("city-sidaber");

      var clientW =
        document.documentElement.clientWidth || document.body.clientWidth;

      citySidaber.style.display = "none";

      this.starMove(cityChoiceBox, { left: clientW }, function() {
        cityChoiceBox.style.display = "none";
      });
    },

    //变速运动

    starMove: function(obj, json, fn) {
      //添加一个回调函数fn

      function getStyle(obj, attr) {
        if (obj.currentStyle) {
          return obj.currentStyle[attr];
        } else {
          return getComputedStyle(obj, false)[attr];
        }
      }

      clearInterval(obj.timer);

      obj.timer = setInterval(function() {
        var flag = true; //假设都到达了目标值

        for (var attr in json) {
          //1.取当前值

          var icur = 0;

          icur = parseInt(getStyle(obj, attr));

          //2.算速度

          var speed = (json[attr] - icur) / 8;

          speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

          //3.检查停止

          if (icur != json[attr]) {
            flag = false;
          }

          obj.style[attr] = icur + speed + "px";

          if (flag) {
            clearInterval(obj.timer);

            if (fn) {
              //判断是否存在回调函数,并调用

              fn();
            }
          }
        }
      }, 20);
    },

    //搜索框获取焦点进入搜索层

    search: function() {
      this.isCancel = true;
    },

    //热门活动

    hostCityss: function() {
      var j = 0;
      var citys =[
        {city:'上海',poi:'121.480539,31.235929'},
        {city:'杭州',poi:'120.215512,30.253083'},
        {city:'北京',poi:'116.413384,39.910925'},
        {city:'广州',poi:'113.271431,23.135336'},
        {city:'天津',poi:'117.210813,39.14393'},
        {city:'南京',poi:'118.802422,32.064653'},
        {city:'武汉',poi:'114.311582,30.598467'},
        {city:'苏州',poi:'120.592412,31.303564'},
        {city:'福州',poi:'119.30347,26.080429'}
      ]
      for (var i = 0; i <9; i++) {
        Vue.set(this.hostCitys, j, citys[i]);

        j++;
      }
    },

    resetAd (){
      console.log("重置城市")
        this.$parent.resetAddress();
      // this.cityactive(0,'',this.addressData)
      this.$emit("tochildevent", this.cityName);
      this.cityClose();
    },
    cityactive: function(index, cityss,data) {
      this.cityClose();

      this.zimShow = false;
      if(cityss){
        this.$emit("tochildevent", cityss[index].city);
        this.$emit("pois", cityss[index].poi);
      }else{
        this.$emit("tochildevent", data.city);
        this.$emit("pois", data.poi);
      }
    },

    //侧栏字母鼠标按下事件

    mousedownFun: function(index) {
      this.zimShow = !this.zimShow;

      this.zimText = this.sidabers[index];
    },

    //侧栏字母鼠标弹起事件

    mouseupFun: function(index) {
      this.zimShow = !this.zimShow;

      var cityChoiceBox = document.getElementById("cityChoiceBox");

      var h3 = cityChoiceBox.getElementsByTagName("h3");

      var timer = null;
      var _this = this;
      function scrT(iTarget) {
        if(_this.outrun){
        clearInterval(timer);
        _this.outrun = false;
        document.ontouchstart = function() {
          clearInterval(timer);
        };
        setTimeout(() => {
            _this.outrun = true
        }, 600);
        timer = setInterval(function() {
          var scrollT =
              document.documentElement.scrollTop || document.body.scrollTop,
            speed = 0;

          speed = Math.floor((iTarget - scrollT) / 5);
          // if (scrollT == iTarget) {
          if (speed ==0 || speed  == -8) {
            clearInterval(timer);
          } else {
            document.documentElement.scrollTop = scrollT + speed;
            console.log('speed',speed)

            document.body.scrollTop = scrollT + speed;
          }
        }, 30);}
      }

      scrT(h3[index].offsetTop - 50);
    },
    touchStart(ev){
      ev= ev || event
      //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
      if(ev.touches.length == 1){
        // 记录开始位置
        this.startX = ev.touches[0].clientX;
      }
    },
    touchMove(ev){
       ev = ev || event;
          //获取删除按钮的宽度，此宽度为滑块左滑的最大距离
          if(ev.touches.length == 1) {
              // 滑动时距离浏览器左侧实时距离
              this.moveX = ev.touches[0].clientX
      
              //起始位置减去 实时的滑动的距离，得到手指实时偏移距离
              this.disX = this.startX - this.moveX;
          console.log(this.disX)
              // 如果是向左滑动或者不滑动
              if(this.disX > 0 || this.disX == 0) {
                  this.deleteSlider = "transform:translateX(0px)";
              //右滑
              }else if (this.disX < 0) {
                  console.log('进行滑动')
              }
          }
    },
    touchEnd(ev){
      ev = ev || event;
      if (ev.changedTouches.length == 1) {
            let endX = ev.changedTouches[0].clientX;
              
                this.disX = this.startX - endX;
                console.log(this.disX)
                //如果距离小于删除按钮一半,强行回到起点
                
                if (this.disX<100)  {
                  //小于一定值不操作
                }else{
                  // 大于三分之一关闭组件
                  this.cityClose()
                }
            }
        }     
  },

  //首字母过滤

  computed: {
    
    cityA: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "A";
      });
    },

    cityB: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "B";
      });
    },

    cityC: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "C";
      });
    },

    cityD: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "D";
      });
    },

    cityE: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "E";
      });
    },

    cityF: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "F";
      });
    },

    cityG: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "G";
      });
    },

    cityH: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "H";
      });
    },

    cityJ: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "J";
      });
    },

    cityK: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "K";
      });
    },

    cityL: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "L";
      });
    },

    cityM: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "M";
      });
    },

    cityN: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "N";
      });
    },

    cityP: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "P";
      });
    },

    cityQ: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "Q";
      });
    },

    cityR: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "R";
      });
    },

    cityS: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "S";
      });
    },

    cityT: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "T";
      });
    },

    cityW: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "W";
      });
    },

    cityX: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "X";
      });
    },

    cityY: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "Y";
      });
    },

    cityZ: function() {
      return this.citys.filter(function(item) {
        return item.py.substr(0, 1) == "Z";
      });
    },
  

    //搜索过滤
    sousuos: function() {
      var ssval = this.ssval;
      var arr =this.citys.filter(function(item) {
        return item.py && item.py.indexOf(ssval) != -1 || item.city && item.city.indexOf(ssval) != -1;
      })/* 
      var arr =this.searchCity.filter(function(item) {
        return item.pinyin && item.pinyin.indexOf(ssval) != -1 || item.name && item.name.indexOf(ssval) != -1;
      }) */
      return arr
    }
  },

  mounted: function() {
    window.addEventListener("load", function() {
      var searchBox = document.getElementById("search-box");

      var srollH = document.documentElement.scrollHeight;

      searchBox.style.height = srollH + "px";
    });
    /* for(var arr of this.citys){
      for(var arrc of arr.list){
        this.searchCity.push(arrc)
      }
    } */
    this.citys = cityList.citys
    console.log(cityList)
    this.hostCityss();
  }
};
</script>

<style>
</style>
