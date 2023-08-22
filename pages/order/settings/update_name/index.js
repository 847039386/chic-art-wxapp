// pages/order/settings/update_name/index.js
const { ProjectOrder } = require('../../../../api/index')
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
    ProjectOrder.updateName(id,name).then((result) => {
      wx.setStorageSync("needRefresh", true);
      wx.navigateBack({ delta: 1 })
    }).catch(() => {
      this.setData({ isError:true })
    }).finally(() => {
      this.setData({loading:false})
    })
  },
})