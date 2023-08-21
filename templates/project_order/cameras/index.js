// templates/project_order/camera/index.js
const { ProjectOrder, Company } = require('../../../api/index');
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
      this.getCompanyCameras()
      this.getCameras()
    }
  },
  data: {
    project_order_id:null,
    company_id :null,
    loading:false,
    CustomBar: app.globalData.CustomBar,
    cameraList:[],   // 监控列表
    cameraAllList :[],  //右侧抽屉列表
    cameraAllListLoading :false,  //右侧抽屉里藏着的可分配监控列表Loading
    camerasModal:false
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
    getCompanyCameras(){
      const company_id = this.data.company_id;
      this.setData({cameraAllListLoading:true})
      Company.getCamerasAssignList(company_id).then((result) => {
        let cameraAllList = result.data.rows;
        this.setData({cameraAllList})
      }).finally(() =>{
        this.setData({cameraAllListLoading:false})
      })
    },
    hideModal(){
      this.setData({camerasModal:false})
    },
    showModal(){
      this.setData({camerasModal:true})
    },
    addCamera(event){
      let company_camera_id = event.currentTarget.dataset.id;
      let project_order_id = this.data.project_order_id;
      wx.showModal({
        content: '是否添加该监控',
        complete: (res) => {
          if (res.confirm) {
            this.setData({ cameraAllListLoading :true ,loading:true})
            wx.showLoading({mask:true});
            ProjectOrder.addCamera(company_camera_id,project_order_id).then((result) => {
              wx.showToast({title: '成功'})
              this.getCompanyCameras()
              this.getCameras()
            }).finally(() => {
              wx.hideLoading();
            })
          }
        }
      })
    }
  }
})
