<template> 
  <div class="put_task">
    <div class="put_title">如何发布任务</div>
    <div class="put_list">
      <ul>
        <li>
          <span class="mark_disc"></span>
          <div class="put_text">
            发布者可以在蜜传<span class="col_ff4b4b">app底部点击“添加发布”按钮</span>，进入编辑页面编辑需要传播的内容，或者在<span class="col_ff4b4b">浏览器中访问蜜传发布www.bvcio.com</span>网站编辑需要传播的内容。
          </div>
        </li>
        <li>
          <span class="mark_disc"></span>
          <div class="put_text">
            在编辑页面，发布者可以设定标题、封面、内容、发布预算、浏览和传播奖励等信息。发布预算是指传播活动需要消耗的蜂蜜值，用于奖励浏览和传播者。
          </div>
        </li>
        <li>
          <span class="mark_disc"></span>
          <div class="put_text">
            编辑完成后，点击“提交审核”按钮，蜜传服务人员将及时依据相关法律规定进行审核，并将审核通过的内容发布在任务大厅中。
          </div>
        </li>
        <li>
          <span class="mark_disc"></span>
          <div class="put_text">
            发布者可以在“我的”→“我的发布”中对发布内容进行管理，包括查看状态、编辑、提交审核、上架、下架、删除等。
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'put_task',
    components: {},
    data () {
      return {}
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .put_task{
    background:url('../../../assets/images/task_bg.png') no-repeat;
    height:32.16rem;
    background-size: 100%;
    overflow: hidden;
  }
  .put_title {
    height:1.986667rem;
    line-height:1.986667rem;
    color: #333;
    position: relative;
    margin: 0 auto;
    font-size: 1.066667rem;
    color: #333;
    text-align: center;
    font-weight:bold;
    margin-top: 12rem;
  }
  .put_title::before {
    left: -3.733333rem;
  }
  .put_title::before{
    content: url(../../../assets/images/left_icon.png);
    display: inline-block;
    width: 0.693333rem;
    height: 0.693333rem;
    margin-left: -0.466667rem;
    vertical-align: middle;
    position: absolute;
    top: 0;
    left: 30%;
  }
  .put_title::after {
    content: url(../../../assets/images/left_icon.png);
    display: inline-block;
    width: 0.693333rem;
    height: 0.693333rem;
    margin-left: 1.533333rem;
    vertical-align: middle;
    position: absolute;
    top: 0;
    left: 60%;
  }
  .put_title::after {
    right: -3.733333rem;
  }
  .mark_disc{
    width:10px;
    height:10px;
    border-radius:50%;
    background:#ff4b4b;
    position: absolute;
    left: .8rem;
    top: 0.3rem;
  }
  .put_text{
    margin-left:1.653333rem;
    margin-right:.8rem;
    line-height: 1.6;
  }
  .put_list ul li{
    position:relative;
    margin-top: .5rem;
  }
  .col_ff4b4b{
    color:#ff4b4b;
  }
</style>
