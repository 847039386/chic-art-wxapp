const { request }  = require('../utils/request');

const wxLogin = (data) => {
  return request({ url: '/auth/wx_login' ,method: 'POST' , data })
}

const getList = (data) => {
  return request({ url: '/company/list' ,method: 'POST' , data })
}

module.exports = {
  wxLogin,
  getList
}