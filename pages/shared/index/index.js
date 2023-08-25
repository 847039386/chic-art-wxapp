const app = getApp()
Page({
  data: {
    PageCur: 'templates'
  },
  onLoad(){
    
  },
  onShow(){

  },
  onSwitchTab:function(e){
    let PageCur = e.detail.PageCur;
    this.setData({ PageCur })
  }
})