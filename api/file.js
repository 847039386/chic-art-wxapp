const { uploadFile }  = require('../utils/request');
const { host } = require('../utils/config')

const uploadCompanyLogo = (filePath) => {
  let url = host + '/file/upload'
  return uploadFile(url,filePath)
}

module.exports = {
  uploadCompanyLogo
}