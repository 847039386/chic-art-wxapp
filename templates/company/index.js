// templates/company/index.js
const { Company } = require('../../api/index')
const { getUserInfo } = require('../../utils/auth')
const { getImageUrl } = require('../../utils/util')

Component({
  options: {
    addGlobalClass: true
  },
  data: {
    loading:false,
    userCompany:null,
    companyList:[]
  },
  lifetimes : {
    attached:function(){
      this.getList()
    }
  },
  methods: {
    toCreateCompanyPage(){
      wx.navigateTo({
        url: '/pages/company/create/index',
      })
    },
    getList(){
       const user_id = getUserInfo()._id;
       this.setData({loading :true})
       Company.getUser(user_id).then((result) => {
        let data = result.data;
        if(data){
          data.logo = getImageUrl(data.logo)
          this.setData({userCompany: data })
        }
        this.setData({loading :false})
       }).catch(() =>{
        this.setData({loading :false})
       })
    },
    toCompanyInfoPage(e){
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/company/info/index?id=${id}`,
      })
    },
  }
})
