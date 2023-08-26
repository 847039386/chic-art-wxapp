// templates/client/project_order/cameras/list/index.js
const { ProjectOrder } = require('@/api/index')
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
      this.setData({ project_order_id })
      this.getCameras()
    }
  },
  data: {
    project_order_id:null,
    loading:false,
    CustomBar: app.globalData.CustomBar,
    cameraList:[],   // 监控列表
  },
  methods: {
    getCameras(){
      const project_order_id = this.data.project_order_id;
      this.setData({loading :true})
      ProjectOrder.getCameras(project_order_id).then((result) => {
        result.data = result.data.filter((item) => {
          return item.state == 0;
        })

        this.setData({cameraList : result.data})
      }).finally(() => {
        this.setData({loading:false})
      })
    },
    toCameraVideoPage(event){
      let url = event.currentTarget.dataset.url
      wx.navigateTo({
        url: `/pages/work/camera/project_order/video/index?url=${url}`,
      })
    },
  }
})

