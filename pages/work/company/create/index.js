// pages/company/create/index.js
const { Tag ,File ,Company } = require('@/api/index')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    tags:[],
    logoImagePath:null,
    errMsg:null,
    bcc_loading:false,
    formData:{
      name :'',
      address:'',
      tag_ids:[],
      description :''
    },
    loading :false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({loading :true})
    Tag.getList().then((res) =>{
      this.setData({tags :res.data})
    }).finally(() => {
      this.setData({loading :false})
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  handleCompanyNameInput (e) {
    this.setData({
      "formData.name" :e.detail.value
    })
  },
  handleCompanyAddressInput(e){
    this.setData({ 'formData.address' :e.detail.value })
  },
  handleCompanyDescriptionInput (e) {
    this.setData({
      "formData.description" :e.detail.value
    })
  },
  bindTagChange (e) {
    let value = e.currentTarget.dataset.value
    let list = this.data.tags;
    let selectTagIds = []
    list.map(item => {
      if (item._id == value) {
        item.checked = !item.checked
      }
      if (item.checked == true) {
        selectTagIds.push(item._id)
      }
    })
    this.setData({
      tags :list ,
      "formData.tag_ids" :selectTagIds
    })
  },
  bindLogoImageChange () {
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType:['image'],
      sizeType: ['compressed'],//压缩
      sourceType: [ 'album'],//支持选取图片
      success (res) {
        // 只有一张
        that.setData({logoImagePath :res.tempFiles[0].tempFilePath })
      }
    })
  },
  bindCreateCompany () {
    let that = this;
    let errMsg = null;
    // 公司名称正则：2至12位，可以是中文、英文或数字
    var companyNamePattern = /^([a-zA-Z0-9\u4e00-\u9fa5]{2,12})$/;
    // 公司简介正则2-120位
    let companyDescriptionPattern = /^([\s\S]{2,120})$/;
    if(!companyNamePattern.test(that.data.formData.name)){
      errMsg = '公司名称只能包含中英文或数字，且2-12位'
    }
    if(that.data.formData.tag_ids.length == 0 || that.data.formData.tag_ids.length > 4){
      errMsg = '标签最少选中一个，最多选中四个'
    }
    if(!companyDescriptionPattern.test(that.data.formData.description)){
      errMsg = '公司简介长度应为2-120位'
    }
    if(errMsg){
      wx.showModal({
        title: '错误',
        content: errMsg,
        showCancel :false
      })
    }else{
      //如果用户填写了图片则先上传图片在创建公司，否则直接创建公司公司LOGO使用默认LOGO
      let logoImagePath = that.data.logoImagePath
      this.setData({ bcc_loading:true })
      if(logoImagePath){
        File.uploadCompanyLogo(logoImagePath).then((res) => {
          let logoLocalPath = res.data.url;
          let newformData = Object.assign(that.data.formData,{ logo : logoLocalPath })
          return Company.create(newformData)
        }).then(() => {
          wx.setStorageSync("needRefresh", true);
          wx.navigateBack({ delta: 1 })
        }).finally(() => {
          this.setData({bcc_loading:false})
        })
      }else{
        let newformData = Object.assign(that.data.formData,{ logo : '/images/nlogo.png'})
        Company.create(newformData).then((res) => {
          wx.setStorageSync("needRefresh", true);
          wx.navigateBack({ delta: 1 })
        }).finally(() => {
          this.setData({ bcc_loading:false})
        })
      }
    }
  },
  openMap (){
    wx.chooseLocation({
      success:(res) => {
        this.setData({ 'formData.address' :res.address })
      }
    })
  },
})