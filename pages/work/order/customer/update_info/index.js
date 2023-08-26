// pages/work/order/customer/update_info/index.js
const { ProjectOrder } = require('@/api/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id :null,
    visible_state :null,
    switchVisibleChecked :false,
    upVisibleLoading :false,
    isRemove:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id;
    const visible_state = Number(options.visible_state);
    let switchVisibleChecked = false;
    if(visible_state == 0){
      switchVisibleChecked = true
    }
    this.setData({ id ,visible_state ,switchVisibleChecked })
  },
  switchVisibleState(event){
    let id = this.data.id;
    let value = event.detail.value;
    let visible_state = value ? 0 : 1
    this.setData({upVisibleLoading:true})
    ProjectOrder.updateCustomerVisibleState(id,visible_state).then(() => {
      this.setData({switchVisibleChecked:value})
    }).catch(() => {
      this.setData({switchVisibleChecked:!value})
    }).finally(()=>{
      this.setData({upVisibleLoading:false})
    })
  },
  removeProjectOrderCustomer(){
    const that = this;
    if(!that.data.isRemove){
      wx.showModal({
        title: '提示',
        content: '删除后，该客户将访问不到该订单是否继续？',
        complete: (res) => {
          if (res.confirm) {
            const id = that.data.id;
            wx.showLoading({mask:true})
            ProjectOrder.removeCustomer(id).then(() => {
              this.setData({ isRemove:true })
              wx.navigateBack({ delta: 1 })
            }).finally(() => {
              wx.hideLoading()
            })
          }
        }
      })
    }
  },

})