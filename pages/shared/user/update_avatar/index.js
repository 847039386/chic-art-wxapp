// pages/shared/user/update_avatar/index.js
const { getUserInfo ,setUserInfo } = require('@/utils/auth') 
const { getImageUrl } = require('@/utils/util')
const {  User ,File } = require('@/api/index'); 

Page({

  data: {
    avatar :null
  },

  onLoad(options) {
    let info = getUserInfo();
    this.setData({ avatar :info.avatar })
  },
  selectedImage(){
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType:['image'],
      sizeType: ['compressed'],//压缩
      sourceType: [ 'album'],//支持选取图片
      success (res) {
        const imgUrl = res.tempFiles[0].tempFilePath;
        that.updateAvatar(imgUrl)
      }
    })
  },
  updateAvatar(imgUrl){
    const that = this;
    let avatarLocalPath = ''
    wx.showLoading({ mask: true })
    File.uploadUserAvatarLogo(imgUrl).then((res) => {
      avatarLocalPath = res.data.url;
      return User.updateAvatar(avatarLocalPath)
    }).then(() => {
      let userinfo = getUserInfo();
      userinfo.avatar = avatarLocalPath;
      setUserInfo(userinfo);
      that.setData({ avatar :getImageUrl(avatarLocalPath) })
      wx.showToast()
    }).finally(() => {
      wx.hideLoading()
    })
  }

})