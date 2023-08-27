// templates/shared/message/index.js
const { Message } = require('@/api/index')
const Dayjs = require('@/common/dayjs/dayjs.min')
Component({
  options: {
    addGlobalClass: true
  },
  data: {
    refreshLoading:false,
    moreLoading:false,
    messageList:[],
    isMore:true
  },
  lifetimes : {
    attached:function(){
      let windowHeight = wx.getSystemInfoSync().windowHeight
      let rate = 750 / wx.getSystemInfoSync().windowWidth
      let contentH = windowHeight * rate - 420;
      this.setData({ contentH })
      this._onRefresh()
    }
  },
  methods: {
    _onRefresh(){
      if(this.data.refreshLoading == false){
        this.setData({ refreshLoading:true ,isMore:true ,messageList:[] })
        Message.getUserMessage().then((result) => {
          const data = result.data;
          data.rows.map((item) => {
            item.create_time_str = Dayjs(item.create_time).format('MM-DD');
            return item
          })
          this.setData({ messageList : data.rows ,currentPage:data.currentPage , totalPage:data.totalPage })
        }).finally(() => {
          this.setData({refreshLoading:false})
        })
      }
    },
    _onLoadmore(){
      if(this.data.moreLoading == false){
        let currentPage = this.data.currentPage;
        let totalPage = this.data.totalPage;
        this.setData({ moreLoading :true })
        if(currentPage < totalPage){
          let page = currentPage + 1;
          Message.getUserMessage(page).then((result) => {
            if(page == totalPage){
              this.setData({isMore:false})
            }
            const data = result.data;
            const messageList = this.data.messageList.concat(data.rows);
            data.rows.map((item) => {
              item.create_time_str = Dayjs(item.create_time).format('MM-DD');
              return item
            })
            this.setData({ messageList ,currentPage:data.currentPage , totalPage:data.totalPage })
          }).finally(() => {
            this.setData({moreLoading:false})
          })
        }else{
          this.setData({ moreLoading :false ,isMore : false })
        }
      }
    },
    toInfoPage(event){
      const id = event.currentTarget.dataset.id;
      const index = event.currentTarget.dataset.index;
      const title = event.currentTarget.dataset.title;
      const content = event.currentTarget.dataset.content;
      const create_time = event.currentTarget.dataset.create_time;
      const newTime = Dayjs(create_time).format('YYYY年MM月DD日 HH:mm:ss');
      // 将这条数据变为已读，不读库
      const messageList = this.data.messageList;
      if(messageList[index]){
        // 实际上就是修改他的已读状态
        Message.getInfo(id)
        messageList[index].state = 1;
        this.setData({ messageList })
        wx.navigateTo({
          url: `/pages/shared/message/info/index?title=${title}&content=${content}&create_time=${newTime}`,
        })
      }
    },
    removeMessage(event){
      const id = event.currentTarget.dataset.id;
      const index = event.currentTarget.dataset.index;
      const messageList = this.data.messageList;
      messageList.splice(index, 1);
      this.setData({ messageList })
      Message.remove(id)
    },
    readAllMessage(){
      const messageList = this.data.messageList;
      messageList.map((item) => {
        item.state = 1;
        return item;
      })
      this.setData({ messageList })
      Message.readAll()
    },
    // ListTouch触摸开始
    ListTouchStart(e) {
      this.setData({
        ListTouchStart: e.touches[0].pageX
      })
    },

    // ListTouch计算方向
    ListTouchMove(e) {
      if(e.touches[0].pageX - this.data.ListTouchStart > 0){
        this.setData({
          ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
        })
      }else{
        if(e.touches[0].pageX - this.data.ListTouchStart < -80 ){
          this.setData({
            ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
          })
        }
      }
    },

    // ListTouch计算滚动
    ListTouchEnd(e) {
      if (this.data.ListTouchDirection == 'left') {
        this.setData({
          modalName: e.currentTarget.dataset.target
        })
      } else {
        this.setData({
          modalName: null
        })
      }
      this.setData({
        ListTouchDirection: null
      })
    },
    
  }
})
