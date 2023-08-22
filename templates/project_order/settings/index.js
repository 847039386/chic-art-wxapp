// templates/project_order/settings/index.js
const { ProjectOrder } = require('../../../api/index');
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
      this.setData({id})
      this.getInfo(id);
    }
  },
  pageLifetimes:{
    // 当用户设置了订单摄像头某个东西后重返这个页面走这个方法
    show(){
      const id = this.data.id;
      this.getInfo(id);
    }
  },
  data: {
    loading:true,
    id : null,
    errMsg :null,
    delButtonLoading :false,
    isDel:false,
    projectOrder : { },
  },
  methods: {
    getInfo(id){
      this.setData({loading:true})
      ProjectOrder.getInfoById(id).then((result) => {
        this.setData({ projectOrder : result.data })
      }).catch((err) => {
        this.setData({ errMsg : err.message })
      }).finally(() => {
        this.setData({loading:false})
      })
    },
    toUpdateNamePage(){
      let name = this.data.projectOrder.name;
      let id = this.data.id;
      wx.navigateTo({
        url: `/pages/order/settings/update_name/index?id=${id}&name=${name}`,
      })
    },
    toUpdateAddressPage(){
      let address = this.data.projectOrder.address;
      let id = this.data.id;
      wx.navigateTo({
        url: `/pages/order/settings/update_address/index?id=${id}&address=${address}`,
      })
    },
    removeOrder () {
      wx.showModal({
        title: '警告',
        content: '订单删除后将不可恢复，请谨慎操作',
        complete: (res) => {
          if (res.confirm) {
            const id = this.data.id;
            this.setData({ delButtonLoading :true })
            ProjectOrder.remove(id).then(() => {
              wx.navigateBack({ delta: 1 })
              // 因为删除了订单，但是上级页面是模板，所以用笨方法告诉上级页面要刷新页面了
              wx.setStorageSync("needRefresh", true);
              this.setData({ isDel :true })
            }).finally(() => {
              this.setData({ delButtonLoading :false })
            })
          }
        }
      })
    }
  }
})
