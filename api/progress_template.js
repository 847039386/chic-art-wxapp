const { request }  = require('../utils/request');

const getList = () => {
  return request({ url: '/progress-template/list' ,method: 'GET' })
}

module.exports = {
  getList
}