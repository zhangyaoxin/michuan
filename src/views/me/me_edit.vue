<template>
  <div class="me_edit">
    <van-cell-group class="cell_group">
      <van-cell class="avatar_warp" title="头像" is-link>
        <van-uploader class="avatar" :after-read="upLoadAvatar">
          <img :src="userInfo.thumbnail|filterImg('avatar')" alt="">
        </van-uploader>
      </van-cell>
      <van-cell title="昵称" is-link @click="isShowPopup('isShowText','nickname')">
        <div>{{userInfo.nickname}}</div>
      </van-cell>
      <van-cell title="签名" is-link @click="isShowPopup('isShowText','motto')">
        <div>{{userInfo.motto||'我也来说点什么，介绍我自己!'}}</div>
      </van-cell>
    </van-cell-group>

    <!-- <van-cell-group class="cell_group">
      <van-cell title="等级" is-link to="me_level">
        <div>{{userInfo.badges[0]| filterLevel}}</div>
      </van-cell>
      <van-cell title="发布徽章" is-link to="me_badge">
        <img class="user_badge_item" :src="userInfo.badges[1]| filterBadge(putBadgeIcon)" alt="">
      </van-cell>
      <van-cell title="传播徽章" is-link to="me_badge">
        <img class="user_badge_item" :src="userInfo.badges[2] | filterBadge(shareBadgeIcon)" alt="">
      </van-cell>
    </van-cell-group> -->

    <van-cell-group class="cell_group">
      <van-cell title="性别" is-link @click="isShowPopup('isShowSex')">
        <div>{{userInfo.gender|filterSex}}</div>
      </van-cell>
      <van-cell title="生日" is-link @click="isShowPopup('isShowDate')">
        <div>{{userInfo.birthday|filterBirthday}}</div>
      </van-cell>
      <van-cell title="地区" is-link @click="isShowPopup('isShowArea')">
        <div>{{userInfo.location|filterLocation}}</div>
      </van-cell>
    </van-cell-group>

    <!-- 修改昵称 -->
    <van-popup position="bottom" v-model="isShowText">
      <div class="input_wrap">
        <van-field v-model="curEditText" type="textarea" :maxlength="maxText" :placeholder="plhText" rows="3" autosize />
        <div class="num_tip">{{maxText-curEditText.length}}</div>
        <div class="input_op">
          <div class="text_tip"></div>
          <div class="input_btn" @click="confirmNickname(curEditText)">确定</div>
        </div>
      </div>
    </van-popup>

    <!-- 选择性别 -->
    <van-popup v-model="isShowSex" position="bottom">
      <van-picker show-toolbar :columns="sexList" @change="onChange" @cancel="isShowSex=false" @confirm="confirmSex" />
    </van-popup>

    <!-- 选择生日 -->
    <van-popup v-model="isShowDate" position="bottom">
      <van-datetime-picker v-model="currentDate" type="date" :min-date="minDate" @confirm="confirmDate" @cancel="isShowDate=false" />
    </van-popup>

    <!-- 选择地区 -->
    <van-popup v-model="isShowArea" position="bottom">
      <van-area :area-list="areaList" :value="userInfo.location" @confirm="confirmArea" @cancel="isShowArea=false" />
    </van-popup>

    <!-- 裁剪 -->
    <!---->
    <crop-wrap :isCrop.sync="isCrop" :imgUrl="cropImg" :aspectRatio="aspectRatio" @cropDown="confirmAvatar"></crop-wrap>
  </div>
</template>

