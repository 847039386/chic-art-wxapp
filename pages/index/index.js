const app = getApp()
const { User } = require('../../api/index')
const { verifyToken } = require('../../utils/auth')
Page({
  data: {
    PageCur: 'templates'
  },
  onLoad(){
    if(!verifyToken()){
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
  },
  onShow(){

  },
  onSwitchTab:function(e){
    let PageCur = e.detail.PageCur;
    this.setData({ PageCur })
  }
})