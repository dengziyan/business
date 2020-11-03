<template>
  <div>
    <div class="tree">
      <!--小区左边的树形控件组件  -->
      <div class="expand">
        <div>
          小区信息
          <el-button @click="handleAddTop">导入</el-button>
          <el-tree
            v-if="isLoadingTree"
            ref="expandMenuList"
            class="expand-tree"
            :data="list"
            node-key="id"
            highlight-current
            :props="defaultProps"
            :expand-on-click-node="false"
            :render-content="renderContent"
            :default-expanded-keys="defaultExpandKeys"
            @node-click="handleNodeClick"
          />
          <!--点击新增后出现的弹框    -->
          <el-dialog :title="isEdit?'编辑用户':'添加用户'" :visible.sync="dialogVisible" width="650px">
            <!--弹框子组件      -->
            <new-dialog />
          </el-dialog>
        </div>
      </div>
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
import TreeRender from '@/components/Tree/index'
import commSearch from './commSearch'
import commTree from './commTree2'
import commTable from './commTable'
import newDialog from './newDialog'
import { listProperty } from '@/api/CommunityMag/community'
import { addDateRange } from "@/utils/userright";
const id = 1000
export default {
  components: {
    commSearch,
    commTree,
    commTable,
    newDialog
  },
  data() {
    return {
      list: [],
      queryParams: {
        userId: this.$store.getters.id
      },
      maxexpandId: 95, // 新增节点开始id
      non_maxexpandId: 95, // 新增节点开始id(不更改)
      isLoadingTree: false, // 是否加载节点树
      // setTree: api.treelist, // 节点树数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultExpandKeys: [], // 默认展开节点列表
      dialogVisible: false,
      isEdit: false
    }
  },
  mounted() {
    this.getList()
    this.initExpand()
  },
  methods: {
    getList() {
      listProperty(this.queryParams).then(
        (response) => {
          this.list = response.data
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    initExpand() {
      this.list.map((a) => {
        this.defaultExpandKeys.push(a.id)
      })
      this.isLoadingTree = true
    },
    handleNodeClick(d, n, s) { // 点击节点
      // console.log(d,n)
      d.isEdit = false// 放弃编辑状态
    },
    renderContent(h, { node, data, store }) { // 加载节点
      const that = this
      return h(TreeRender, {
        props: {
          DATA: data,
          NODE: node,
          STORE: store,
          maxexpandId: that.non_maxexpandId
        },
        on: {
          nodeAdd: (s, d, n) => that.handleAdd(s, d, n),
          nodeEdit: (s, d, n) => that.handleEdit(s, d, n),
          nodeDel: (s, d, n) => that.handleDelete(s, d, n)
        }
      })
    },
    // 原本用来增添父节点的方法
    handleAddTop() {
      this.setTree.push({
        id: ++this.maxexpandId,
        name: '新增节点',
        pid: '',
        isEdit: false,
        children: []
      })
    },
    handleAdd(s, d, n) { // 增加节点
      this.dialogVisible = true
      this.isEdit = false
      // this.community = Object.assign({}, defaultCommunity) // 默认值为空

    },
    handleEdit(s, d, n) { // 编辑节点
      console.log(s, d, n)
    },
    handleDelete(s, d, n) { // 删除节点
      console.log(s, d, n)
      const that = this
      // 有子级不删除
      if (d.children && d.children.length !== 0) {
        this.$message.error('此节点有子级，不可删除！')
        return false
      } else {
        // 新增节点直接删除，否则要询问是否删除
        const delNode = () => {
          const list = n.parent.data.children || n.parent.data; let // 节点同级数据
            _index = 99999// 要删除的index
          /* if(!n.parent.data.children){//删除顶级节点，无children
            list = n.parent.data
          }*/
          list.map((c, i) => {
            if (d.id == c.id) {
              _index = i
            }
          })
          const k = list.splice(_index, 1)
          // console.log(_index,k)
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
    }
  }
}
</script>

<style lang="scss" scoped>

  .expand{
    width:100%;
    height:80%;
    overflow:hidden;
  }
  .expand>div{
    /* height: 5%; */
    padding-top: 20px;
    /*width: 25%;*/
    /* margin: 20px auto; */
    max-width: 400px;
    overflow-y: auto;
  }
  .expand>div::-webkit-scrollbar-track{
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    border-radius:5px;
  }
  .expand>div::-webkit-scrollbar-thumb{
    background-color:rgba(50, 65, 87, 0.5);
    outline:1px solid slategrey;
    border-radius:5px;
  }
  .expand>div::-webkit-scrollbar{
    width:10px;
  }
  .expand-tree{
    border:none;
    margin-top:10px;
  }
  .expand-tree .el-tree-node.is-current,
  .expand-tree .el-tree-node:hover{
    overflow:hidden;
  }
  .expand-tree .is-current>.el-tree-node__content .tree-btn,
  .expand-tree .el-tree-node__content:hover .tree-btn{
    display:inline-block;
  }
  .expand-tree .is-current>.el-tree-node__content .tree-label{
    font-weight:600;
    white-space:normal;
  }
  .el-button{
    padding: 5px 10px;
  }
    /*左边的树*/
  .tree{
    float: left;
    width: 17%;
  }
    /* 右边的住户信息 */
  .table{
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
  /*.el-form-item--small{*/
  /*  width: auto;*/
  /*  float: left;*/
  /*}*/
</style>
