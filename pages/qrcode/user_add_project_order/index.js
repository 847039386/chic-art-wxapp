// pages/qrcode/user_add_project_order/index.js
const { ProjectOrder } = require('../../../api/index')
const { getUserInfo } = require('../../../utils/auth')
const { getImageUrl } = require('../../../utils/util')
const drawQrcode = require('../../../common/weapp_qrcode/weapp.qrcode.common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    id : null,
    projectOrder : { }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let id = options.id;
    this.getInfo(id)
    this.setData({id})
    const jsonData = {
      type:'CustomerAddProjectOrder',
      content :'客户添加项目订单',
      project_order_id : id
    }
    drawQrcode({
      width: 130,
      height: 130,
      canvasId: 'myQrcode',
      text: JSON.stringify(jsonData),
    })
  },
  getInfo(id){
    this.setData({loading:true})
    ProjectOrder.getInfoById(id).then((result) => {
      if(result.data.user_id){
        result.data.user_id.avatar = getImageUrl(result.data.user_id.avatar)
      }
      this.setData({ projectOrder : result.data })
    }).finally(() => {
      this.setData({loading:false})
    })
  },

})