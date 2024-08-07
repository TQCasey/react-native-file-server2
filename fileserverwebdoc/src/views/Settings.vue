<template>
  <a-layout-content class="settings-content">
    <div class="settingpanel">
      <a-divider orientation="left">Storage</a-divider>
      <div class="settingitem">
        <p class="title">Cache</p>
        <a-button icon="delete" @click="clearTempData">Clean Cache</a-button>
      </div>
    </div>
  </a-layout-content>
</template>
<script>
export default {
  name: "Settings",
  data: function() {
    return {};
  },
  methods: {
      clearTempData:function(){
          this.axios.post('/api/cleartempdata').then(response=>{
              if(response.data=="suss"){
                  this.$message.info("Clean Cache Success");
              }
          })
      }
  }
};
</script>
<style lang="less" scoped>
.settings-content {
  background-color: white;
  padding: 0px 10px;
  overflow-x: hidden;
  overflow-y: auto;
  .settingpanel {
    .title {
      font-size: 15px;
      color: black;
    }
    .settingitem {
      .title {
        font-size: 15px;
        color: black;
      }
    }
  }
}
</style>
