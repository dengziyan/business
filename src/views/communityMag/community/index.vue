<template>
  <div class="app-container">
    <!--小区左边的树形控件组件  -->
    <div v-loading="loading" class="expand">
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
          :default-expand-all="true"
          :check-strictly="true"
          auto-expand-parent
          @node-click="handleNodeClick"
        />
        <!--点击+新增后出现的弹框    -->
        <el-dialog v-if="treeDialogVisible" :title="treeIsEdit?'编辑':'添加'" :visible.sync="treeDialogVisible" width="650px" @close="cancel">
          <!--弹框子组件      -->
          <community-dialog v-if="newdialog === 1" :visible.sync="treeDialogVisible" :require-id="requireId" :refresh-property="refreshProperty" />
          <building-dialog v-if="newdialog === 2" :visible.sync="treeDialogVisible" :require-id="requireId" :refresh-property="refreshProperty" :edit-building="editBuilding" :tree-is-edit="treeIsEdit" />
          <unit-dialog v-if="newdialog === 3" :visible.sync="treeDialogVisible" :require-id="requireId" :refresh-property="refreshProperty" />
          <merchant-dialog v-if="newdialog === 0" :visible.sync="treeDialogVisible" :require-id="requireId" :refresh-property="refreshProperty" />
        </el-dialog>
      </div>
    </div>
    <div v-loading="loading" class="resident">
      住户信息
      <div class="detail">
        <!--引入搜索条件子组件        -->
        <search-form class="searchMain" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />
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
          <TableVue :columns="columns" :data="list" empty-text="暂无数据">
            <!-- #是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
            <template #handle="{scope: {row, $index}}">
              <el-button type="danger" size="mini" @click="handleDelete()">删除</el-button>
              <el-button type="primary" size="mini" @click="handleUpdate(row, $index)">编辑</el-button>
            </template>
          </TableVue>
          <!--分页    -->
          <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[10,25,50]" @pagination="getList" />
        </div>
        <el-dialog :title="isEdit?'编辑住户信息':'添加住户信息'" :visible.sync="dialogVisible" width="600px">
          <new-dialog :visible.sync="dialogVisible" />
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import TreeRender from '@/components/Tree/index'
import communityDialog from './communityDialog'
import buildingDialog from './buildingDialog'
import unitDialog from './unitDialog'
import merchantDialog from './merchantDialog'
import TableVue from '@/components/TableVue'
import SearchForm from '@/components/SearchForm'
import { listProperty, listResident, delProperty, listPropertyInfo } from '@/api/CommunityMag/community'

const id = 1000
export default {
  components: { communityDialog, buildingDialog, unitDialog, merchantDialog, TableVue, SearchForm },
  data() {
    return {
      buildingId: 0,
      // 左边的树（maxexpandId:新增节点开始id，isLoadingTree: 是否加载节点树，defaultExpandKeys默认展开节点列表
      delQuery: { merchantId: undefined, communityId: undefined, buildingId: undefined, unitId: undefined },
      editQuery: { merchantId: undefined, communityId: undefined, buildingId: undefined, unitId: undefined },
      editBuilding: {},
      treeList: [], maxexpandId: 95, non_maxexpandId: 95, isLoadingTree: false, requireId: 0,
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
    // 关闭弹框是重置表格
    // closeImport() {
    //   this.$refs['ref1'].resetFields()
    // },
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
    refreshProperty() {
      this.getProperty()
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
    // 点击节点
    handleNodeClick(d, node, s) {
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
      if (node.key === undefined) {
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
      Object.assign(this.$data.editQuery, this.$options.data().editQuery)
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
    // 增加节点
    nodeAdd(s, d, n) {
      if (n.level === 1) {
        this.newdialog = 1
      } else if (n.level === 2) {
        this.newdialog = 2
      } else if (n.level === 3) {
        this.newdialog = 3
      } else {
        this.newdialog = 4
      }
      this.requireId = n.key
      this.treeDialogVisible = true
      this.treeIsEdit = false
    },
    // 编辑节点
    async nodeEdit(s, d, n) {
      this.editQuery.userId = this.$store.getters.id
      // 编辑物业
      if (n.level === 1) {
        this.newdialog = 0
        this.editQuery.merchantId = n.key
      } else if (n.level === 2) { // 编辑小区
        this.newdialog = 1
        this.editQuery.merchantId = n.parent.key
        this.editQuery.communityId = n.key
      } else if (n.level === 3) { // 编辑楼栋
        this.newdialog = 2
        this.editQuery.merchantId = n.parent.parent.key
        this.editQuery.communityId = n.parent.key
        this.editQuery.buildingId = n.key
      } else { // 编辑单元
        this.newdialog = 3
        this.editQuery.merchantId = n.parent.parent.parent.key
        this.editQuery.communityId = n.parent.parent.key
        this.editQuery.buildingId = n.parent.key
        this.editQuery.unitId = n.key
      }
      this.loading = true

      await listPropertyInfo(this.editQuery).then(
        (response) => {
          this.editBuilding = response.data
          this.loading = false
        }
      )
      this.treeDialogVisible = true
      this.treeIsEdit = true
    },
    // 删除节点
    nodeDelete(s, d, n) {
      this.delQuery.userId=this.$store.getters.id
      if (n.level === 1) { // 删除物业
        this.delQuery.merchantId = n.key
      } else if (n.level === 2) { // 删除小区
        this.delQuery.merchantId = n.parent.key
        this.delQuery.communityId = n.key
      } else if (n.level === 3) { // 删除楼栋
        this.delQuery.merchantId = n.parent.parent.key
        this.delQuery.communityId = n.parent.key
        this.delQuery.buildingId = n.key
      } else { // 删除单元
        this.delQuery.merchantId = n.parent.parent.parent.key
        this.delQuery.communityId = n.parent.parent.key
        this.delQuery.buildingId = n.parent.key
        this.delQuery.unitId = n.key
      }
      const delQuery = this.delQuery
      this.$confirm('是否确认删除：' + n.label + '?', '警告',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(function() {
        return delProperty(delQuery)
      }).then((res) => {
        this.getProperty()
        this.$message({
          message: res.message,
          type: res.code === 2000 ? 'success' : 'error'
        })
      }).catch(function() {
      })
    },
    // 表格方法
    handleUpdate(row, index) {
      this.dialogVisible = true
      this.isEdit = true
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.user = Object.assign({}, row)
    },
    handleDelete(row) {
      const userIds = row.id || this.ids
      this.$confirm('是否确认删除用户编号为"' + userIds + '"的数据项?', '警告',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(function() {
        // return delUser(userIds)
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

      }).catch(function() {
      })
    },
    cancel() {
      this.treeDialogVisible = false
      // this.$emit('update:visible', this.treeDialogVisible)
      console.log('xxxxxxxxx')
      Object.assign(this.$data.editBuilding, this.$options.data().editBuilding)
      Object.assign(this.$data.editQuery, this.$options.data().editQuery)
    }
  }
}
</script>

<style lang="scss" scoped>
  .expand {
    height: 80%;
    overflow: hidden;
    float: left;
    width: 17%;
  }

  .expand > div {
    padding: 20px;
    max-width: 400px;
    overflow-y: auto;
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
