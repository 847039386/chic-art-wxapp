// pages/login/index.js
const { User } = require('@/api/index')
const { wxLogin } = require('@/utils/request')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxLoginLoading:false,
    wxExistLoading: false,
    loginLoading :false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  onLogin () {
    let that = this;
    this.setData({loginLoading :true ,wxExistLoading:true ,wxLoginLoading:true})
    wx.login({
      success: (wx_LoginRes) => {
        let code = wx_LoginRes.code
        User.wxExist(code).then((result)=>{
          let data = result.data;
          if(data){
            //有值直接登陆
            wxLogin({code}).then(()=>{
              wx.navigateTo({
                url: '/pages/shared/index/index',
              })
            }).catch((error) =>{
              console.log(error)
              wx.showToast({title: '失败',icon: 'error',duration: 2000})
            }).finally(() =>{
              this.setData({loginLoading :false})
            })
          }else{
            // 无值证明没注册，去注册页面
            wx.navigateTo({
              url: '/pages/shared/register/index',
            })
          }
        }).finally(() => {
          that.setData({ wxExistLoading :false })
        })
      },
      fail :(wx_LoginRes_err)=>{
        wx.showToast({title: '失败',icon: 'error',duration: 2000})
      },
      complete(){
        that.setData({ wxLoginLoading :false })
      }
    })
  }

})