// pages/work/company/order_list/index.js
const { Company } = require('@/api/index')
const { getImageUrl } = require('@/utils/util')
const app = getApp()
Page({

  data: {
    CustomBar: app.globalData.CustomBar,
    refreshLoading:false,
    moreLoading:false,
    isMore :true,
    state:0,
    // 数据
    currentPage:1,
    total:0,
    totalPage :0,
    pageSize:10,
    orderList:[],
  },
  onLoad(options){
    const company_id = options.id;
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let rate = 750 / wx.getSystemInfoSync().windowWidth
    let contentH = windowHeight * rate - 245;
    this.setData({ contentH ,company_id })
    this._onRefresh();
  },
  onShow() {
    // 此方法与删除订单返回这个页面相对应
    let needRefresh = wx.getStorageSync("needRefresh")
    if(needRefresh){
      this.setData({orderList :[] })
      wx.removeStorageSync('needRefresh')
      this._onRefresh();
    }
  },
  _onRefresh() {
    this.setData({ isMore :true })
    if(this.data.refreshLoading == false){
      this.setData({ refreshLoading :true })
      this.getList(1).then((data) =>{
        if(data.rows.length == 0){
          this.setData({ isMore :false })
        }
        this.setData({ 
          currentPage :data.currentPage,
          orderList :data.rows,
          total :data.total,
          totalPage :data.totalPage,
          pageSize :data.pageSize
        })
      }).finally(() => {
        this.setData({ refreshLoading :false })
      })
    }
  },
  _onLoadmore(e) {
    let currentPage = this.data.currentPage;
    let totalPage = this.data.totalPage;
    if(currentPage < totalPage){
      let orderList = this.data.orderList;
      let page = currentPage + 1;
      this.setData({moreLoading:true})
      this.getList(page).then((data) =>{
        this.setData({ 
          currentPage :data.currentPage,
          orderList :orderList.concat(data.rows),
          total :data.total,
          totalPage :data.totalPage,
          pageSize :data.pageSize
        })
      }).finally(() => {
        this.setData({ moreLoading :false })
      })
    }else{
      this.setData({ isMore:false })
    }
  },
  toProjectOrderInfoPage(event){
    const id = event.currentTarget.dataset.id;
    const company_id = event.currentTarget.dataset.company_id;
    const user_id = event.currentTarget.dataset.user_id;
    wx.navigateTo({
      url: `/pages/work/order/info/index?id=${id}&company_id=${company_id}&user_id=${user_id}`,
    })
  },
  getList:function(page){
    const company_id = this.data.company_id;
    let state = this.data.state;
    let data = { page ,state ,company_id}
    return new Promise((resolve, reject) => {
      Company.getProjectOrderList(data).then((result) =>{
        let rows = result.data.rows;
        rows.map((item) => {
          item.company_id.logo = getImageUrl(item.company_id.logo)
          item.user_id.avatar = getImageUrl(item.user_id.avatar)
          let step = item.step + 1;
          let progress_template = item.progress_template;
          item.progress_state = (step/progress_template.length*100).toFixed(0)+"%"
          return item
        })
        resolve(result.data);
      }).catch(()=>{
        reject();
      })
    })
  },
  onSwitchOrderTab(event){
    let state = event.currentTarget.dataset.state;
    this.setData({ state ,orderList :[] });
    this._onRefresh();
  }

})