// pages/order/camera/settings/index.js
const { ProjectOrder } = require('../../../../../api/index')
Page({
  data: {
    errMsg:null,
    loading:false,
    id :null,
    name :null,  //摄像头别名
    dataInfo :null,
    delButtonLoading :false,
    isDel :false,
    isAllowCustomerSee : false,
    switchAllowCustomerSeeLoading :false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id;
    this.setData({id})
    this.getCameraById(id)
  },
  getCameraById(id){
    this.setData({loading :true})
    ProjectOrder.getCameraById(id).then((result) => {
      let data = result.data;
      let state = data.state;
      this.setData({ name :data.name ,dataInfo :data ,isAllowCustomerSee :state == 0 ? true :false })
    }).catch((err) => {
      this.setData({ errMsg : err.message || '未知错误' })
    }).finally(() => {
      this.setData({loading :false})
    })
  },
  toCameraVideoPage(event){
    let url = event.currentTarget.dataset.url
    wx.navigateTo({
      url: `/pages/camera/project_order/video/index?url=${url}`,
    })
  },
  updateState(event){
    let id = this.data.id;
    let value = event.detail.value
    let state = 0
    this.setData({switchAllowCustomerSeeLoading :true})
    if(value){
      state = 0;  // 0为允许所有人
    }else{
      state = 1 // 1为拒绝用户查看
    }
    ProjectOrder.updateCameraState(id,state).then(() => {
      this.setData({isAllowCustomerSee : value })
    }).catch(() => {
      this.setData({isAllowCustomerSee : this.data.isAllowCustomerSee })
    }).finally(() =>{
      this.setData({switchAllowCustomerSeeLoading :false})
    })
  },
  toUpdateNamePage(){
    let name = this.data.name;
    let id = this.data.id;
    wx.navigateTo({
      url: `/pages/order/camera/settings/update_name/index?id=${id}&name=${name}`,
    })
  },
  removeCamera(){
    wx.showModal({
      title: '提示',
      content: '删除后，监控将进入可分配列表，但该订单将无法查看到监控信息，是否删除？',
      complete: (res) => {
        if (res.confirm) {
          const id = this.data.id;
          this.setData({ delButtonLoading:true })
          ProjectOrder.removeCamera(id).then(() =>{
            wx.navigateBack({ delta: 1 })
            this.setData({ isDel :true })
          }).finally(() => {
            this.setData({ delButtonLoading :false })
          })
        }
      }
    })
  }
})