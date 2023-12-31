// templates/client/project_order/info/index.js
const { ProjectOrder } = require('@/api/index');
const { getImageUrl } = require('@/utils/util');
Component({
  options: {
    addGlobalClass: true
  },
  properties:{
    aid :String,
  },
  lifetimes : {
    ready:function(){
      const id = this.properties.aid;
      this.setData({ id })
      this.getInfo(id);
    }
  },
  data: {
    loading:true,
    id : null,
    projectOrder : { },
    step:0,
  },
  methods: {
    getInfo(id){
      this.setData({loading:true})
      ProjectOrder.getInfoById(id).then((result) => {
        let step = result.data.step + 1;
        let progress_template = result.data.progress_template;
        let progress_str = result.data.progress_template[step];
        let progress_ok = false;
        if(!progress_str){
          progress_ok = true;
          progress_str = '已完成'
        }
        result.data.progress_state = (step/progress_template.length*100).toFixed(0)+"%"
        result.data.progress_str = progress_str;
        result.data.progress_ok = progress_ok 
        if(result.data.user_id){
          result.data.user_id.avatar = getImageUrl(result.data.user_id.avatar);
        }
        this.setData({ projectOrder : result.data ,step :result.data.step })
      }).finally(() => {
        this.setData({loading:false})
      })
    },
    toUserAddOrderQrCode(){
      const id = this.data.id;
      wx.navigateTo({
        url: `/pages/shared/qrcode/user_add_project_order/index?id=${id}`,
      })
    },
    toProjectOrderNotePage(){
      const id = this.data.id;
      wx.navigateTo({
        url: `/pages/client/order/note/list/index?id=${id}`,
      })
    },
  }
})

