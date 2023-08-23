const setMyProgressTemplate = (name ,template) => {
  let myProgressTemplate = wx.getStorageSync("MyProgressTemplate") || [];
  myProgressTemplate.push({ name ,template });
  wx.setStorageSync("MyProgressTemplate", myProgressTemplate);
}

const removeMyProgressTemplateByIndex = (index) => {
  let myProgressTemplate = wx.getStorageSync("MyProgressTemplate") || [];
  if(myProgressTemplate.length > 0){
    myProgressTemplate.splice(index, 1);
    wx.setStorageSync("MyProgressTemplate", myProgressTemplate);
  }
}

const getMyProgressTemplate = () =>{
  let myProgressTemplate = wx.getStorageSync("MyProgressTemplate")
  return myProgressTemplate || [];
}

module.exports = {
  setMyProgressTemplate,
  getMyProgressTemplate,
  removeMyProgressTemplateByIndex
}