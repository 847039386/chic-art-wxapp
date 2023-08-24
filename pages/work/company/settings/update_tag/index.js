// pages/work/company/settings/update_tag/index.js
const { Company ,Tag } = require('@/api/index')
Page({

  data: {
    loading:false,
    errMsg :null,
    company_id:null,
    tag_ids:[],
    companyTagList:[],
    allTagList:[],
    ctlModal:false,
  },

  onLoad(options) {
    const company_id = options.id;
    this.setData({ company_id })
    this._init()
  },
  _init(){
    const company_id = this.data.company_id;
    this.setData({loading:true})
    Promise.all([
      Company.getInfo(company_id),
      Tag.getList()
    ]).then((value) => {
      const companyData = value[0].data
      let allTagList = value[1].data
      let companyTagList = companyData.tag_ids;
      const newAllTagList = this.formatCompanyTagList(allTagList,companyTagList)
      this.setData({ companyTagList  ,allTagList :newAllTagList })
    }).catch((err) => {
      this.setData({errMsg:err.message})
    }).finally(() => {
      this.setData({loading:false})
    })
  },
  showSelectModal(){
    this.setData({ ctlModal :true })
  },
  hideSelectModal(){
    this.setData({ ctlModal :false })
  },
  bindTagChange(event){
    const that = this;
    let index = event.currentTarget.dataset.index;
    let allTagList = JSON.parse(JSON.stringify(that.data.allTagList));
    let selectedCount = 0;
    allTagList[index].checked = !allTagList[index].checked;
    allTagList.forEach((item) =>{
      if(item.checked){
        selectedCount ++;
      }
    })
    if(selectedCount < 5 && selectedCount > 0){
      this.setData({ allTagList })
    }else{
      wx.showModal({
        showCancel:false,
        content: '最少选择一个,最多可选4个',
      })
    }
  },
  formatCompanyTagList(allTagList,companyTagList){
    console.log(allTagList)
    for (let index = 0; index < allTagList.length; index++) {
      const a_tag = allTagList[index];  // 所有tags
      for (let jndex = 0; jndex < companyTagList.length; jndex++) {
        const c_tag = companyTagList[jndex];  //公司tags
        a_tag.checked = false;
        if(a_tag._id == c_tag._id){
          a_tag.checked = true;
          break;
        }
      }
    }
    return allTagList;
  },
  updateTag(){
    let tag_ids = [];
    const company_id = this.data.company_id;
    const allTagList = this.data.allTagList;
    const newCompanyTagList = allTagList.filter((item) => {
      if(item.checked){
        tag_ids.push(item._id)
      }
      return item.checked;
    })
    wx.showLoading()
    Company.updateTag(company_id ,tag_ids).then(() => {
      wx.setStorageSync("needRefresh", true);
      this.setData({ companyTagList :newCompanyTagList , ctlModal :false })
    }).finally(() => {
      wx.hideLoading();
    })
  },
  // 卸载页面时为上一页面赋值
  onUnload(){
    let that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    if(prevPage.data.companyData && prevPage.data.companyData.tag_ids && !that.data.isError ){
      let newCompanyData = Object.assign(prevPage.data.companyData,{ tag_ids :that.data.companyTagList })
      prevPage.setData({ companyData :newCompanyData })
    }
  }

})