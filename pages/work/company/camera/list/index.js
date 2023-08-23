// pages/company/cameras/index.js
const { Company } = require('@/api/index');
const Dayjs = require('@/common/dayjs/dayjs.min');
Page({

  data: {
    refreshLoading:false,
    moreLoading:false,
    company_id:null,
    cameraList :[],
    // 分页数据
    currentPage:1,
    totalPage :1,
    isMore :true
  },
  onLoad(options) {
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let rate = 750 / wx.getSystemInfoSync().windowWidth
    let contentH = windowHeight * rate - 240;
    this.setData({ company_id :options.id ,contentH })
    this._onRefresh()
  },
  _onRefresh(){
    if(this.data.refreshLoading == false){
      const id = this.data.company_id;
      this.setData({ refreshLoading:true })
      Company.getCameras(id,1).then((result) => {
        let data = result.data;
        let cameraList = data.rows
        let currentPage = data.currentPage;
        let totalPage = data.totalPage;
        cameraList = this.addDiffTime(cameraList)
        this.setData({ cameraList ,currentPage ,totalPage })
      }).finally(() => {
        this.setData({refreshLoading:false})
      })
    }
  },
  _onLoadmore(){
    const id = this.data.company_id;
    let currentPage = this.data.currentPage;
    let totalPage = this.data.totalPage;
    this.setData({ moreLoading :true })
    if(currentPage < totalPage){
      let page = currentPage + 1;
      Company.getCameras(id,page).then((result) => {
        let data = result.data;
        let cameraList = this.data.cameraList.concat(data.rows);
        let currentPage = data.currentPage;
        let totalPage = data.totalPage;
        this.setData({ cameraList ,currentPage ,totalPage })
      }).finally(() => {
        this.setData({moreLoading:false})
      })
    }else{
      this.setData({ moreLoading :false ,isMore : false })
    }
  },
  toCompanyCameraSettingsPage(event){
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/work/company/camera/settings/index?id=${id}`,
    })
  },
  addDiffTime(datas){
    datas.map((item) =>{
      let today = Dayjs();
      let expire_time = Dayjs(item.expire_time)
      let diff = expire_time.diff(today,'day',true);
      item.diff_day = diff;
      if(diff >= 7){
        item.diff_color = 'text-green'
        item.diff_str = `${expire_time.diff(today,'day')}天`
      }else if(diff >= 1){
        item.diff_color = 'text-yellow'
        item.diff_str = `${expire_time.diff(today,'day')}天`
      }else if(diff< 1 && diff > 0){
        let hour = expire_time.diff(today,'hour',true).toFixed(1);
        item.diff_color = 'text-yellow'
        item.diff_str = `${hour}小时`
      }else{
        item.diff_color = 'text-red'
        item.diff_str = `已过期`
      }
      return item;
    })
    return datas;
  }
})