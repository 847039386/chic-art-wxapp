const app = getApp()
const { verifyToken } = require('@/utils/auth')
const { getAppMode } = require('@/utils/storage/app_mode')
Page({
  data: {
    APP_MODE:null,
    PageCur: null
  },
  onLoad(){

    if(!verifyToken()){
      wx.redirectTo({
        url: '/pages/shared/login/index',
      })
    }else{
      const APP_MODE = getAppMode();
      if(APP_MODE == 'WORK'){
        this.setData({ PageCur :'WorkProjectOrder' });
      }else{
        this.setData({ PageCur : 'ClientProjectOrder'});
      }
      this.setData({APP_MODE})
    }
    
  },
  onShow(){

  },
  onSwitchTab:function(e){
    let PageCur = e.detail.PageCur;
    this.setData({ PageCur })
  }
})