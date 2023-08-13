const { request }  = require('../utils/request');

// 创建订单
const add = (data) => {
  return request({ url: '/project-order/add' ,method: 'POST' ,data })
}

// 根据id获取订单信息
const getInfoById = (id) => {
  return request({ url: `/project-order/info?id=${id}` ,method: 'GET' })
}

const getList = (data) => {
  let page = data.page || 1;
  let limit = data.limit || 10;
  let state = data.state;
  if(state != -1){
    return request({ url: `/project-order-employee/project_orders?page=${page}&limit=${limit}&state=${state}` ,method: 'GET' })
  }else{
    return request({ url: `/project-order-employee/project_orders?page=${page}&limit=${limit}` ,method: 'GET' })
  }
}

module.exports = {
  add,
  getInfoById,
  getList
}