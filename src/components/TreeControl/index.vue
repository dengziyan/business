<template>
  <!--  树形控件-->
  <div>
    <el-tree
      ref="tree"
      node-key="id"
      :tree-data="treeData"
      default-expand-all
      :expand-on-click-node="false"
      @node-click="handleLeftclick"
    >
      <span slot-scope="{node,data}" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <i class="el-icon-plus" @click="addChildNode" /><!--增加分组-->
          <!-- 根节点不需要删除和重命名 -->
          <i v-if="data.id !== 0" class="el-icon-edit" @click="editNode" /><!--编辑-->
          <i v-if="data.id !== 0" class="el-icon-delete" @click="deleteNode" /><!--删除分组-->
        </span>
        <span>
          <!--              <el-dropdown trigger="click">-->
          <!--                <span class="el-dropdown-link">-->
          <!--                  <i class="el-icon-more" />-->
          <!--                </span>-->
          <!--                <el-dropdown-menu slot="dropdown">-->
          <!--                  <el-dropdown-item v-show="firstLevel" @click.native="addSameLevelNode">新增同级</el-dropdown-item>-->
          <!--                  <el-dropdown-item v-show="lastLevel" @click.native="addChildNode">新增下级</el-dropdown-item>-->
          <!--                  <el-dropdown-item @click.native="editNode">编辑</el-dropdown-item>-->
          <!--                  <el-dropdown-item @click.native="deleteNode">删除</el-dropdown-item>-->
          <!--                </el-dropdown-menu>-->
          <!--              </el-dropdown>-->
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  name: 'Index',
  // props: {
  //   treeData: {
  //     type: Object,
  //     required: true
  //   }
  // },
  data() {
    return {
      treeData: [
        {
          id: 1,
          label: '一级 2',
          isEdit: true,
          children: [{
            id: 3,
            label: '二级 2-1',
            isEdit: true,
            children: [{
              id: 4,
              isEdit: true,
              label: '三级 3-1-1'
            }, {
              id: 5,
              isEdit: true,
              label: '三级 3-1-2',
              disabled: true
            }]
          }, {
            id: 2,
            isEdit: true,
            label: '二级 2-2',
            disabled: true,
            children: [{
              id: 6,
              isEdit: true,
              label: '三级 3-2-1'
            }, {
              id: 7,
              isEdit: true,
              label: '三级 3-2-2',
              disabled: true
            }]
          }]
        }
      ]
    }
  },
  methods: {
    append(data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    // 鼠标左击事件
    handleLeftclick(data, node) {
      this.currentData = data
      this.currentNode = node
      if (node.level != 1) { // 如果是根节点则不显示新增同级
        this.firstLevel = true
      } else {
        this.firstLevel = false
      }
      if (node.level != 3) { // 如果是最后一级则不显示新增下级
        this.lastLevel = true
      } else {
        this.lastLevel = false
      }
    },
    // 增加同级节点事件
    addSameLevelNode() {
      const id = Math.ceil(Math.random() * 100)
      this.$prompt('请输入节点名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const treeD = { id: id, label: value }
        this.$refs.tree.append(treeD, this.currentNode.parent)
      }).catch(() => {

      })
    },
    // 增加子级节点事件
    addChildNode() {
      console.log(this.currentData)
      console.log(this.currentNode)
      this.dialogVisible = true
      this.isEdit = false
      this.community = Object.assign({}, defaultCommunity)
      if (this.currentNode.level >= 3) {
        this.$message.error('最多只支持三级！')
        return false
      }
      const id = Math.ceil(Math.random() * 100)
      // this.$prompt('请输入节点名称', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消'
      // }).then(({ value }) => {
      //   console.log('>>>>>>>', value)
      //   const treeD = { id: id, label: value }
      //   this.$refs.tree.append(treeD, this.currentNode)
      // }).catch(() => {
      //
      // })
    },
    // 删除节点
    deleteNode() {
      this.$confirm(`确定删除'${this.currentNode.label}'节点, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('>>>>删除', this.currentNode.data.code)
        this.$refs.tree.remove(this.currentNode)
      }).catch(() => {

      })
    },
    // 编辑节点
    editNode() {
      console.log('>>>>>xiugi', this.currentData.code)
      if (this.currentData.isEdit) {
        this.$prompt('请输入节点名称', '提示', {
          confirmButtonText: '确定',
          inputValue: this.currentNode.data.label,
          cancelButtonText: '取消'
        }).then(({ value }) => {
          console.log('bianji', this.$refs.tree)
          this.$set(this.currentData, 'label', value)
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
