<template>
  <div>
    <div class="tree">
      <!--引入树形控件子组件      -->
      <comm-tree />
    </div>
    <div class="table">
      住户信息
      <div class="detail">
        <!--引入搜索条件子组件        -->
        <comm-search />
        <!--引入表格操作子组件        -->
        <comm-table />
      </div>
    </div>
  </div>
</template>

<script>
import commSearch from './commSearch'
import commTree from './commTree'
import commTable from './commTable'
const id = 1000
export default {
  components: {
    // FormVue,
    // TreeControl,
    commSearch,
    commTree,
    commTable
  },
  data() {
    // const sexs = [{ label: '男', value: 'M' }, { label: '女', value: 'F' }]
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
    /*左边的树*/
  .tree{
    float: left;
    width: 17%;
  }
    /* 右边的住户信息 */
  .table{
    float: right;
    width: 82%;
    padding-top: 20px;
    margin-left: 10px;
  }
  .detail{
    border:1px solid #BFBFBF;
  }

  .myTrees {
    width: 288px;
    background: rebeccapurple;
  }

  .el-tree {
    background: aquamarine;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

</style>
