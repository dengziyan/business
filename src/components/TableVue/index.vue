<template>
  <!--  table再组件化-->
  <!-- 通过v-bind="$attrs" v-on="$listeners"，把父组件传的属性全部绑定到子组件上，保证了api和el-table一致 -->
  <el-table style="width: 100%" v-bind="$attrs" v-on="$listeners" border >
    <!-- 多选框   -->
<!--    <el-table-column type="selection" width="55"></el-table-column>-->
    <!-- :scope是绑定的动态属性，可以起任意喜欢的名字，但要注意在父组件中获取数据时key要对应 -->
    <el-table-column v-for="(item, index) in columns" :key="index" v-bind="item.attrs">
      <el-table-column type="selection" v-if="item.type==='selection'" width="55" />
<!--      <template slot-scope="scope" v-if="item.type==='edit'">-->
<!--        <slot :scope="scope" :name="item.slot" v-if="item.slot"></slot>-->
<!--        <template v-else>-->
<!--          <el-input v-model="scope.row.name" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input>-->
<!--        </template>-->
<!--      </template>-->
<!--      <el-table-column v-if="item.type==='expand'" type="expand">-->
<!--        <slot :scope="scope" :name="item.slot" v-if="item.slot"></slot>-->
<!--      </el-table-column>-->
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
    },
    // multipelChoose: {
    //   type: Array,
    //   default: () => []
    // }
  },
  created() {
    // console.log(this.multipelChoose[0])
  }
}
</script>

<style scoped>
  .el-table{
    margin-top: 10px;
  }
</style>
