const { request }  = require('../utils/request');

// 创建订单
const add = (data) => {
  return request({ url: '/project-order/add' ,method: 'POST' ,data })
}

// 删除订单
const remove = (id) => {
  return request({ url: `/project-order/del?id=${id}` ,method: 'DELETE' })
}

// 给订单添加客户
const addCustomer = (project_order_id) => {
  return request({ url: '/project-order-customer/add' ,method: 'POST' ,data :{ project_order_id } })
}

// 给订单添加员工
const addEmployee = (user_id ,project_order_id ,company_employee_id) => {
  return request({ url: '/project-order-employee/add' ,method: 'POST' ,data :{ user_id ,project_order_id ,company_employee_id } })
}

// 删除订单中的员工
const removeEmployee = (id) => {
  return request({ url: `/project-order-employee/del?id=${id}` ,method: 'DELETE' })
}

// 删除订单中的客户，拒绝审核也走此方法
const removeCustomer = (id) => {
  return request({ url: `/project-order-customer/del?id=${id}` ,method: 'DELETE' })
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
const updateProjectOrderStep = (id) => {
  return request({ url: `/project-order/up_step?id=${id}` ,method: 'PATCH' })
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

// 根据项目订单ID获取它所有的监控
const getCameras = (project_order_id) => {
  return request({ url: `/project-order-camera/list_by_projectorderid?project_order_id=${project_order_id}` ,method: 'GET' })
}
// 给订单添加监控
const addCamera = (company_camera_id ,project_order_id) => {
  return request({ url: `/project-order-camera/add` ,method: 'POST' ,data :{ 
    company_camera_id,project_order_id} });
}

// project-order-camera 这个表的ID，获取该订单的一个摄像头
const getCameraById = (id) => {
  return request({ url: `/project-order-camera/info?id=${id}` ,method: 'GET' });
}

// 修改项目订单摄像头的别名
const updateCameraName = (id,name) => {
  return request({ url: '/project-order-camera/up_name' ,method: 'PATCH' ,data :{ id,name } });
}
// 修改项目名称
const updateName = (id,name) => {
  return request({ url: `/project-order/up_name?id=${id}&name=${name}` ,method: 'PATCH' });
}

// 修改对接客户
const updateCustomer = (id,customer) => {
  return request({ url: `/project-order/up_customer?id=${id}&customer=${customer}` ,method: 'PATCH' });
}

// 修改客户电话
const updatePhone= (id,phone) => {
  return request({ url: `/project-order/up_phone?id=${id}&phone=${phone}` ,method: 'PATCH' });
}

// 修改项目地址
const updateAddress = (id,address) => {
  return request({ url: `/project-order/up_address?id=${id}&address=${address}` ,method: 'PATCH' });
}

// 修改项目订单摄像头的状态---0：所有人，1：客户不允许看
const updateCameraState = (id,state) => {
  return request({ url: '/project-order-camera/up_state' ,method: 'PATCH' ,data :{ id,state } });
}

// 将公司摄像头移除该订单
const removeCamera = (id) => {
  return request({ url: `/project-order-camera/del?id=${id}` ,method: 'DELETE' });
}

// 给订单添加笔记
const addNote = (data) => {
  return request({ url: `/project-order-note/add` ,method: 'POST' ,data });
}

// 获取员工笔记
const getEmployeeNote = (project_order_id,page,limit) => {
  page = page || 1;
  limit = limit || 10;
  return request({ url: `/project-order-note/list_by_employee?page=${page}&limit=${limit}&project_order_id=${project_order_id}` ,method: 'GET' })
}

const removeNote = (id) => {
  return request({ url: `/project-order-note/del?id=${id}` ,method: 'DELETE' });
}




module.exports = {
  add,
  remove,
  getInfoById,
  getList,
  updateProjectOrderStep,
  getEmployees,
  getCustomers,
  auditCustomer,
  getCameras,
  addCamera,
  getCameraById,
  updateCameraName,
  removeCamera,
  updateCameraState,
  addCustomer,
  addEmployee,
  updateName,
  updateCustomer,
  updatePhone,
  updateAddress,
  removeEmployee,
  removeCustomer,
  addNote,
  getEmployeeNote,
  removeNote
}