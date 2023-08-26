const app = getApp()
const { getAppMode } = require('@/utils/storage/app_mode')
Page({
  data: {
    APP_MODE:null,
    PageCur: null
  },
  onLoad(){
    const APP_MODE = getAppMode();
    if(APP_MODE == 'WORK'){
      this.setData({ PageCur :'WorkProjectOrder' });
    }else{
      this.setData({ PageCur : 'ClientProjectOrder'});
    }


    this.setData({APP_MODE})
  },
  onShow(){

  },
  onSwitchTab:function(e){
    let PageCur = e.detail.PageCur;
    this.setData({ PageCur })
  }
})