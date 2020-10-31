<!--region 封装的分页 table-->
<template>
  <div class="table">
    <el-table id="iTable" ref="mutipleTable" v-loading.iTable="options.loading" :data="list" :stripe="options.stripe" @selection-change="handleSelectionChange">
      <!--region 选择框-->
      <el-table-column v-if="options.mutiSelect" type="selection" style="width: 55px;" />
      <!--region 数据列-->
      <template v-for="(column, index) in columns">
        <el-table-column :key="column.label" :prop="column.prop" :label="column.label" :align="column.align" :width="column.width">
          <template slot-scope="scope">
            <template v-if="!column.render">
              <template v-if="column.formatter">
                <span v-html="column.formatter(scope.row, column)" />
              </template>
              <template v-else>
                <span>{{ scope.row[column.prop] }}</span>
              </template>
            </template>
            <template v-else>
              <expand-dom :column="column" :row="scope.row" :render="column.render" :index="index" />
            </template>
          </template>
        </el-table-column>
      </template>
      <!--region 按钮操作组-->
      <el-table-column v-if="operates.list.filter(_x=>_x.show === true).length > 0" ref="fixedColumn" label="操作" align="center" :width="operates.width" :fixed="operates.fixed">
        <template slot-scope="scope">
          <div class="operate-group">
            <template v-for="(btn, key) in operates.list">
              <div v-if="btn.show" :key="btn.id" class="item">
                <el-button :type="btn.type" size="mini" :icon="btn.icon" :disabled="btn.disabled" :plain="btn.plain" @click.native.prevent="btn.method(key,scope.row)">{{ btn.label }}
                </el-button>
              </div>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
export default {
  // 组件
  components: {
    expandDom: {
      functional: true,
      props: { row: Object, render: Function, index: Number,
        column: {
          type: Object,
          default: null
        }
      },
      render: (h, ctx) => {
        const params = {
          row: ctx.props.row,
          index: ctx.props.index
        }
        if (ctx.props.column) params.column = ctx.props.column
        return ctx.props.render(h, params)
      }
    }
  },
  props: {
    // eslint-disable-next-line vue/require-valid-default-prop
    list: { type: Array, default: [] }, // 数据列表
    // eslint-disable-next-line vue/require-valid-default-prop
    columns: { type: Array, default: [] }, // 需要展示的列 === prop：列数据对应的属性，label：列名，align：对齐方式，width：列宽
    operates: {},
    // eslint-disable-next-line vue/require-valid-default-prop
    options: { type: Object, default: { stripe: false }} // table 表格的控制参数
  },
  // 数据
  data() {
    return {
      pageIndex: 1,
      multipleSelection: [] // 多行选中
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {

    // 多行选中
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.$emit('handleSelectionChange', val)
    },
    // 显示 表格操作弹窗
    showActionTableDialog() {
      console.log(4444)
      this.$emit('handelAction')
    }
  }
}

</script>
<style lang="scss" >

</style>
