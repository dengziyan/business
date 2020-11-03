<template>
  <!--  table再组件化-->
  <!-- 通过v-bind="$attrs" v-on="$listeners"，把父组件传的属性全部绑定到子组件上，保证了api和el-table一致 -->
  <el-table style="width: 100%" v-bind="$attrs" v-on="$listeners"  border>
    <!-- 多选框   -->
<!--    <el-table-column type="selection" width="55"></el-table-column>-->
    <!-- :scope是绑定的动态属性，可以起任意喜欢的名字，但要注意在父组件中获取数据时key要对应 -->
    <el-table-column v-for="(item, index) in columns" :key="index" v-bind="item.attrs">
      <template slot-scope="scope" >
        <slot :scope="scope" :name="item.slot" v-if="item.slot"></slot>
        <template v-else>
          {{scope.row[item.attrs.prop]}}
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    // 获取普通的columns数据
    normalColumns() {
      // return this.columns.filter(item => item)
    },
    // 获取是插槽的columns数据
    slotColumns() {
      return this.columns.filter(item => item.slot)
    },
    textBtnColumns() {
      return this.columns.filter(item => item.textBtn)
    }
  }
}
</script>

<style scoped>
  .el-table{
    margin: 10px;
  }
</style>
