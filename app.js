const { verifyToken } = require('@/utils/auth')
App({
  onLaunch() {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

    if(!verifyToken()){
      wx.redirectTo({
        url: '/pages/shared/login/index',
      })
    }
    
  },
  globalData: {
    userInfo: null
  }
})