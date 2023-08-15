// templates/project_order/info/index.js
const { ProjectOrder } = require('../../../api/index');
const { getImageUrl } = require('../../../utils/util');
Component({
  options: {
    addGlobalClass: true
  },
  properties:{
    aid :String
  },
  lifetimes : {
    ready:function(){
      const id = this.properties.aid;
      this.setData({id})
      this.getInfo(id);
      console.log('read',id,this.data)
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
        url: `/pages/qrcode/user_add_project_order/index?id=${id}`,
      })
    },
    finishCurrentProgress(event){
      const id = this.data.id;
      let projectOrder = this.data.projectOrder
      const step = Number(event.currentTarget.dataset.step + 1);
      const total = Number(projectOrder.progress_template.length);
      if(!isNaN(step) && !isNaN(total)){
        let m_step = total - 1
        if(step >= m_step){
          wx.showModal({
            title: '提示',
            content: '进度已到最后环节，确定后将完成订单，是否确定？',
            complete: (res) => {
              if (res.confirm) {
                this.updateProjectOrderStep(id ,step ,total)
              }
            }
          })
        }else{
          this.updateProjectOrderStep(id ,step ,total)
        }
      }
    },
    updateProjectOrderStep(id,step,total){
      let projectOrder = this.data.projectOrder
      this.setData({finishCurrentProgressLoading:true})
      ProjectOrder.updateProjectOrderStep(id,step,total).then(() => {
        let progress_template = projectOrder.progress_template;
        let step_next = step + 1
        let progress_str = projectOrder.progress_template[step_next];
        let progress_ok = false;
        if(!progress_str){
          progress_ok = true;
          progress_str = '已完成'
        }
        projectOrder.step = step;
        projectOrder.progress_state = (step_next/progress_template.length*100).toFixed(0)+"%";
        projectOrder.progress_str = progress_str;
        projectOrder.progress_ok = progress_ok 
        this.setData({ projectOrder ,step })
      }).finally(() => {
        this.setData({finishCurrentProgressLoading:false})
      })
    },
    toOrderEmployeePage(){
      const id = this.data.id;
      wx.navigateTo({
        url: `/pages/order/employees/index?id=${id}`,
      })
    }
  }
})
