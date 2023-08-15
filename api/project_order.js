const { request }  = require('../utils/request');

// 创建订单
const add = (data) => {
  return request({ url: '/project-order/add' ,method: 'POST' ,data })
}

// 根据id获取订单信息
const getInfoById = (id) => {
  return request({ url: `/project-order/info?id=${id}` ,method: 'GET' })
}

// 根据token获取所有与用户有关系的订单，这里是员工，客户会在另一个方法
const getList = (data) => {
  let page = data.page || 1;
  let limit = data.limit || 10;
  let state = data.state;
  if(state != -1){
    return request({ url: `/project-order-employee/project_order_list?page=${page}&limit=${limit}&state=${state}` ,method: 'GET' })
  }else{
    return request({ url: `/project-order-employee/project_order_list?page=${page}&limit=${limit}` ,method: 'GET' })
  }
}

// 修改项目订单进度
const updateProjectOrderStep = (id ,step ,total) => {
  return request({ url: `/project-order/up_step` ,method: 'PATCH' ,data :{ id ,step ,total } })
}
// 根据项目订单ID获取它所有的员工
const getEmployees = (project_order_id) => {
  return request({ url: `/project-order-employee/employee_list?project_order_id=${project_order_id}` ,method: 'GET' })
}

// 根据项目订单ID获取它所有的客户
const getCustomers = (project_order_id) => {
  return request({ url: `/project-order-customer/list_by_projectorderid?project_order_id=${project_order_id}` ,method: 'GET' })
}

// 审核通过项目订单的客户
const auditCustomer = (id) => {
  return request({ url: `/project-order-customer/audit_ok?id=${id}` ,method: 'PATCH' })
}

// 审核拒绝项目订单的客户
const auditNotCustomer = (id) => {
  return request({ url: `/project-order-customer/del?id=${id}` ,method: 'DELETE' })
}

// 根据项目订单ID获取它所有的监控
const getCameras = (project_order_id) => {
  return request({ url: `/project-order-camera/list_by_projectorderid?project_order_id=${project_order_id}` ,method: 'GET' })
}

module.exports = {
  add,
  getInfoById,
  getList,
  updateProjectOrderStep,
  getEmployees,
  getCustomers,
  auditCustomer,
  auditNotCustomer,
  getCameras
}