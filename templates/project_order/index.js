// templates/order/index.js
const { ProjectOrder } = require('../../api/index')
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
      console.log('走我了吗')
      this.getList(1)
    }
  },
  methods: {
    getList:function(page){
      let state = this.data.state;
      let data = { page ,state}
      ProjectOrder.getList(data).then((result) =>{
        this.setData({ 
          orderList :result.data.rows,
          total :result.data.total,
          totalPage :result.data.totalPage
        })
      })
    },
    onSwitchOrderTab(event){
      let state = event.currentTarget.dataset.state;
      this.setData({state})
      this.getList(1)
    }
  }
})
