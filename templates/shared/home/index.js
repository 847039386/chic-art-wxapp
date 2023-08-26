// pages/template/home/index.js
const { getUserInfo } = require('@/utils/auth')
const { userScanCode } = require('@/utils/scan_code')
const { getAppMode, switchWorkAppMode, switchClientAppMode } = require('@/utils/storage/app_mode')
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的初始数据
   */
  data: {
    username:'',
    avatar:'',
    APP_MODE :null,
  },
  onShow(){
    console.log('我时设置页面')
  },
  lifetimes : {
    attached:function(){
      let userinfo = getUserInfo()
      let nickname = userinfo.nickname;
      let avatar = userinfo.avatar;
      let APP_MODE = getAppMode()
      this.setData({nickname ,avatar ,APP_MODE})
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
            setTimeout(() => {
              wx.showToast({ title: '成功' })
            },100)
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
    },
    updateAppMode(){
      wx.showModal({
        title: '提示',
        content: '是否切换模式？',
        complete: (res) => {
          if (res.confirm) {
            const APP_MODE = this.data.APP_MODE;
            if(APP_MODE == 'CLIENT'){
              switchWorkAppMode();
            }else{
              switchClientAppMode();
            }
            wx.reLaunch({url: '/pages/shared/index/index'})
          }
        }
      })
    }
  }
  
})
