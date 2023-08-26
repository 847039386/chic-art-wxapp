// pages/work/order/employee/update_info/index.js
const { ProjectOrder } = require('@/api/index');
const { getUserInfo } = require('@/utils/auth')
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
    isProjectFZR :false //是否是项目负责人
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id;
    const visible_state = Number(options.visible_state);
    let switchVisibleChecked = false;
    const userinfo = getUserInfo();
    if(userinfo.user_id == options.user_id){
      //是项目负责人，不显示删除员工按钮
      this.setData({ isProjectFZR :true })
    }
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
    ProjectOrder.updateEmployeeVisibleState(id,visible_state).then(() => {
      this.setData({switchVisibleChecked:value})
    }).catch(() => {
      this.setData({switchVisibleChecked:!value})
    }).finally(()=>{
      this.setData({upVisibleLoading:false})
    })
  },
  removeProjectOrderEmployee(){
    const that = this;
    if(!that.data.isRemove){
      wx.showModal({
        title: '提示',
        content: '删除后，该员工将访问不到该订单是否继续？',
        complete: (res) => {
          if (res.confirm) {
            const id = that.data.id;
            wx.showLoading({mask:true})
            ProjectOrder.removeEmployee(id).then(() => {
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