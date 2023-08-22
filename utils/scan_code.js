
const { Company , ProjectOrder } = require('../api/index')
const userScanCode = (json) => {
  try {
    const data = JSON.parse(json);
    let aType = data.type;
    if(aType == 'EmployeeAddCompany'){
      return Company.addEmployee(data.company_id)
    }else if(aType == 'CustomerAddProjectOrder'){
      return ProjectOrder.addCustomer(data.project_order_id)
    }else{
      wx.showModal({
        title: '错误',
        showCancel:false,
        content: '未知的二维码',
      })
      return Promise.reject({ message : '未知的二维码'})
    }
  } catch (error) {
    wx.showModal({
      title: '错误',
      showCancel:false,
      content: '请扫本小程序二维码',
    })
    return Promise.reject({ message : '请扫本小程序二维码'})
  }
}

module.exports = {
  userScanCode,
}