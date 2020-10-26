<template>
  <!--小区左边的树形控件组件  -->
  <div class="expand">
    <div>
      小区信息
      <el-button @click="handleAddTop">导入</el-button>
      <el-tree
        v-if="isLoadingTree"
        ref="expandMenuList"
        class="expand-tree"
        :data="setTree"
        node-key="id"
        highlight-current
        :props="defaultProps"
        :expand-on-click-node="false"
        :render-content="renderContent"
        :default-expanded-keys="defaultExpandKeys"
        @node-click="handleNodeClick"
      />
      <!--点击新增后出现的弹框    -->
      <el-dialog :title="isEdit?'编辑用户':'添加用户'" :visible.sync="dialogVisible" width="30%">
        <!--弹框子组件      -->
        <new-dialog />
      </el-dialog>
    </div>
  </div>
</template>
<!-- VUE饿了么树形控件添加增删改功能按钮 -->
<script>
import TreeRender from '../../../components/Tree/index'
// import api from '@/resource/api'
const defaultCommunity = {

}
export default {
  name: 'Tree',
  data() {
    return {
      maxexpandId: 95, // 新增节点开始id
      non_maxexpandId: 95, // 新增节点开始id(不更改)
      isLoadingTree: false, // 是否加载节点树
      // setTree: api.treelist, // 节点树数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultExpandKeys: [], // 默认展开节点列表
      setTree: [
        {
          id: 1,
          name: '丽岛物业',
          ProSort: 1,
          remark: '直辖市',
          pid: '',
          isEdit: false,
          children: [
            {
              id: 2,
              name: '招行物业小区1',
              pid: 1,
              remark: '',
              isEdit: false,
              children: [
                {
                  id: 5,
                  name: '1栋',
                  pid: 1,
                  remark: '',
                  isEdit: false,
                  children: [
                    {
                      id: 7,
                      name: '1单元',
                      pid: 1,
                      remark: '',
                      isEdit: false,
                      children: [
                      ]
                    },
                    {
                      id: 8,
                      name: '2单元',
                      pid: 1,
                      remark: '',
                      isEdit: false,
                      children: [
                      ]
                    }
                  ]
                },
                {
                  id: 6,
                  name: '2栋',
                  pid: 1,
                  remark: '',
                  isEdit: false,
                  children: [
                    {
                      id: 9,
                      name: '1单元',
                      pid: 1,
                      remark: '',
                      isEdit: false,
                      children: [
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: 3,
              name: '招行物业小区2',
              pid: 1,
              remark: '',
              isEdit: false,
              children: [
                {
                  id: 10,
                  name: '1栋',
                  pid: 1,
                  remark: '',
                  isEdit: false,
                  children: [
                  ]
                },
                {
                  id: 11,
                  name: '2栋',
                  pid: 1,
                  remark: '',
                  isEdit: false,
                  children: [
                  ]
                }
              ]
            },
            {
              id: 4,
              name: '招行物业小区3',
              pid: 1,
              remark: '',
              isEdit: false,
              children: [
                {
                  id: 12,
                  name: '1栋',
                  pid: 1,
                  remark: '',
                  isEdit: false,
                  children: [
                  ]
                },
                {
                  id: 13,
                  name: '2栋',
                  pid: 1,
                  remark: '',
                  isEdit: false,
                  children: [
                  ]
                },
                {
                  id: 14,
                  name: '3栋',
                  pid: 1,
                  remark: '',
                  isEdit: false,
                  children: [
                  ]
                }
              ]
            }]
        }],
      dialogVisible: false,
      isEdit: false
    }
  },
  mounted() {
    this.initExpand()
  },
  methods: {

    initExpand() {
      this.setTree.map((a) => {
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
      // console.log(s, d, n)
      // if (n.level >= 6) {
      //   this.$message.error('最多只支持五级！')
      //   return false
      // }
      // // 添加数据
      // d.children.push({
      //   id: ++this.maxexpandId,
      //   name: '新增节点',
      //   pid: d.id,
      //   isEdit: false,
      //   children: []
      // })
      // // 展开节点
      // if (!n.expanded) {
      //   n.expanded = true
      // }
      this.dialogVisible = true
      this.isEdit = false
      this.community = Object.assign({}, defaultCommunity) // 默认值为空

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

<style>
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
</style>
