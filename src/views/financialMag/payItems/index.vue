<template>
  <div>
    收费项目管理
    <el-tree
      ref="tree"
      class="treeitems"
      :data="data"
      node-key="id"
      :props="defaultProps"
      :load="loadNode"
      lazy
      :default-expanded-keys="[0]"
      draggable
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      @node-click="handleNodeClick"
      @node-drop="handleDrop"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <i class="el-icon-plus" @click="() => append(node,data)" /><!--增加分组-->
          <!-- 根节点不需要删除和重命名 -->
          <i v-if="data.id !== 0" class="el-icon-delete" @click="() => deletes(node,data)" /><!--删除分组-->
          <i v-if="data.id !== 0" class="el-icon-edit" @click="() => rename(node,data)" /><!--重命名分组-->
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
export default {
  name: 'Index',
  data() {
    return {
      filterText: '',
      data: [
        {
          id: 0,
          label: '中国'
        }
      ],
      children: [
        {
          id: 1,
          label: '北京',
          children: [
            {
              id: 11,
              label: '通州'
            }
          ]
        },
        {
          id: 2,
          label: '上海',
          leaf: true
        },
        {
          id: 3,
          label: '山西',
          children: [
            {
              id: 13,
              label: '太原'
            },
            {
              id: 14,
              label: '阳泉'
            }
          ]
        },
        {
          id: 4,
          label: '黑龙江',
          children: [
            {
              id: 12,
              label: '哈尔滨'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf' // 懒加载
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    // 点重命名事件
    append(node, data) {
      console.log(node, data, '增加')
      this.$prompt('节点名字', '增加节点', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5]{0,}$/, // 匹配全中文
        inputErrorMessage: '请输入中文'// 不符合正则匹配的提示语句
      }).then(({ value }) => {
        // 可以在这里发请求，http是我模拟的一个虚假的封装好的axios请求,()可写请求参数
        http().then((data) => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          // 请求成功需局部刷新该节点，调用方法,把节点信息node传入
          this.partialRefresh(node)
        })
          // 请求失败
          .catch(() => {
            this.$message({
              type: 'info',
              message: '修改失败'
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        })
      })
    },
    // 实现局部刷新，在点击弹窗处调用的
    partialRefreshpartialRefresh(node) {
      // 设置loaded为false；模拟一次节点展开事件，加载重命名后的新数据；
      node.loaded = false
      node.expand()
      // 新建子节点是刷新一次本节点的展开请求，而重命名和删除则需要刷新父级节点的的展开事件，
      // 可以设置node.parent.loaded = false;node.parent.expand();
    },
    // 懒加载
    loadNode(node, resolve) {
      if (node.level === 0) {
        // 本地的数据，一个承载中国字样的数组；
        return resolve(this.data)
      } else if (node.level === 1) {
        // 现在为模拟数据；
        // 有真实数据，在resolve中放置请求回来的数据即可。
        // else同样也是。我这里是区分了两种请求方式。
        return resolve(this.children)
      } else {
        return resolve([])
      }
    },
    // 拖拽==>拖拽时判定目标节点能否被放置
    // 后更改为只能同级拖拽
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level) {
        if (draggingNode.data.parentId === dropNode.data.parentId) {
          return type === 'prev' || type === 'next'
        }
      } else {
        // 不同级不允许拖拽
        return false
      }
    },
    // 拖拽==>判断节点能否被拖拽
    allowDrag(draggingNode) {
      return draggingNode.level !== 1
    },
    // 拖拽成功完成时触发的事件，在这里可以将节点拖拽后的顺序返给后端
    handleDrop(node, data, type, event) {
      const arr = []
      // data为拖拽后节点信息，找到它的父级，在从父级找子集
      const child = data.parent.childNodes
      for (var key in child) {
        arr.push({ id: child[key].data.id })
      }
      // 转为JSON字符串发请求带走信息
      idSort(JSON.stringify(arr))
    }
  }
}
</script>

<style scoped>

</style>
