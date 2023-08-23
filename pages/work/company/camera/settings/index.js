// pages/company/camera/settings/index.js
const { Company } = require('@/api/index')
const Dayjs = require('@/common/dayjs/dayjs.min')
Page({
  data: {
    id:null,
    loading:false,
    CompanyCameraInfo:{ }
  },

  onLoad(options) {
    this.setData({id :options.id })
    this.getCompanyCameraInfo()
  },
  getCompanyCameraInfo(){
    let id = this.data.id;
    this.setData({loading :true})
    Company.getCompanyCameraInfo(id).then((result) => {
      let CompanyCameraInfo = result.data
      let today = Dayjs();
      let expire_time = Dayjs(CompanyCameraInfo.expire_time)
      let diff = expire_time.diff(today,'day',true);
      CompanyCameraInfo.diff_day = diff;
      if(diff >= 7){
        CompanyCameraInfo.diff_color = 'text-green'
        CompanyCameraInfo.diff_str = `${expire_time.diff(today,'day')}天`
      }else if(diff >= 1){
        CompanyCameraInfo.diff_color = 'text-yellow'
        CompanyCameraInfo.diff_str = `${expire_time.diff(today,'day')}天`
      }else if(diff< 1 && diff > 0){
        let hour = expire_time.diff(today,'hour',true).toFixed(1);
        CompanyCameraInfo.diff_color = 'text-yellow'
        CompanyCameraInfo.diff_str = `${hour}小时`
      }else{
        CompanyCameraInfo.diff_color = 'text-red'
        CompanyCameraInfo.diff_str = `已过期`
      }
      CompanyCameraInfo.expire_time_str = expire_time.format('YYYY/MM/DD H:s:m')
      this.setData({ CompanyCameraInfo })
    }).finally(() => {
      this.setData({loading :false})
    })
  }

})