// templates/client/company/index.js
const { Company } = require('@/api/index')
const { getUserInfo } = require('@/utils/auth')
const { getImageUrl } = require('@/utils/util')

Component({
  options: {
    addGlobalClass: true
  },
  data: {
    refreshLoading:false,
    companyList:[],
    // 分页数据
    currentPage:1,
    totalPage :0,
    // 是否有更多，默认有
    isMore :true,
  },
  lifetimes : {
    ready:function(){
      // 获取内容高度根据wx小程序屏幕高度
      let windowHeight = wx.getSystemInfoSync().windowHeight
      let rate = 750 / wx.getSystemInfoSync().windowWidth
      let contentH = windowHeight * rate - 375;
      this.setData({ contentH })
      const companyList = this.data.companyList;
      console.log(companyList,'aaaaa')
      this._onRefresh();
    }
  },
  methods: {
    _onRefresh() {
      if(this.data.refreshLoading == false){
        this.setData({refreshLoading :true  ,userIsHaveCompany:true ,isMore:true })
        let companyList = [];
        this.getList(1).then((data) => {
          companyList = data.rows;
          this.setData({ 
            companyList, 
            currentPage :data.currentPage,
            totalPage :data.totalPage,
          })
        }).finally(() => {
          if(companyList.length == 0){
            this.setData({ isMore :false })
          }
          this.setData({ refreshLoading:false })
        })
      }
    },
    _onLoadmore(e) {
      let currentPage = this.data.currentPage;
      let totalPage = this.data.totalPage;
      this.setData({moreLoading:true})
      if(currentPage < totalPage){
        let companyList = this.data.companyList;
        let page = currentPage + 1;
        this.getList(page).then((data) => {
          this.setData({ 
            companyList :companyList.concat(data.rows), 
            currentPage :data.currentPage,
            totalPage :data.totalPage,
          })
        }).finally(() =>{
          this.setData({moreLoading:false})
        })
      }else{
        this.setData({moreLoading:false ,isMore :false})
      }
    },
    toCompanyInfoPage(e){
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/client/company/info/index?id=${id}`,
      })
    },
    getList(page){
      page = page || 1;
      return new Promise((resolve, reject) => {
        Company.getCList(page).then((result) =>{
          if(result.data.rows.length > 0){
            result.data.rows.map((item) => {
              if(item.logo){
                item.logo = getImageUrl(item.logo)
              }
              return item;
            })
          }
          resolve(result.data);
        }).catch(()=>{
          reject();
        })
      })
    }
  }
})
