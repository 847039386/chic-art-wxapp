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
    loading:false,
    state:0,
    // 数据
    currentPage:1,
    total:0,
    totalPage :0,
    orderList:[],
  },
  lifetimes : {
    attached:function(){
      this.getList(1)
    }
  },
  methods: {
    toProjectOrderInfoPage(event){
      const id = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/order/info/index?id=${id}`,
      })
    },
    getList:function(page){
      let state = this.data.state;
      let data = { page ,state}
      this.setData({loading :true})
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
        this.setData({ 
          orderList :result.data.rows,
          total :result.data.total,
          totalPage :result.data.totalPage
        })
      }).finally(() => {
        this.setData({loading :false})
      })
    },
    onSwitchOrderTab(event){
      let state = event.currentTarget.dataset.state;
      this.setData({state})
      this.getList(1)
    }
  }
})
