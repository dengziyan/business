<template>
  <div>
    <!--小区左边的树形控件组件  -->
    <div class="expand">
      <div>
        小区信息
        <el-button @click="handleAddTop">导入</el-button>
        <el-tree
          v-show="isLoadingTree"
          ref="expandMenuList"
          class="expand-tree"
          :data="treeList"
          :render-content="renderContent"
          :props="defaultProps"
          node-key="id"
          highlight-current
          accordion
          :check-strictly="true"
          auto-expand-parent
          @node-click="handleNodeClick"
        />
        <!--点击+新增后出现的弹框    -->
        <el-dialog :title="treeIsEdit?'编辑':'添加'" :visible.sync="treeDialogVisible" width="650px">
          <!--弹框子组件      -->
          <new-dialog1 v-if="newdialog === 1" :visible.sync="treeDialogVisible"/>
          <new-dialog2 v-if="newdialog === 2" :visible.sync="treeDialogVisible"/>
          <new-dialog3 v-if="newdialog === 3" :visible.sync="treeDialogVisible"/>
          <new-dialog4 v-if="newdialog === 4" :visible.sync="treeDialogVisible"/>
        </el-dialog>
      </div>
    </div>
    <div class="resident">
      住户信息
      <div class="detail">
        <!--引入搜索条件子组件        -->
        <search-form class="searchMain" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle"/>
        <!--小区表格及操作组件  -->
        <div class="table">
          <!-- 各个操作按钮 -->
          <el-row :gutter="10" class="mb8">
            <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>
            <el-button type="info" icon="el-icon-upload2" size="mini" :disabled="!multiple" @click="handleImport">导入</el-button>
            <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出</el-button>
            <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>
          </el-row>
          <!--引入表格组件        -->
          <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="暂无数据">
            <!-- #是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
            <template #handle="{scope: {row, $index}}">
              <el-button type="danger" size="mini" @click="handleDelete()">删除</el-button>
              <el-button type="primary" size="mini" @click="handleUpdate(row, $index)">编辑</el-button>
            </template>
          </TableVue>
          <!--分页    -->
          <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[10,25,50]" @pagination="getList"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TreeRender from '@/components/Tree/index'
import newDialog1 from './newDialog1'
import newDialog2 from './newDialog2'
import newDialog3 from './newDialog3'
import newDialog4 from './newDialog4'
import TableVue from '@/components/TableVue'
import SearchForm from '@/components/SearchForm'
import { listProperty, listResident } from '@/api/CommunityMag/community'
import { addDateRange } from '@/utils/userright'

