// pages/work/progress_template/list/index.js
const { 
  getMyProgressTemplate,
  removeMyProgressTemplateByIndex 
} = require('@/utils/storage/progress_template');
Page({

  data: {
    myProgressTemplates: []
  },

  onShow() {
    console.log('show')
    this.getList()
  },

  toCreateProgressTemplatePage(){
    wx.navigateTo({
      url: '/pages/work/progress_template/create/index',
    })
  },
  removeTemplate(event){
    wx.showModal({
      title: '提示',
      content: '是否删除自定义进度模板？',
      complete: (res) => {
        if (res.confirm) {
          const index = event.currentTarget.dataset.index;
          removeMyProgressTemplateByIndex(index);
          this.getList()
        }
      }
    })
  },
  toggleClick(event){
    const index = event.currentTarget.dataset.index;
    let myProgressTemplates = this.data.myProgressTemplates;
    myProgressTemplates[index].checked = !myProgressTemplates[index].checked;
    this.setData({myProgressTemplates})
  },
  getList(){
    console.log('zou wo le ')
    const myProgressTemplates = getMyProgressTemplate();
    myProgressTemplates.map((item) => {
      item.checked = false;
      return item;
    })
    this.setData({myProgressTemplates})
  }
})