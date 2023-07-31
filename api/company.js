const { request }  = require('../utils/request');

const getList = (data) => {
  return request({ url: '/company/list' ,method: 'POST' , data })
}

const create = (data) => {
  return request({ url: '/company/add' ,method: 'POST' , data })
}

module.exports = {
  create,
  getList
}