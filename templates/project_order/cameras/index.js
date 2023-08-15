// templates/project_order/camera/index.js
const { ProjectOrder } = require('../../../api/index')
Component({
  options: {
    addGlobalClass: true
  },
  properties:{
    aid :String
  },
  lifetimes : {
    ready:function(){
      const id = this.properties.aid;
      this.getCameras(id)
      this.setData({id})
    }
  },
  data: {
    id:null,
    loading:false,
    cameraList:[],   // 监控列表
  },
  methods: {
    getCameras(id){
      this.setData({loading :true})
      ProjectOrder.getCameras(id).then((result) => {
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
    }
    
  }
})
