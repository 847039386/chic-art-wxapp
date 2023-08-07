const { request }  = require('../utils/request');

const getList = (data) => {
  return request({ url: '/company/list' ,method: 'POST' , data })
}

const getUser = (user_id) => {
  return request({ url: `/company/user?user_id=${user_id}` ,method: 'GET' })
}

const create = (data) => {
  return request({ url: '/company/add' ,method: 'POST' , data })
}

const getInfo = (id) => {
  return request({ url: `/company/info?id=${id}` ,method: 'GET' })
}

module.exports = {
  create,
  getList,
  getUser,
  getInfo
}