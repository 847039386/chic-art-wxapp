// components/client-tab-bar/index.js
Component({
  options: {
    addGlobalClass: true
  },
  data: {
    PageCur: 'ClientProjectOrder',
  },
  methods: {
    NavChange(e) {
      let PageCur = e.currentTarget.dataset.cur
      this.setData({PageCur})
      this.triggerEvent('NavChange',{PageCur})
    },
  }
})

