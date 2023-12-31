const { uploadFile }  = require('../utils/request');
const { host } = require('../utils/config')

const uploadCompanyLogo = (filePath) => {
  let url = host + '/file/upload_image'
  return uploadFile(url,filePath)
}

const uploadUserAvatarLogo = (filePath) => {
  let url = host + '/file/upload_image'
  return uploadFile(url,filePath)
}

module.exports = {
  uploadCompanyLogo,
  uploadUserAvatarLogo
}