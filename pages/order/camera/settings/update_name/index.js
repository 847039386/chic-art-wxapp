// pages/order/camera/settings/update_name/index.js
const { ProjectOrder } = require('../../../../../api/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    name:null,
    loading :false,
    isError:false,
    oldName:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const name = options.name;
    const id = options.id;
    this.setData({ name ,id ,oldName:name })
  },
  handleNameInput (e) {
    this.setData({ name :e.detail.value})
  },
  updateName(){
    this.setData({loading:true})
    let id = this.data.id;
    let name = this.data.name;
    ProjectOrder.updateCameraName(id,name).then((result) => {
      wx.navigateBack({ delta: 1 })
    }).catch(() => {
      this.setData({ isError:true })
    }).finally(() => {
      this.setData({loading:false})
    })
  },
  // 卸载页面时为上一页面赋值
  onUnload(){
    let that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      name :that.data.isError ? that.data.oldName : that.data.name
    })
  }

})