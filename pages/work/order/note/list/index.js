// pages/work/order/note/index.js
const { ProjectOrder } = require('@/api/index')
const Dayjs = require('@/common/dayjs/dayjs.min')
Page({

  data: {
    project_order_id :null,
    noteList :[],
    // 是否项目负责人
    isAdm:false,
    // 分页
    refreshLoading:false,
    moreLoading:false,
    isMore :true,
    currentPage:1,
    totalPage :0,
  },

  onLoad(options) {
    let project_order_id = options.id;
    let isAdm_string = options.isAdm;
    let isAdm = false;
    if(isAdm_string){
      isAdm = isAdm_string == 'true' ? true : false
    }
    // 获取内容高度根据wx小程序屏幕高度
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let rate = 750 / wx.getSystemInfoSync().windowWidth
    let contentH = windowHeight * rate - 260 ;
    this.setData({ contentH ,project_order_id ,isAdm })
    this._onRefresh()
  },
  _onRefresh(){
    if(this.data.refreshLoading == false){
      this.setData({ refreshLoading :true ,noteList:[] ,isMore:true })
      this.getList(1).then((data) =>{
          if(data.rows.length == 0){
            this.setData({ isMore:false })
          }
          this.setData({ currentPage : data.currentPage , totalPage :data.totalPage , noteList :data.rows})
      }).finally(() => {
        this.setData({ refreshLoading :false })
      })
    }
  },
  _onLoadmore(){
    let currentPage = this.data.currentPage;
    let totalPage = this.data.totalPage;
    if(currentPage < totalPage){
      let page = currentPage + 1;
      this.setData({ moreLoading :true })
      this.getList(page).then((data) =>{
        let noteList = this.data.noteList;
        let nowNoteList = noteList.concat(data.rows);
        this.setData({ currentPage : data.currentPage , totalPage :data.totalPage , noteList :nowNoteList})
      }).finally(() => {
        this.setData({ moreLoading :false })
      })
    }else{
      this.setData({ isMore :false })
    }
  },
  toCreateNotePage(){
    const project_order_id = this.data.project_order_id;
    wx.navigateTo({
      url: `/pages/work/order/note/create/index?id=${project_order_id}`,
    })
  },
  toInfoPage(event){
    const id = event.currentTarget.dataset.id;
    const index = event.currentTarget.dataset.index;
    const title = event.currentTarget.dataset.title;
    const content = event.currentTarget.dataset.content;
    const state = event.currentTarget.dataset.state;
    const create_time = event.currentTarget.dataset.create_time;
    const isAdm = this.data.isAdm;
    wx.navigateTo({
      url: `/pages/work/order/note/info/index?id=${id}&index=${index}&isAdm=${isAdm}&title=${title}&content=${content}&state=${state}&create_time=${create_time}`,
    })
  },
  getList(page){
    const project_order_id = this.data.project_order_id
    return new Promise((resolve, reject) => {
      ProjectOrder.getEmployeeNote(project_order_id,page).then((result) =>{
        result.data.rows.map((item) => {
          item.create_time = Dayjs(item.create_time).format('YYYY年MM月DD日 HH:mm:ss');
          return item;
        })
        resolve(result.data)
      }).catch(() => {
        reject()
      })
    })
  }

})