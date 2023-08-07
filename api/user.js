const { request }  = require('../utils/request');

// const wxLogin = (data) => {
//   return request({ url: '/auth/wx_login' ,method: 'POST' , data })
// }

const updateUserName = (name) => {
  console.log(name)
  return request({ url: '/user/up_name' ,method: 'PATCH' , data :{ name } }) 
}

const updateUserPhone = (phone) => {
  return request({ url: '/user/up_phone' ,method: 'PATCH' , data:{ phone } }) 
}

module.exports = {
  updateUserName,
  updateUserPhone
}