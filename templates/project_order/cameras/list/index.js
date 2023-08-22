// templates/project_order/camera/index.js
const { ProjectOrder } = require('../../../../api/index');
const app = getApp();
Component({
  options: {
    addGlobalClass: true
  },
  properties:{
    aid :String,
    cid :String
  },
  lifetimes : {
    ready:function(){
      const project_order_id = this.properties.aid;
      const company_id = this.properties.cid;
      this.setData({ project_order_id ,company_id})
      this.getCameras()
    }
  },
  data: {
    project_order_id:null,
    company_id :null,
    loading:false,
    CustomBar: app.globalData.CustomBar,
    cameraList:[],   // 监控列表
  },
  methods: {
    getCameras(){
      const project_order_id = this.data.project_order_id;
      this.setData({loading :true})
      ProjectOrder.getCameras(project_order_id).then((result) => {
        this.setData({cameraList : result.data})
      }).finally(() => {
        this.setData({loading:false})
      })
    },
    toCameraVideoPage(event){
      let url = event.currentTarget.dataset.url
      wx.navigateTo({
        url: `/pages/camera/project_order/video/index?url=${url}`,
      })
    },
  }
})
