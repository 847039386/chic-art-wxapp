// pages/work/order/note/info/index.js
const { ProjectOrder } = require('@/api/index')
Page({

  data: {
    id :null,
    index:null,
    title :null,
    content :null,
    state :null,
    create_time :null,
    isAdm: false,
    isRemove :false
  },

  onLoad(options) {
    const id = options.id;
    const index = options.index;
    const title = options.title;
    const content = options.content;
    const state = options.state;
    const create_time = options.create_time;
    let isAdm_string = options.isAdm;
    let isAdm = false;
    if(isAdm_string){
      isAdm = isAdm_string == 'true' ? true : false
    }
    this.setData({ title ,content ,state ,create_time ,id ,isAdm ,index})
  },
  removeNote() {
    wx.showModal({
      title: '提示',
      content: '是否删除这个笔记?',
      complete: (res) => {
        if (res.confirm) {
          const id = this.data.id;
          wx.showLoading({mask:true})
          ProjectOrder.removeNote(id).then(() =>{
            this.setData({ isRemove :true })
            wx.navigateBack({ delta: 1 })
          }).finally(() =>{
            wx.hideLoading()
          })
        }
      }
    })
  },
  // 卸载页面时为上一页面赋值
  onUnload(){
    let that = this;
    if(that.data.isRemove){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      const index = this.data.index
      let noteList = prevPage.data.noteList;
      noteList.splice(index, 1);
      prevPage.setData({ noteList })
    }
  }

})