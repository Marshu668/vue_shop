<template>
  <div>
      <!-- 面包屑导航 -->
    <Mbx nav1="权限管理" nav2="角色列表"></Mbx>
    <!-- 卡片视图 -->
    <el-card>
    <!-- 添加角色按钮区域 -->
      <el-row>
          <el-col>
              <el-button type="primary">添加角色</el-button>
          </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
          <!-- 左侧展开列 -->
          <el-table-column type="expand">
              <template  slot-scope="scope">
               <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                   <!-- 渲染一级权限 -->
                   <el-col :span="5">
                       <el-tag>{{item1.authName}}</el-tag>
                     <i class="el-icon-caret-right"></i>
                   </el-col>
                   <!-- 渲染二级或三级权限 -->
                   <el-col :span="19">
                       <!-- 通过for循环嵌套渲染所有的二级权限 -->
                       <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"  v-for="(item2, i2) in item1.children" :key="item2.id">
                           <el-col :span="6">
                             <el-tag type="success">{{item2.authName}}</el-tag>
                             <i class="el-icon-caret-right"></i>
                           </el-col>
                           <!-- 三级权限的指向,在二级权限身上嵌套了所有的三级权限 -->
                           <el-col :span="18">
                               <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id"  closable @close='removeRightById(scope.row, item3.id)'>{{item3.authName}}</el-tag>
                           </el-col>
                       </el-row>
                   </el-col>
               </el-row>
              </template>
          </el-table-column>
          <!--第二项 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="300px">
              <template>
                <el-button size="mini" type="primary" icon="el-icon-search">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
              </template>
          </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取角色列表数据
      rolelist: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    //  获取所有的角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
    },
    // 根据id删除对应的权限
    async removeRightById (role, rightId) {
      // 弹框提示用户是否要进行删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }

      role.children = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
