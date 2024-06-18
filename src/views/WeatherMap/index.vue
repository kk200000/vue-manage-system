<template>
  <div class="Container">
    <div>
      <h2 class="title">天气预报</h2>
      <div class="weather">
        <div class="City">当前位置：{{ MyCity }}</div>

        <div :key="key" v-for="(value, key) in Weather" class="nowWeather">
          {{ key }}:{{ value }}
        </div>
      </div>
    </div>

    <div>
      <h2 class="title">GIS展示</h2>
      <div class="GIS">
        <input
          placeholder="请输入地址..."
          type="text"
          @input="getGIS(myMap)"
          v-model="keyword"
        />
        <div class="title1">{{ MyLocation }}</div>
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onMounted,
  reactive,
  ref,
  watch,
  watchEffect,
  shallowRef,
  onUnmounted,
} from 'vue'
import dayjs from 'dayjs'
import AMapLoader from '@amap/amap-jsapi-loader'

const MyLocation = ref('等待您输入位置...') // 地址显示
const Weather = ref(null) // 当前天气
const MyCity = ref('正在加载中...') // 当前城市
const keyword = ref('') // 用户输入城市

// let map = shallowRef(null) // 高德Amap Api
let myMap = null // 高德MAP实例装载
let timer = ref(0) // 一秒钟计时器ID

// 高德地图初始化
onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: 'e28accfdca294e3429ec2299c80ae1bc',
  }
  AMapLoader.load({
    key: 'b2f42968b08277058fc4491ef02dd264', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      'AMap.Autocomplete',
      'AMap.Geolocation',
      'AMap.Weather',
      'AMap.PlaceSearch',
    ],
  })
    .then((AMap) => {
      myMap = new AMap.Map('map', {
        divMode: '3D',
        // resizeEnable: true,
        zoom: 10,
      })

      AMap.plugin(
        [
          'AMap.Autocomplete',
          'AMap.Weather',
          'AMap.Geolocation',
          'AMap.PlaceSearch',
        ],
        // 这里同时加载三个组件
        function () {
          // 查询地理位置
          var geolocation = new AMap.Geolocation({
            // 是否使用高精度定位，默认：true
            enableHighAccuracy: true,
            // 设置定位超时时间，默认：无穷大
            timeout: 2000,
            // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
            buttonOffset: new AMap.Pixel(10, 20),
            //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            zoomToAccuracy: false,
            //  定位按钮的排放位置,  RB表示右下
            buttonPosition: 'RB',
            getCityWhenFail: true,
            needAddress: true,
            extensions: 'all',
          })
          // 创建地点搜索实例
          // var auto = new AMap.AutoComplete({ city: '全国' })
          // var placeSearch = new AMap.PlaceSearch({
          //   map: myMap,
          // }) //构造地点查询类
          // auto.on('select', select) //注册监听，当选中某条记录时会触发
          function select(e) {
            placeSearch.setCity(e.poi.adcode)
            placeSearch.search(e.poi.name) //关键字查询查询
          }

          geolocation.getCurrentPosition()
          AMap.Event.addListener(geolocation, 'complete', onComplete)
          AMap.Event.addListener(geolocation, 'error', onError)

          function onComplete(data) {
            console.log({ data })
            // data是具体的定位信息
            if (data.location_type === 'html5')
              MyCity.value = data.addressComponent.city
            else MyCity.value = data.city
            // 观察MyCity变化时执行
            watchEffect(() => {
              // console.log (MyCity.value) 监听
              getWeather(AMap)
            })
          }

          function onError(err) {
            console.log(err)
            // MyCity.value = err.city
          }
        }
      )
    })
    .catch((e) => {
      console.log(e)
    })
})

// 创建天气查询实例
const getWeather = (AMap) => {
  var weather = new AMap.Weather()

  //执行实时天气信息查询
  weather.getLive(MyCity.value, function (err, data) {
    let keMap = {
      省份: data.province,
      天气: data.weather,
      温度: data.province,
      风向: data.windDirection,
      风力: data.windPower,
      有效时间: dayjs(data.reportTime).format('YYYY年MM月DD日 hh:mm:ss'),
      '空气湿度(百分比)': `${data.humidity}%`,
    }
    Weather.value = keMap
  })
}

const getGIS = () => {
  MyLocation.value = '正在查询中...'
  clearTimeout(timer)
  timer = setTimeout(() => {
    myMap.plugin('AMap.PlaceSearch', function () {
      let PlaceSearchOptions = {
        //设置PlaceSearch属性
        city: '全国', //城市
        pageSize: 10, //每页结果数,默认10
        pageIndex: 1, //请求页码，默认1
        extensions: 'base', //返回信息详略，默认为base（基本信息）
      }
      var MSearch = new AMap.PlaceSearch(PlaceSearchOptions)
      MyLocation.value = `查询的地点: ${keyword.value}`
      MSearch.search(keyword.value, (status, res) => {
        console.log({ res, status })
        if (res.poiList.pois.length > 0 && res.info === 'OK') {
          let pos = [
            res.poiList.pois[0].location.lng,
            res.poiList.pois[0].location.lat,
          ]

          myMap.setZoomAndCenter(15, pos)
        } else {
          alert('该地点有误(只能查询国内)')
        }
      }) //关键字查询
    })
  }, 1000)
}

onUnmounted(() => {
  myMap?.destroy()
})
</script>

<style>
.title {
  font-weight: bolder;
  margin-bottom: 1.5rem;
  text-align: center;
}
.Container {
  display: flex;
  align-items: center;
  gap: 50px;
  height: 80vh;
}
.weather {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 20vw;
  height: 60vh;
  border: 1px solid black;
  border-radius: 5px;
  padding: 3%;
}

.GIS {
  width: 45vw;
  padding: 3%;
  /* border: 1px solid black; */
  border-radius: 5px;
  height: 60vh;
}
#map {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 50vh;
}
</style>
