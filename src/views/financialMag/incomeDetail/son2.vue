<template>
  <!-- 子组件son2 -->
  <div @click="triggerBrotherMethods">
    <!-- 父组件传值展示 -->
    {{dataFromFather}}
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props: ['dataFromFather'],
  methods: {
    // 触发兄弟组件中的按钮事件
    triggerBrotherMethods() {
      this.$parent.$refs.borther.bortherMethods()
      this.$emit('clickBrotherBtn', true)
    }
  }
}
</script>

<style scoped>
  /* .... */
</style>
