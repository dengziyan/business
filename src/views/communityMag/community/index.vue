<template>
  <div v-loading="loading" class="app-container">
    <!--小区左边的树形控件组件  -->
    <div v-show="!loading" class="expand">
      <div v-loading="isLoadingTree">
        小区信息
        <el-button @click="handleAddTop">导入</el-button>
        <el-tree
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
          <community-dialog v-if="newdialog === 1" :visible.sync="treeDialogVisible" :refresh-property="refreshProperty" :edit-info="editInfo" :tree-is-edit="treeIsEdit" :require-id="requireId"/>
          <building-dialog v-if="newdialog === 2" :visible.sync="treeDialogVisible" :refresh-property="refreshProperty" :edit-info="editInfo" :tree-is-edit="treeIsEdit" :require-id="requireId"/>
          <unit-dialog v-if="newdialog === 3" :visible.sync="treeDialogVisible" :refresh-property="refreshProperty" :edit-info="editInfo" :tree-is-edit="treeIsEdit" :require-id="requireId"/>
          <merchant-dialog v-if="newdialog === 0" :visible.sync="treeDialogVisible" :refresh-property="refreshProperty" :edit-info="editInfo" :tree-is-edit="treeIsEdit" :require-id="requireId"/>
        </el-dialog>
        <!-- 小区信息导入对话框 -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
          <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url" :disabled="upload.isUploading" :http-request="handleFileUpload" :on-success="handleFileSuccess" :auto-upload="false" drag>
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip" style="color:#ff0000">提示：仅允许导入“xls”或“xlsx”格式文件！
              <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
            </div>
          </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitFileForm">确 定</el-button>
            <el-button @click="handleFileCancel">取 消</el-button>
          </div>
        </el-dialog>
        <!-- 住户信息导入对话框 -->
        <el-dialog :title="uploadResident.title" :visible.sync="uploadResident.open" width="400px" append-to-body>
          <el-upload ref="uploadResident" :limit="1" accept=".xlsx, .xls" :headers="uploadResident.headers" :action="uploadResident.url" :disabled="uploadResident.isUploading" :http-request="handleResidentFileUpload" :on-success="handleResidentFileSuccess" :auto-upload="false" drag>
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip" style="color:#ff0000">提示：仅允许导入“xls”或“xlsx”格式文件！
              <el-link type="info" style="font-size:12px" @click="importResidentTemplate">下载模板</el-link>
            </div>
          </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitResidentFileForm">确 定</el-button>
            <el-button @click="handleResidentFileCancel">取 消</el-button>
          </div>
        </el-dialog>

      </div>
    </div>
    <div v-show="!loading" class="resident">
      住户信息
      <div class="detail">
        <!--引入搜索条件子组件        -->
        <search-form class="searchMain" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />
        <el-row :gutter="10">
          <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>
          <el-button type="info" icon="el-icon-upload2" size="mini" :disabled="!multiple" @click="handleImportResident">导入</el-button>
          <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出</el-button>
          <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>
        </el-row>
        <!--小区表格及操作组件  -->
        <div class="table">
          <!-- 各个操作按钮 -->
          <!--引入表格组件        -->
          <TableVue v-loading="loadingTable" :columns="columns" :data="list" empty-text="暂无数据">
            <!-- #是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
            <template #handle="{scope: {row, $index}}">
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(row, $index)">删除</el-button>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(row)">编辑</el-button>
            </template>
          </TableVue>
          <!--分页    -->
          <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[10,25,50]" @pagination="getList" />
        </div>
        <el-dialog :title="isEdit?'编辑住户信息':'添加住户信息'" :visible.sync="dialogVisible" :edit.sync="isEdit" width="700px">
          <new-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :edit.sync="isEdit" :edit-info="editInfo" />
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
import newDialog from './newDialog'
import TableVue from '@/components/TableVue'
import SearchForm from '@/components/SearchForm'
import { listProperty, listResident, delProperty, listPropertyInfo, delResident, importCommunityTemplates,
  batchAddCommunity, exportResident, importResidentTemplates, batchAddResident } from '@/api/CommunityMag/community'
import { getToken } from '@/utils/auth'
import fileDownload from 'js-file-download'
import moment from 'moment'

