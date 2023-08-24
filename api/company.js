const { request }  = require('../utils/request');

// 修改公司LOGO
const updateLogo = (id ,logo) => {
  return request({ url: '/company/up_logo' ,method: 'PATCH' ,data :{ id ,logo }})
}
// 修改公司名称
const updateName = (id ,name) => {
  return request({ url: '/company/up_name' ,method: 'PATCH' ,data :{ id ,name }})
}

// 修改公司地址
const updateAddress = (id ,address) => {
  return request({ url: '/company/up_address' ,method: 'PATCH' ,data :{ id ,address }})
}

// 修改公司简介
const updateDescription = (id ,description) => {
  return request({ url: '/company/up_description' ,method: 'PATCH' ,data :{ id ,description }})
}

// 修改公司标签
const updateTag = (id ,tag_ids) => {
  return request({ url: '/company/up_tag' ,method: 'PATCH' ,data :{ id ,tag_ids }})
}


// 根据用户ID获取公司，该用户是创始人通常只有一条数据
const getUser = (user_id) => {
  return request({ url: `/company/user?user_id=${user_id}` ,method: 'GET' })
}

// 员工扫码进入公司
const addEmployee = (company_id) => {
  return request({ url: `/company-employee/add` ,method: 'POST' , data :{company_id} })
}

// 创建公司
const create = (data) => {
  return request({ url: '/company/add' ,method: 'POST' , data })
}

// 获取单个公司信息
const getInfo = (id) => {
  return request({ url: `/company/info?id=${id}` ,method: 'GET' })
}

// 获取公司员工，包括未审核的
const getEmployees = (company_id) => {
  return request({ url: `/company-employee/list_by_company?company_id=${company_id}` ,method: 'GET' })
}

// 公司员工申请通过
const auditEmployeeOk = (id) => {
  return request({ url: `/company-employee/audit_ok?id=${id}` ,method: 'PATCH' })
}

// 修改公司员工组名称
const updateEmployeeGroupName = (id ,group_name) => {
  return request({ url: `/company-employee/up_group_name` ,method: 'PATCH' ,data :{ id ,group_name } })
}
// 说是删除分组，其实就是修改公司里所有同group_name改为默认分组
const updateAllEmployeeGroupName = (company_id ,group_name) => {
  return request({ url: `/company-employee/up_call_group_name` ,method: 'PATCH' ,data :{ company_id ,group_name } })
}
//获取员工在公司的身份信息
const getUtoCInfo = (company_id) => {
  return request({ url: `/company-employee/one_uc_info?company_id=${company_id}` ,method: 'GET' })
}

// 删除公司员工
const removeEmployee = (id) => {
  return request({ url: `/company-employee/del?id=${id}` ,method: 'DELETE' })
}

// 修改公司员工身份
const updateEmployeeIdentityType = (id ,identity_type) => {
  return request({ url: `/company-employee/up_identity_type` ,method: 'PATCH' ,data :{ id ,identity_type } })
}

// 修改员工备注
const updateEmployeeRemark = (id ,remark) => {
  return request({ url: `/company-employee/up_remark` ,method: 'PATCH' ,data :{ id ,remark } })
}

// 获取该与该用户所有有关系的公司，及用户加入的公司
const getList = (page) => {
  const limit = 10;
  return request({ url: `/company-employee/list_by_userid?page=${page}&limit=${limit}` ,method: 'GET' })
}

// 获取公司的摄像头
const getCameras = (id,page,limit) => {
  limit = limit || 10
  return request({ url: `/company-camera/list_by_companyid?company_id=${id}&page=${page}&limit=${limit}` ,method: 'GET' })
}
// 获取公司摄像头关系表中的信息
const getCompanyCameraInfo = (id) => {
  return request({ url: `/company-camera/info?id=${id}` ,method: 'GET' })
}
//获取公司可分配的摄像头，这里过滤掉工作状态和过期的摄像头，供用户在订单摄像头中添加使用
const getCamerasAssignList = (id,page,limit) => {
  page = page || 1
  limit = limit || 999
  return request({ url: `/company-camera/list_by_companyid_assign?company_id=${id}&page=${page}&limit=${limit}` ,method: 'GET' })
}
module.exports = {
  create,
  getList,
  getUser,
  getInfo,
  addEmployee,
  getEmployees,
  auditEmployeeOk,
  removeEmployee,
  updateEmployeeGroupName,
  updateAllEmployeeGroupName,
  updateEmployeeIdentityType,
  updateEmployeeRemark,
  getUtoCInfo,
  getCameras,
  getCompanyCameraInfo,
  getCamerasAssignList,
  updateLogo,
  updateName,
  updateDescription,
  updateTag,
  updateAddress
}