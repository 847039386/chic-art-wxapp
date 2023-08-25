// templates/project_order/info/index.js
const { ProjectOrder } = require('@/api/index');
const { getImageUrl } = require('@/utils/util');
Component({
  options: {
    addGlobalClass: true
  },
  properties:{
    aid :String,
    isAdm :Boolean
  },
  lifetimes : {
    ready:function(){
      const id = this.properties.aid;
      this.setData({ id })
      this.getInfo(id);
    }
  },
  data: {
    finishCurrentProgressLoading:false,
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
      const isAdm = this.properties.isAdm;
      wx.navigateTo({
        url: `/pages/work/order/note/list/index?id=${id}&isAdm=${isAdm}`,
      })
    },
    finishCurrentProgress(event){
      const id = this.data.id;
      let projectOrder = this.data.projectOrder
      const step = Number(event.currentTarget.dataset.step + 1);
      const step_max_limit = Number(projectOrder.progress_template.length - 1);
      if(!isNaN(step) && !isNaN(step_max_limit)){
        if(step >= step_max_limit){
          wx.showModal({
            title: '提示',
            content: '进度已到最后环节，确定后将完成订单，是否确定？',
            complete: (res) => {
              if (res.confirm) {
                this.updateProjectOrderStep(id)
              }
            }
          })
        }else{
          this.updateProjectOrderStep(id)
        }
      }
    },
    updateProjectOrderStep(id){
      let projectOrder = this.data.projectOrder;
      this.setData({finishCurrentProgressLoading:true})
      ProjectOrder.updateProjectOrderStep(id).then(() => {
        wx.setStorageSync("needRefresh", true);
        console.log(projectOrder)
        let progress_ok = false;
        let progress_str = '';
        let step_next = projectOrder.step + 1;
        let step_max_limit = projectOrder.progress_template.length - 1;
        if(step_next >= step_max_limit){
          progress_ok = true;
          progress_str = '已完成'
        }else{
          progress_ok = false;
          progress_str =  projectOrder.progress_template[step_next + 1]
        }
        projectOrder.step = step_next;
        projectOrder.progress_state = ((step_next+1)/projectOrder.progress_template.length*100).toFixed(0)+"%";
        projectOrder.progress_str = progress_str;
        projectOrder.progress_ok = progress_ok 
        this.setData({ projectOrder ,step :step_next })
      }).finally(() => {
        this.setData({finishCurrentProgressLoading:false})
      })
    },
  }
})
