// pages/work/order/note/create/index.js
const { ProjectOrder } = require('@/api/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    isCreate:false,
    project_order_id:null,
    currentLookableIndex : 0,
    lookablePicker:[
      { state : 0 , lable :'允许所有人' },
      { state : 1 , lable :'仅负责人' },
      { state : 2 , lable :'仅员工' },
      { state : 3 , lable :'仅客户' }
    ],
    // input 内容
    title:null,
    content:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const project_order_id = options.id;
    console.log(options)
    this.setData({project_order_id})
  },

  lookablePickerChange(event){
    let currentVal = event.detail.value
    this.setData({ currentLookableIndex :currentVal })
  },
  handleTitleInput(e){
    this.setData({ title :e.detail.value })
  },
  handleContentInput(e){
    this.setData({ content :e.detail.value })
  },
  createNote(){
    const project_order_id = this.data.project_order_id;
    const title = this.data.title;
    const content = this.data.content;
    const state = this.data.lookablePicker[this.data.currentLookableIndex].state;
    const formData = { project_order_id, title ,content ,state }
    this.setData({loading:true})
    ProjectOrder.addNote(formData).then(() =>{
      this.setData({ isCreate :true })
      wx.navigateBack({ delta: 1 })
    }).finally(() => {
      this.setData({loading:false})
    })
  },
  // 卸载页面时为上一页面赋值
  onUnload(){
    let that = this;
    if(that.data.isCreate){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage._onRefresh();
    }
  }
})