// templates/company/index.js
Component({
  options: {
    addGlobalClass: true
  },
  data: {
    companyList:[]
  },
  lifetimes : {
    attached:function(){
      
    }
  },
  methods: {
    toCreateCompanyPage(){
      wx.navigateTo({
        url: '/pages/company/create/index',
      })
    },
    getList(){
      
    }
  }
})