export default {
  components: { communityDialog, buildingDialog, unitDialog, merchantDialog, TableVue, SearchForm, newDialog },
  data() {
    return {
      buildingId: 0,
      loadingTable: false,
      query: { merchantId: undefined, communityId: undefined, buildingId: undefined, unitId: undefined, residentId: undefined },
      editInfo: {},
      treeList: [], maxexpandId: 95, non_maxexpandId: 95, isLoadingTree: false, requireId: 0, fullscreenLoading: false,
      defaultExpandKeys: [], treeDialogVisible: false, treeIsEdit: false, newdialog: 0,
      defaultProps: { children: 'children', label: 'name', id: 'name' },
      queryParams: { userId: undefined },
      // 小区信息导入参数
      upload: {
        open: false, title: '', isUploading: false, headers: { Authorization: getToken() },
        url: process.env.VUE_APP_BASE_API + '/sys/community/import' // 上传的地址
      },
      uploadResident: {
        open: false, title: '', isUploading: false, headers: { Authorization: getToken() },
        url: process.env.VUE_APP_BASE_API + '/sys/resident/import' // 上传的地址
      },
      open: false, // 是否显示弹出层
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
        { attrs: { prop: 'buildingName', label: '栋', width: '100', align: 'center', 'show-overflow-tooltip': false }},
        { attrs: { prop: 'unitName', label: '单元', width: '90', align: 'center', 'show-overflow-tooltip': false }},
        { attrs: { prop: 'roomNo', label: '室', width: '90', align: 'center', 'show-overflow-tooltip': false }},
        { attrs: { prop: 'houseArea', label: '建筑面积(m²)', width: '120', align: 'center', 'show-overflow-tooltip': false }},
        { attrs: { prop: 'residentName', label: '姓名', width: '70', align: 'center', 'show-overflow-tooltip': false }},
        { attrs: { prop: 'mobilePhone', label: '手机号', align: 'center', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'certificateNo', label: '证件号', align: 'center', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'residentIdentity', label: '住户身份', width: '100', align: 'center', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'createTime', label: '创建时间', align: 'center', 'show-overflow-tooltip': true }},
        { slot: 'handle', attrs: { label: '操作', width: '150', 'class-name': 'small-padding fixed-width', align: 'center' }}
      ])
    }
  },
  mounted() {
    this.loadingMain()
    this.getList()
  },
  methods: {

    // 表格重置
    resetForm() {
      Object.assign(this.$data.searchData, this.$options.data().searchData)
    },
    loadingMain() {
      this.loading = true
      this.isLoadingTree = true
      this.getProperty()
    },
    // 获取物业菜单
    async getProperty() {
      this.queryParams.userId = this.$store.getters.id
      await listProperty(this.queryParams).then((response) => {
        this.treeList = response.data
        this.isLoadingTree = false
        this.loading = false
      })
    },
    refreshProperty() {
      this.isLoadingTree = true
      this.getProperty()
    },
    // 获取小区列表、表格信息
    getList() {
      this.searchData.userId = this.$store.getters.id
      this.searchData.data.mobilePhone = this.searchData.mobilePhone
      this.searchData.data.residentName = this.searchData.residentName

      listResident(this.searchData).then((response) => {
        this.list = response.data.rows
        this.total = response.data.total
        this.loadingTable = false
        this.loading = false
      })
    },

    // 点击节点
    handleNodeClick(d, node, s) {
      // 置空 物业 单元 楼栋 小区
      this.levels = [-1, -1, -1, -1]
      // 遍历节点信息
      this.nodeCheck(node)
      d.treeIsEdit = false// 放弃编辑状态
      // 设置选中
      this.nodeSet()
      this.loadingTable = true
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
      Object.assign(this.$data.query, this.$options.data().query)
      return h(TreeRender, {
        props: { DATA: data, NODE: node, STORE: store, maxexpandId: that.non_maxexpandId },
        on: {
          nodeAdd: (s, d, n) => that.nodeAdd(s, d, n),
          nodeEdit: (s, d, n) => that.nodeEdit(s, d, n),
          nodeDel: (s, d, n) => that.nodeDelete(s, d, n)
        }
      })
    },
    // 小区信息导入
    handleAddTop() {
      this.upload.title = '小区信息导入'
      this.upload.open = true
    },
    handleImportResident() {
      this.uploadResident.title = '住户信息导入'
      this.uploadResident.open = true
    },
    // 下载模板操作
    importTemplate() {
      importCommunityTemplates().then(res => {
        fileDownload(res, '小区信息导入模板.xlsx')
      }).catch(err => {
        console.log(err)
      })
    },
    importResidentTemplate() {
      importResidentTemplates().then(res => {
        fileDownload(res, '住户信息导入模板.xlsx')
      }).catch(err => {
        console.log(err)
      })
    },
    // http-request(请求)
    handleFileUpload(val) {
      const formData = new FormData()
      formData.append('file', val.file)
      batchAddCommunity(this.$store.getters.id, 2, formData).then(res => {
        val.onSuccess()
      }).catch(res => {
        val.onError(res)
      })
    },
    handleResidentFileUpload(val) {
      const formData = new FormData()
      formData.append('file', val.file)
      batchAddResident(this.$store.getters.id,formData).then(res => {
        val.onSuccess()
      }).catch(res => {
        val.onError(res)
      })
    },
    // on-success（文件上传成功处理）
    handleFileSuccess() {
      this.$refs.upload.clearFiles()
      this.upload.open = false
      this.upload.isUploading = false
      this.getList()
    },
    handleResidentFileSuccess() {
      this.$refs.uploadResident.clearFiles()
      this.uploadResident.open = false
      this.uploadResident.isUploading = false
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
    submitResidentFileForm() {
      this.$refs.uploadResident.submit()
    },
    // 导入弹出框取消
    handleFileCancel() {
      this.$refs.upload.clearFiles()
      this.upload.open = false
      this.upload.isUploading = false
    },
    handleResidentFileCancel() {
      this.$refs.uploadResident.clearFiles()
      this.uploadResident.open = false
      this.uploadResident.isUploading = false
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
      console.log(n)
      this.treeDialogVisible = true
      this.treeIsEdit = false
    },
    // 编辑节点
    async nodeEdit(s, d, n) {
      this.query.userId = this.$store.getters.id
      // 编辑物业
      if (n.level === 1) {
        this.newdialog = 0
        this.query.merchantId = n.key
      } else if (n.level === 2) { // 编辑小区
        this.newdialog = 1
        this.query.merchantId = n.parent.key
        this.query.communityId = n.key
      } else if (n.level === 3) { // 编辑楼栋
        this.newdialog = 2
        this.query.merchantId = n.parent.parent.key
        this.query.communityId = n.parent.key
        this.query.buildingId = n.key
      } else { // 编辑单元
        this.newdialog = 3
        this.query.merchantId = n.parent.parent.parent.key
        this.query.communityId = n.parent.parent.key
        this.query.buildingId = n.parent.key
        this.query.unitId = n.key
      }
      this.requireId = n.parent.key
      await listPropertyInfo(this.query).then(
        (response) => {
          console.log(response)
          this.editInfo = response.data || []
          this.editInfo.property = this.query
        }
      )
      this.treeDialogVisible = true
      this.treeIsEdit = true
    },
    // 删除节点
    nodeDelete(s, d, n) {
      this.query.userId = this.$store.getters.id
      if (n.level === 1) { // 删除物业
        this.query.merchantId = n.key
      } else if (n.level === 2) { // 删除小区
        this.query.merchantId = n.parent.key
        this.query.communityId = n.key
      } else if (n.level === 3) { // 删除楼栋
        this.query.merchantId = n.parent.parent.key
        this.query.communityId = n.parent.key
        this.query.buildingId = n.key
      } else { // 删除单元
        this.query.merchantId = n.parent.parent.parent.key
        this.query.communityId = n.parent.parent.key
        this.query.buildingId = n.parent.key
        this.query.unitId = n.key
      }
      const query = this.query
      this.$confirm('是否确认删除：' + n.label + '?', '警告',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(function() {
        return delProperty(query)
      }).then((res) => {
        this.getProperty()
        this.$message({
          message: '删除成功',
          type: res.code === 2000 ? 'success' : 'error'
        })
      }).catch(function() {
      })
    },
    // 按编辑按钮，弹出对话框
    handleUpdate(row) {
      this.dialogVisible = true
      this.isEdit = true
      this.editInfo = Object.assign({}, row)
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
    },
    handleDelete(row) {
      console.log(row)
      this.query.communityId = row.communityId
      this.query.buildingId = row.buildingId
      this.query.unitId = row.unitId
      this.query.residentId = row.id
      const query = this.query
      this.$confirm('是否确认删除"' + row.residentName + '"的住户信息?', '警告',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(function() {
        return delResident(query)
      }).then((res) => {
        this.getList()
        this.$message({
          message: res.message,
          type: res.code === 2000 ? 'success' : 'error'
        })
      }).catch(function() {
      })
    },

    // 导入按钮操作
    handleImport() {
      this.upload.title = '小区信息导入'
      this.upload.open = true
    },
    // 导出按钮操作
    handleExport() {
      const searchData = this.searchData
      if (this.checkAll) {
        searchData.pageNum = undefined
        searchData.pageSize = undefined
        searchData.type = 'all'
      }
      this.$confirm('是否确认导出小区信息?', '警告',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(function() {
        exportResident(searchData).then(res => {
          // console.log(res)
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
          // console.log(sysDate)
          fileDownload(res, sysDate + '住户信息表.xlsx')
          searchData.export = undefined
        })
          .catch(err => {
            console.log(err)
          })
      }).catch(function() {
      })
    },
    cancel() {
      this.treeDialogVisible = false
      Object.assign(this.$data.editInfo, this.$options.data().editInfo)
      Object.assign(this.$data.query, this.$options.data().query)
    }
  }
}
</script>

<style lang="scss" scoped>
  .expand {
    height: 80%;
    overflow: hidden;
    float: left;
    width: 15%;
  }

  .expand > div {
    padding: 20px;
    padding-right: 0px;
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
    /*padding: 5px 10px;*/
  }

  /* 右边的住户信息 */
  .resident {
    float: left;
    width: 84%;
    padding-top: 20px;
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
    width: 100% !important;
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
    /*margin-left: 10px;*/
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
  .el-button [class*=el-icon-]+span {
     /*margin-left: 0px;*/
  }
</style>
<style>
  .expand-tree .is-current > .el-tree-node__content .tree-btn,
  .expand-tree .el-tree-node__content:hover .tree-btn {
    display: inline-block;
  }
</style>
