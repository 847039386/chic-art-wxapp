// pages/template/home/index.js
const { getUserInfo } = require('@/utils/auth')
const { userScanCode } = require('@/utils/scan_code')
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
  onShow(){
    console.log('我时设置页面')
  },
  lifetimes : {
    attached:function(){
      let userinfo = getUserInfo()
      let nickname = userinfo.nickname;
      let avatar = userinfo.avatar
      this.setData({nickname,avatar})
    }
  },
  pageLifetimes:{
    // 当用户修改昵称后返回上层页面的时候会走这个方法
    show(){
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
          const datajson = res.result;
          wx.showLoading()
          userScanCode(datajson).then(() => {
            wx.showToast({ title: '成功' })
          }).finally(() => {
            wx.hideLoading()
          })
        }
      })
    },
    toUserSettings(){
      wx.navigateTo({
        url: '/pages/shared/user/update_info/index',
      })
    },
    toMyProgressTemplatesSettings(){
      wx.navigateTo({
        url: '/pages/work/progress_template/list/index',
      })
    }
  }
  
})
