// pages/company/employees/settings/update_remark/index.js
const { Company } = require('../../../../../api/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    remark:null,
    loading :false,
    isError:false,
    oldRemark:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let id = options.id;
    let remark = options.remark;
    this.setData({ id ,remark ,oldRemark:remark })
  },
  handleRemarkInput (e) {
    this.setData({ remark :e.detail.value})
  },
  updateRemark(){
    this.setData({loading:true})
    let id = this.data.id;
    let remark = this.data.remark
    Company.updateEmployeeRemark(id ,remark).then(() => {
      wx.navigateBack({ delta: 1 })
    }).catch(()=>{
      this.setData({ isError:true })
    }).finally(() => {
      this.setData({loading:false})
    })
  },
  // 卸载页面时为上一页面赋值
  onUnload(){
    let that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      remark:that.data.isError ? that.data.oldRemark : that.data.remark
    })
  }

  
})