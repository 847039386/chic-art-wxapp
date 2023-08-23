// pages/work/progress_template/create/index.js
const { setMyProgressTemplate } = require('@/utils/storage/progress_template')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name : null,
    template :null,
    createOk :false
  },
  onLoad(options) {

  },
  handleNameInput(e){
    this.setData({ name :e.detail.value})
  },
  handleTemplateInput(e){
    this.setData({ template :e.detail.value})
  },
  createTemplate(){
    const name = this.data.name;
    const template = this.data.template;
    let errMsg = '';
    let progressTemplatePattern = /^[A-Za-z0-9\u4e00-\u9fa5]{1,10}(\-[A-Za-z0-9\u4e00-\u9fa5]{1,10}){1,9}$/;
    // 模板名正则：2至12位，可以是中文、英文或数字
    let namePattern = /^([a-zA-Z0-9\u4e00-\u9fa5]{2,12})$/;
  
    if(!name || !namePattern.test(name)){
      errMsg = '模板名应：2至12位，可以是中文、英文或数字'
    }
    if(!progressTemplatePattern.test(template)){
      errMsg = '模板格式不正确，请仔细观看注意事项'
    }
    if(errMsg){
      this.showErrorMsg(errMsg)
    }else{
      this.setData({createOk :true })
      const templateArr = template.split('-')
      setMyProgressTemplate(name,templateArr)
       wx.navigateBack({ delta: 1 })
    }
  },
  showErrorMsg(content){
    wx.showModal({
      title: '错误',
      showCancel:false,
      content,
    })
  }

})