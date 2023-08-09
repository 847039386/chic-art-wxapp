const { request }  = require('../utils/request');

// 获取公司列表
const getList = (data) => {
  return request({ url: '/company/list' ,method: 'POST' , data })
}

// 根据用户ID获取公司，该用户是创始人通常只有一条数据
const getUser = (user_id) => {
  return request({ url: `/company/user?user_id=${user_id}` ,method: 'GET' })
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

module.exports = {
  create,
  getList,
  getUser,
  getInfo,
  getEmployees,
  auditEmployeeOk,
  updateEmployeeGroupName,
  updateAllEmployeeGroupName
}