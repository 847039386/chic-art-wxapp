// pages/camera/project_order/video/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url : null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let url = options.url
    this.setData({url})

    console.log(url)
  },

})