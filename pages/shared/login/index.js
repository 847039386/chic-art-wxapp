// pages/login/index.js
const { User } = require('@/api/index')
const { wxLogin } = require('@/utils/request')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxLoginLoading:false,
    loginLoading :false,
    mess:'aaaa'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  onLogin () {
    let that = this;
    this.setData({loginLoading :true ,wxLoginLoading:true})
    wx.login({
      success: (wx_LoginRes) => {
        let code = wx_LoginRes.code
        // 如果域名是非法的则这端代码报错errno:600002，小程序必须调取域名是https，而测试的时候是用IP测试，一旦放到体验版后
        // 该代码会返回错误信息。此时体验版需开启vConsole模式可跳过。
        User.wxExist(code).then((result)=>{
          let data = result.data;
          if(data){
            //有值直接登陆
            wxLogin({code}).then(()=>{
              wx.navigateTo({
                url: '/pages/shared/index/index',
              })
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
          that.setData({ loginLoading :false })
        })
      },
      fail :(wx_LoginRes_err)=>{
        that.setData({ loginLoading:false })
      },
      complete(){
        that.setData({ wxLoginLoading :false })
      }
    })
  }

})