const id = 1000
export default {
  components: { newDialog1, newDialog2, newDialog3, newDialog4, TableVue, SearchForm },
  data() {
    return {
      // 左边的树（maxexpandId:新增节点开始id，isLoadingTree: 是否加载节点树，defaultExpandKeys默认展开节点列表
      treeList: [], maxexpandId: 95, non_maxexpandId: 95, isLoadingTree: false,
      defaultExpandKeys: [], treeDialogVisible: false, treeIsEdit: false, newdialog: 0,
      defaultProps: { children: 'children', label: 'name', id: 'name' },
      queryParams: { userId: undefined },
      // 查询表单
      searchForm: [
        { type: 'Input', label: '室', prop: 'roomNo', width: '100px', placeholder: '请输入室...' },
        { type: 'Input', label: '姓名', prop: 'residentName', width: '100px', placeholder: '请输入姓名...' },
        { type: 'Input', label: '手机号', prop: 'mobilePhone', width: '100px', placeholder: '请输入手机号码...' }
      ],
      searchHandle: [
        { label: '查询', type: 'primary', handle: this.getList },
        { label: '重置', type: 'primary', handle: this.resetForm }
      ],
      // 操作按钮（ single:非单个禁用，multiple:非多个禁用）
      single: true, multiple: true, checkAll: false, dialogVisible: false, isEdit: false,
      // 表格（total: 总条数）
      total: 0, loading: true, list: [],
      levels: [-1, -1, -1, -1],
      searchData: { // 查询参数
        pageNum: 1, pageSize: 10, userId: undefined, buildingId: undefined, communityId: undefined,
        merchantId: undefined, roomNo: undefined, unitId: undefined,
        data: { mobilePhone: undefined, residentName: undefined }
      },
      columns: Object.freeze([
        { attrs: { prop: 'communityName', label: '小区', width: '100', align: 'center' }},
        { attrs: { prop: 'buildingName', label: '栋', width: '50', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'unitName', label: '单元', width: '50', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'roomNo', label: '室', width: '50', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'houseArea', label: '建筑面积', width: '80', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'residentName', label: '姓名', width: '70', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'mobilePhone', label: '手机号', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'certificateNo', label: '证件号', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'residentIdentity', label: '住户身份', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'createTime', label: '创建时间', width: '100', 'show-overflow-tooltip': true }},
        { slot: 'handle', attrs: { label: '操作', width: '180', 'class-name': 'small-padding fixed-width', align: 'center' }}
      ])
    }
  },
  mounted() {
    this.initExpand()
    this.getProperty()
  },
  methods: {
    // 表格重置
    resetForm() {
      Object.assign(this.$data.searchData, this.$options.data().searchData)
    },
    // 获取物业菜单
    async getProperty() {
      this.queryParams.userId = this.$store.getters.id
      await listProperty(this.queryParams).then((response) => {
        this.treeList = response.data
        this.isLoadingTree = true
      })
      this.getList()
    },

    // 获取小区列表、表格信息
    getList() {
      this.searchData.userId = this.$store.getters.id
      this.searchData.data.mobilePhone = this.searchData.mobilePhone
      this.searchData.data.residentName = this.searchData.residentName
      this.loading = true
      listResident(this.searchData).then((response) => {
        this.list = response.data.rows
        this.total = response.data.total
        this.loading = false
      })
    },
    initExpand() {},
    handleNodeClick(d, node, s) { // 点击节点
      // 置空 物业 单元 楼栋 小区
      this.levels = [-1, -1, -1, -1]
      // 遍历节点信息
      this.nodeCheck(node)
      d.treeIsEdit = false// 放弃编辑状态
      // 设置选中
      this.nodeSet()
      // 获取住户信息
      this.getList()
    },
    nodeCheck(node) {
      // 终止条件
      if (node.key === undefined || node === undefined) {
        return
      }
      // 判断level
      this.levels[node.level - 1] = node.key
      this.nodeCheck(node.parent)
    },
    nodeSet() {
      const level = this.levels
      // 物业编号
      this.searchData.merchantId = level[0] === -1 ? undefined : level[0]
      // 小区编号
      this.searchData.communityId = level[1] === -1 ? undefined : level[1]
      // 楼栋编号
      this.searchData.buildingId = level[2] === -1 ? undefined : level[2]
      // 单元编号
      this.searchData.unitId = level[3] === -1 ? undefined : level[3]
    },
    renderContent(h, { node, data, store }) { // 加载节点
      const that = this
      return h(TreeRender, {
        props: { DATA: data, NODE: node, STORE: store, maxexpandId: that.non_maxexpandId },
        on: {
          nodeAdd: (s, d, n) => that.nodeAdd(s, d, n),
          nodeEdit: (s, d, n) => that.nodeEdit(s, d, n),
          nodeDel: (s, d, n) => that.nodeDelete(s, d, n)
        }
      })
    },
    // 原本用来增添父节点的方法
    handleAddTop() {
    },
    nodeAdd(s, d, n) { // 增加节点
      if (n.level === 1) {
        this.newdialog = 1
      } else if (n.level === 2) {
        this.newdialog = 2
      } else if (n.level === 3) {
        this.newdialog = 3
      } else {
        this.newdialog = 4
      }
      this.treeDialogVisible = true
      this.treeIsEdit = false
      // this.community = Object.assign({}, defaultCommunity) // 默认值为空
    },
    nodeEdit(s, d, n) { // 编辑节点
      // console.log(s, d, n)
    },
    nodeDelete(s, d, n) { // 删除节点
      // console.log(s, d, n)
      const that = this
      // 有子级不删除
      if (d.children && d.children.length !== 0) {
        this.$message.error('此节点有子级，不可删除！')
        return false
      } else {
        // 新增节点直接删除，否则要询问是否删除
        const delNode = () => {
          const list = n.parent.data.children || n.parent.data
          let // 节点同级数据
            _index = 99999// 要删除的index
          list.map((c, i) => {
            if (d.id == c.id) {
              _index = i
            }
          })
          const k = list.splice(_index, 1)
          this.$message.success('删除成功！')
        }
        const isDel = () => {
          that.$confirm('是否删除此节点？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delNode()
          }).catch(() => {
            return false
          })
        }
        // 判断是否新增
        d.id > this.non_maxexpandId ? delNode() : isDel()
      }
    },
    // 表格方法
    handleUpdate(row, index) {
      // console.log(row, index)
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
    },
    handleDelete(row) {
      const userIds = row.id || this.ids
      this.$confirm('是否确认删除用户编号为"' + userIds + '"的数据项?', '警告',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(function() {
        return delUser(userIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入'
      this.upload.open = true
    },
    /** 导出按钮操作 */
    handleExport() {
      const searchData = this.searchData
      if (this.checkAll) {
        searchData.pageNum = undefined
        searchData.pageSize = undefined
        searchData.type = 'all'
      }
      this.$confirm('是否确认导出用户数据项?', '警告',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(function() {
        exportUser(searchData).then(res => {
          // console.log(res)
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
          // console.log(sysDate)
          fileDownload(res, sysDate + '用户信息表.xlsx')
        }).catch(err => {
          // console.log(err)
        })
      }).catch(function() {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .expand {
    width: 100%;
    height: 80%;
    overflow: hidden;
    float: left;
    width: 17%;
  }

  .expand > div {
    padding-top: 20px;
    max-width: 400px;
    overflow-y: auto;
    /*text-align: center;*/
  }

  .expand > div::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    border-radius: 5px;
  }

  .expand > div::-webkit-scrollbar-thumb {
    background-color: rgba(50, 65, 87, 0.5);
    outline: 1px solid slategrey;
    border-radius: 5px;
  }

  .expand > div::-webkit-scrollbar {
    width: 10px;
  }

  .expand-tree {
    border: none;
    margin-top: 10px;
    /*margin-left: 60px;*/
  }

  .expand-tree .el-tree-node.is-current,
  .expand-tree .el-tree-node:hover {
    overflow: hidden;
  }

  .expand-tree .is-current > .el-tree-node__content .tree-btn,
  .expand-tree .el-tree-node__content:hover .tree-btn {
    display: inline-block;
  }

  .expand-tree .is-current > .el-tree-node__content .tree-label {
    font-weight: 600;
    white-space: normal;
  }

  .el-button {
    padding: 5px 10px;
  }

  /*左边的树*/
  /*.tree{*/
  /*  float: left;*/
  /*  width: 17%;*/
  /*}*/
  /* 右边的住户信息 */
  .resident {
    float: left;
    width: 82%;
    padding-top: 20px;
    margin-left: 10px;
  }

  .myTrees {
    width: 288px;
    background: rebeccapurple;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  /*  表格*/
  .el-row {
    margin-left: 10px !important;
  }

  .el-table {
    width: 98% !important;
    border-right: none !important;
  }

  .el-checkbox:last-of-type {
    margin-right: 0;
    float: right;
  }

  .el-button + .el-button {
    margin-left: 10px;
    float: right;
  }

  .el-button + .el-button[data-v-b649ad9e] {
    margin-left: 10px;
    float: right;
  }

  /*搜索条件*/
  .ces-search {
    height: 50px;
    margin-top: 10px;
  }

  .searchMain {
    height: 100px;
  }
</style>
<style>
  .expand-tree .is-current > .el-tree-node__content .tree-btn,
  .expand-tree .el-tree-node__content:hover .tree-btn {
    display: inline-block;
  }
</style>
