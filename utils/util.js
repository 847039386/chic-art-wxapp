const { host } = require('./config')

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const getImageUrl = (url) => {
  let httpUrlPattern = /(http|https):\/\/([\w.]+\/?)\S*/;
  if(httpUrlPattern.test(url)){
    return url
  }else{
    return host + url
  }
}

const uniqueArray = (arr) => {
  return Array.from(new Set(arr))
}

module.exports = {
  formatTime,
  getImageUrl,
  uniqueArray
}
