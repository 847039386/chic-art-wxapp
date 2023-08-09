const { uniqueArray } = require('../util')

/**
 * 
 * @param {string || string []} group_name  // 公司员工分组名称
 * @param {string []} remoteExployeeGroup // 数据库中的分组
 */
const setLocalEmployeeGroup = (group_name) => {
  // 为了防止删除员工后远程的分组可能为空，所以需要每次获取远程的分组和本地分组合并一下
  if(typeof group_name == 'string'){
    let localEmployeeGroup = getLocalEmployeeGroup();
    localEmployeeGroup.push(group_name)
    localEmployeeGroup = uniqueArray(localEmployeeGroup)
    wx.setStorageSync("localEmployeeGroup", localEmployeeGroup);
  }else{
    let newGroup = getLocalEmployeeGroup();
    newGroup = uniqueArray(newGroup.concat(group_name))
    wx.setStorageSync("localEmployeeGroup", group_name);
  }
}

const getLocalEmployeeGroup = () => {
  let localEmployeeGroup = wx.getStorageSync("localEmployeeGroup")
  if(!localEmployeeGroup){
    wx.setStorageSync("localEmployeeGroup", ['默认分组']);
    return ['默认分组']
  } else {
    return localEmployeeGroup
  }
}


module.exports = {
  setLocalEmployeeGroup,
  getLocalEmployeeGroup
}