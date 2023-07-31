// components/user-tab-bar/index.js
Component({
  options: {
    addGlobalClass: true
  },

  /**
   * 组件的初始数据
   */
  data: {
    PageCur: 'templates'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    NavChange(e) {
      let PageCur = e.currentTarget.dataset.cur
      this.setData({PageCur})
      this.triggerEvent('NavChange',{PageCur})
    },
  }
})
