// pages/login/info/index.js
const { wxLogin } = require('../../../utils/request')
const { File } = require('../../../api/index')

Page({
  data: {
    avatar: null,
    nickname :null,
    theme: wx.getSystemInfoSync().theme,
  },
  onLoad() {

  },
  handleNickNameInput(e){
    this.setData({ nickname :e.detail.value })
  },
  bindAvatarChange () {
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType:['image'],
      sizeType: ['compressed'],//压缩
      sourceType: [ 'album'],//支持选取图片
      success (res) {
        // 只有一张
        that.setData({avatar :res.tempFiles[0].tempFilePath })
      }
    })
  },
  onRegister(){
    let that = this;
    let avatar = that.data.avatar;
    let nickname = this.data.nickname;
    let newformData = { }
    this.setData({ loading:true })
    if(avatar){
      File.uploadUserAvatarLogo(avatar).then((res) => {
        let avatarLocalPath = res.data.url;
        newformData = { avatar : avatarLocalPath ,nickname }
        that.onLogin(newformData)
      }).catch((err) =>{
        wx.showModal({
          title: '错误',
          content: err.message,
          showCancel: false,
        })
        this.setData({loading:false})
      })
    }else{
      newformData = { avatar : '/images/nuser.png' ,nickname }
      that.onLogin(newformData)
    }
  },
  onLogin(data){
    wxLogin(data).then(() => {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }).catch((err) => {
      wx.showModal({
        title: '错误',
        content: err.message,
        showCancel: false,
      })
    }).finally(() =>{
      this.setData({loading:false})
    })
  }
})