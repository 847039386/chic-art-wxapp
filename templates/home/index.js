// pages/template/home/index.js
const { getUserInfo } = require('../../utils/auth')
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的初始数据
   */
  data: {
    username:'',
    avatar:''
  },

  lifetimes : {
    attached:function(){
      let userinfo = getUserInfo()
      let nickname = userinfo.nickname;
      let avatar = userinfo.avatar
      this.setData({nickname,avatar})
    }
  },
  
  methods :{
    scan :function(){
      wx.scanCode({
        success(res) {
          console.log('扫描成功：', JSON.stringify(res))
        }
      })
    },
    toUserSettings(){
      wx.navigateTo({
        url: '/pages/user/update_info/index',
      })
    }
  }
  
})
