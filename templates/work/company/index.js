// templates/company/index.js
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
    // 默认用户有公司，这样让创建公司的按钮隐藏调取API后在赋真正值
    userIsHaveCompany : true, 
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
      let contentH = windowHeight * rate;
      contentH = contentH - 355;
      this.setData({ contentH })
      this._onRefresh();
    }
  },
  pageLifetimes:{
    // 当用户设置了订单摄像头某个东西后重返这个页面走这个方法
    show(){
      // 此方法与删除订单返回这个页面相对应
      let needRefresh = wx.getStorageSync("needRefresh")
      if(needRefresh){
        this.setData({companyList :[] })
        wx.removeStorageSync('needRefresh')
        this._onRefresh();
      }
    }
  },
  methods: {
    _onRefresh() {
      if(this.data.refreshLoading == false){
        this.setData({refreshLoading :true  ,userIsHaveCompany:true ,isMore:true })
        let companyList = [];
        let currentPage  = 1;
        let totalPage  = 1;
        this.getList(1).then((companys) => {
          companyList = companys.rows;
          currentPage = companys.currentPage;
          totalPage = companys.totalPage;
          return this.getUserCompany();
        }).then((data) => {
          if(data){
            this.setData({userIsHaveCompany : true})
            companyList.unshift(data)
          }else{
            // 用户已注册公司，就不显示按钮了
            this.setData({userIsHaveCompany : false})
          }
          this.setData({companyList })
        }).finally(() => {
          if(companyList.length == 0){
            this.setData({ isMore :false })
          }
          this.setData({ companyList, currentPage,totalPage ,refreshLoading:false })
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
        this.getList(page).then((companys) => {
          this.setData({ 
            companyList :companyList.concat(companys.rows), 
            currentPage :companys.currentPage,
            totalPage :companys.totalPage,
          })
        }).finally(() =>{
          this.setData({moreLoading:false})
        })
      }else{
        this.setData({moreLoading:false ,isMore :false})
      }
    },
    toCreateCompanyPage(){
      wx.navigateTo({
        url: '/pages/work/company/create/index',
      })
    },
    getUserCompany(){
       return new Promise((resolve, reject) =>{
        const user_id = getUserInfo().user_id;
        Company.getUser(user_id).then((result) => {
          let data = result.data;
          if(data){
            data.logo = getImageUrl(data.logo);
            data.cmy_remark = '创始人';
            resolve(data)
          }else{
            resolve(null)
          }
         })
       })
    },
    toCompanyInfoPage(e){
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/work/company/info/index?id=${id}`,
      })
    },
    getList(page){
      page = page || 1;
      // 获取用户加入的公司与上边方法不一样上边获取的是自己的公司
      return new Promise((resolve, reject) => {
        Company.getList(page).then((result) =>{
          let rows = result.data.rows;
          let companyList = [];
          rows.forEach((item) => {
            let company_id = item.company_id;
            if(company_id){
              company_id.logo = getImageUrl(company_id.logo)
              let company_identity_type = item.identity_type
              let newItem = Object.assign(company_id,{ 
                company_identity_type ,
                cmy_remark :item.remark || '普通员工' 
              })
              companyList.push(newItem)
            }
          })
          resolve({
            currentPage:result.data.currentPage ,
            totalPage :result.data.totalPage ,
            rows :companyList
          });
        }).catch(()=>{
          reject();
        })
      })
    }
  }
})
