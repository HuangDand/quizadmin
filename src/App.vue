<template>
  <div id="app">
    <el-container style="height: 100vh;">

      <!-- 左侧侧边栏 -->
      <el-aside width="200px" class="sidebar">
        <div class="sidebar-title">
          Quiz后台管理
        </div>

        <el-menu
          :default-active="$route.path"
          router
          background-color="#f4f4f4"
          text-color="#333"
          active-text-color="#409eff"
        >
          <el-menu-item index="/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>

          <el-menu-item index="/quiz">
            <i class="el-icon-document"></i>
            <span slot="title">题目管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 右侧主内容区 -->
      <el-container>
        <el-header class="main-header">
          Quiz后台管理系统
        </el-header>

        <el-main class="main-content">
          <router-view></router-view>
        </el-main>
      </el-container>

    </el-container>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
* {
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

.sidebar {
  background-color: #f4f4f4;
  border-right: 1px solid #e6e6e6;
}

.sidebar-title {
  padding: 22px 12px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  color: #303133;
}

.main-header {
  height: 60px !important;
  line-height: 60px;
  background-color: #b3c0d1;
  color: #303133;
  font-size: 20px;
  text-align: center;
}

.main-content {
  padding: 20px;
  background-color: #ffffff;
  overflow-y: auto;
}
</style>