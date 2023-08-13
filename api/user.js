const { request }  = require('../utils/request');

const updateUserName = (name) => {
  return request({ url: `/user/up_name?name=${name}` ,method: 'PATCH' }) 
}

const updateUserNickName = (nickname) => {
  return request({ url: `/user/up_nickname?nickname=${nickname}` ,method: 'PATCH' }) 
}

const updateUserPhone = (phone) => {
  return request({ url: `/user/up_phone?phone=${phone}` ,method: 'PATCH' }) 
}

module.exports = {
  updateUserName,
  updateUserNickName,
  updateUserPhone
}