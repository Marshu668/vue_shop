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
                       <el-tag closable @close='removeRightById(scope.row, item1.id)'>{{item1.authName}}</el-tag>
                     <i class="el-icon-caret-right"></i>
                   </el-col>
                   <!-- 渲染二级或三级权限 -->
                   <el-col :span="19">
                       <!-- 通过for循环嵌套渲染所有的二级权限 -->
                       <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"  v-for="(item2, i2) in item1.children" :key="item2.id">
                           <el-col :span="6">
                             <el-tag type="success" closable @close='removeRightById(scope.row, item2.id)'>{{item2.authName}}</el-tag>
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
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-search">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
              </template>
          </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%" @close="setRightDialogClosed">
  <!-- 树形控件  :data是整个的数据来源 :props指定这棵树数据绑定的字段 node-key是给每个树节点用来作为唯一的标识属性,整棵树应该是唯一的 default-expand-all是否默认展开所有节点 -->
  <el-tree :data="rightslist" :props="treeProps"  show-checkbox node-key="id" default-expand-all :default-checked-keys="defkeys" ref="treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取角色列表数据
      rolelist: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点的id值数组
      defkeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
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
      // 防止三级权限页面点击删除之后对应的展开行就关上的现象,把服务器返回的最新的权限直接赋值给当前角色的children属性
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 获取所有分配权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 获取到的权限数据  保存到data中
      this.rightslist = res.data
      console.log(this.rightslist)
      // 递归获取三级节点的id
      this.getLeafkeys(role, this.defkeys)
      this.setRightDialogVisible = true
    },
    // 定义一个递归函数,获取角色下所有的三级权限的id并且保存到数组defkeys中,
    getLeafkeys (node, arr) {
      if (!node.children) {
        // 如果当前node节点不包括children属性,则是三级节点
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafkeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed () {
      this.defkeys = []
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
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
