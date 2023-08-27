const { request }  = require('../utils/request');

// 获取用户消息列表
const getUserMessage = (page,limit,state) => {
  return request({ url: `/message/recv?page=${page}&limit=${limit}&state=${state}` ,method: 'GET' })
}

// 获取用户消息，其实是将他们的状态改成了已读
const getInfo = (id) => {
  return request({ url: `/message/info?id=${id}` ,method: 'GET' })
}

// 已读所有，将用户所有消息变为已读状态
const readAll = () => {
  return request({ url: `/message/read_all` ,method: 'GET' })
}

// 获取用户未读消息的数量
const getNotReadCount = () => {
  return request({ url: `/message/not_read_count` ,method: 'GET' })
}

// 删除消息
const remove = (id) => {
  return request({ url: `/message/del?id=${id}` ,method: 'DELETE' })
}

module.exports = {
  getInfo,
  remove,
  readAll,
  getUserMessage,
  getNotReadCount
}