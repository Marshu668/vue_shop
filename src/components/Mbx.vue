<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ nav1 }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ nav2 }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: ['nav1', 'nav2']
}
</script>

<style lang="less" scoped></style>