<script>
  import areaList from '@@@/area.js'
  import cropWrap from '@@/crop'

  import { mapState } from 'vuex'
  import { getStore, setStore } from '@/utils/utils'
  export default {
    name: 'me_edit',
    components: { cropWrap },
    data () {
      return {
        isCrop: false,
        cropImg: '',
        aspectRatio: 1,

        plhText: '请输入用户名',
        maxText: 11,
        isShowText: false,
        curEditText: '',
        curEditType: 'name',

        sexList: [
          { text: '保密', id: 0 },
          { text: '男', id: 1 },
          { text: '女', id: 2 }
        ],
        isShowSex: false,

        minDate: new Date('1900-01-01'),
        currentDate: new Date(),
        isShowDate: false,

        areaList,
        isShowArea: false,

        userInfo: {
          badges: []
        }
      }
    },
    filters: {
      filterLevel (obj) {
        return obj ? obj.name : 'Lv0'
      },
      filterBadge (obj, type) {
        if (obj && obj.thumbnail) return obj.thumbnail
        return type
      },

      filterSex (sex) {
        if (sex === 1) {
          return '男'
        } else if (sex === 2) {
          return '女'
        } else {
          return '保密'
        }
      },
      filterBirthday (date) {
        if (!date) return '保密'
        return new Date(date * 1000).format('yyyy-MM-dd')
      },
      filterLocation (code) {
        if (!code) return '保密'
        const province = String(code).slice(0, 2) + '0000'
        const city = String(code).slice(0, 4) + '00'
        const arr = [areaList.province_list[province], areaList.city_list[city], areaList.county_list[code]]
        const location = [...new Set(arr)].join('')
        return location
      }
    },
    computed: {
      ...mapState({
        qiniuBaseUrl: state => state.qiniuBaseUrl
      })
    },
    methods: {
      isShowPopup (md, type) {
        console.log(md)
        this.isShowSex = false
        this.isShowDate = false
        this.isShowArea = false
        if (md === 'isShowText') {
          this.curEditType = type
          if (type === 'nickname') {
            this.plhText = '请输入用户名'
            this.maxText = 11
            this.curEditText = this.userInfo.nickname
          } else {
            this.plhText = '请输入用户签名'
            this.maxText = 20
            this.curEditText = this.userInfo.motto || ''
          }
        }
        this[md] = true
      },

      upLoadAvatar (file) {
        this.cropImg = file.content
        this.isCrop = true
        // const res = await this.$store.dispatch('upLoadQIniu', file.file)
        // const url = this.qiniuBaseUrl + res

      },
      confirmAvatar (url) {
        console.log(url)
        this.userInfo.thumbnail = url
        this.handlerEdit({ thumbnail: url })
      },

      confirmNickname (name) {
        const type = this.curEditType
        if (!name && type === 'name') {
          this.$toast('请输入用户名')
          return false
        }
        this.userInfo[type] = name
        this.handlerEdit({ [type]: name }, 'isShowText')
      },

      confirmSex (gender) {
        this.userInfo.gender = gender.id
        this.handlerEdit({ gender: gender.id }, 'isShowSex')
      },

      confirmDate (date) {
        console.log(date)
        const time = parseInt(new Date(date).getTime() / 1000)
        this.userInfo.birthday = time
        this.handlerEdit({ birthday: time }, 'isShowDate')
      },

      confirmArea (area) {
        this.userInfo.location = area[2].code
        this.handlerEdit({ location: area[2].code }, 'isShowArea')
      },

      handlerEdit (params, type) {
        const res = this.$store.dispatch('editUserInfo', params)
        if (res) {
          if (type) {
            this[type] = false
          }
          setStore('userInfo', this.userInfo)
        }
      }
    },
    async created () {
      const { data } = await this.$store.dispatch('getUserInfo')
      this.currentDate = new Date(Number(data.birthday) * 1000)
      this.userInfo = data
    }
  }
</script>


<style lang="scss">
  .me_edit {
    .cell_group {
      margin-top: 0.533333rem;
    }
    .van-cell {
      font-size: 0.8rem;
      color: #000;
    }
    .van-cell__value {
      color: #999;
    }

    .user_badge_item {
      margin-top: 0.266667rem;
      width: 0.96rem;
      height: 0.8rem;
    }
    .avatar_warp {
      .van-cell__value {
        overflow: initial;
      }
    }
    .avatar {
      position: relative;
      left: -100px;
      width: 161%;
      overflow: hidden;
      img {
        width: 1.333333rem;
        height: 1.333333rem;
        border-radius: 100%;
      }
    }
    .input_wrap {
      background: #f4f4f4;
      padding: 0.8rem;
      padding-bottom: 0.533333rem;
      .van-cell {
        border: 1px solid #ddd;
        border-radius: 0.426667rem;
      }
    }
    .num_tip {
      position: absolute;
      right: 1.173333rem;
      bottom: 2.666667rem;
      color: #999;
    }
    .input_op {
      display: flex;
      align-items: center;
      margin-top: 10px;
    }
    .text_tip {
      flex: 1;
      font-size: 0.64rem;
      color: #999;
    }
    .input_btn {
      padding: 0.106667rem 0.853333rem;
      background: #ff4c4c;
      color: #fff;
      border-radius: 0.213333rem;
    }
  }
</style>
