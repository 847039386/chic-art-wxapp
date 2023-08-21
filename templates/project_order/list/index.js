// templates/order/index.js
const { ProjectOrder } = require('../../../api/index')
const { getImageUrl } = require('../../../utils/util')
const app = getApp()

Component({
  options: {
    addGlobalClass: true
  },
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
  lifetimes : {
    attached:function(){
      // 获取内容高度根据wx小程序屏幕高度
      let windowHeight = wx.getSystemInfoSync().windowHeight
      let rate = 750 / wx.getSystemInfoSync().windowWidth
      let contentH = windowHeight * rate;
      contentH = contentH - 355
      this.setData({ contentH })
      this._onRefresh();
    }
  },
  methods: {
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
      wx.navigateTo({
        url: `/pages/order/info/index?id=${id}&company_id=${company_id}`,
      })
    },
    getList:function(page){
      let state = this.data.state;
      let data = { page ,state}
      return new Promise((resolve, reject) => {
        ProjectOrder.getList(data).then((result) =>{
          let rows = result.data.rows;
          rows.map((item) => {
            item.project_order_id.company_id.logo = getImageUrl(item.project_order_id.company_id.logo)
            item.project_order_id.user_id.avatar = getImageUrl(item.project_order_id.user_id.avatar)
            let step = item.project_order_id.step + 1;
            let progress_template = item.project_order_id.progress_template;
            item.project_order_id.progress_state = (step/progress_template.length*100).toFixed(0)+"%"
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
  }
})
