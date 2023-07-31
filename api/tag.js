const { request }  = require('../utils/request');

const getList = () => {
  return request({ url: '/tag/list' ,method: 'GET' })
}

module.exports = {
  getList
}