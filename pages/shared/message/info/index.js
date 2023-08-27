// pages/shared/message/info/index.js
Page({
  data: {
    title :null,
    content :null,
    create_time :null,
  },

  onLoad(options) {
    const title = options.title;
    const content = options.content;
    const create_time = options.create_time;
    this.setData({ title ,content ,create_time  })
  },
})