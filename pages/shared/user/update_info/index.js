// pages/user/update_info/index.js
const { getUserInfo ,setUserInfo } = require('@/utils/auth') 
const {  User ,File } = require('@/api/index'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name :null,
    phone:null,
    avatar :null
  },

  onShow(){
    this._init();
  },
  _init(){
    let info = getUserInfo();
    this.setData({ name : info.name ,phone :info.phone , nickname :info.nickname ,avatar :info.avatar })
  },
  toUserUpdateNamePage(){
    wx.navigateTo({
      url: '/pages/shared/user/update_name/index',
    })
  },
  toUserUpdateNickNamePage(){
    wx.navigateTo({
      url: '/pages/shared/user/update_nickname/index',
    })
  },
  toUserUpdatePhonePage(){
    wx.navigateTo({
      url: '/pages/shared/user/update_phone/index',
    })
  },
  toUserUpdateAvatarPage(){
    wx.navigateTo({
      url: '/pages/shared/user/update_avatar/index',
    })
  },

  logout(){
    wx.showModal({
      title: '提示',
      content: '是否退出登陆？',
      complete: (res) => {
        if (res.confirm) {
          wx.removeStorage({
            key: 'accessToken',
            success (res) {
              wx.redirectTo({
                url: '/pages/shared/login/index',
              })
            }
          })
        }
      }
    })
  },
  updateAvatar(){
    const that = this;
    const avatar = this.data.avatar;
    wx.chooseMedia({
      count: 1,
      mediaType:['image'],
      sizeType: ['compressed'],//压缩
      sourceType: [ 'album'],//支持选取图片
      success (res) {
        const imgUrl = res.tempFiles[0].tempFilePath;
        File.uploadUserAvatarLogo(imgUrl).then((res) => {
          let avatarLocalPath = res.data.url;
          User.updateAvatar(avatarLocalPath).then(() => {
            let userinfo = getUserInfo();
            userinfo.avatar = avatarLocalPath;
            setUserInfo(userinfo);
            that._init();
            console.log('头像修改成功')
          })
        }).catch((err) =>{
          wx.showModal({
            title: '错误',
            content: err.message,
            showCancel: false,
          })
        })
      }
    })
  },
  updateUserAvatar(){

  }

  

  

})