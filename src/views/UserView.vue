<template>
  <div class="user-view">

    <!-- 页面标题 -->
    <div class="page-title">
      用户管理
    </div>

    <!-- 查询区域 -->
    <el-form
      :inline="true"
      :model="formInline"
      class="search-form"
    >
      <el-form-item label="用户名">
        <el-input
          v-model="formInline.user"
          placeholder="请输入用户名"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="地区">
        <el-select
          v-model="formInline.region"
          placeholder="请选择地区"
          clearable
        >
          <el-option
            label="区域一"
            value="shanghai"
          ></el-option>

          <el-option
            label="区域二"
            value="beijing"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="创建时间">
        <el-date-picker
          v-model="formInline.date"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          clearable
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="onSubmit"
        >
          查询
        </el-button>

        <el-button
          @click="resetSearch"
        >
          重置
        </el-button>

        <el-button
          type="success"
          icon="el-icon-plus"
          @click="handleAdd"
        >
          添加用户
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 用户表格 -->
    <el-table
      :data="paginatedData"
      border
      stripe
      style="width: 100%; margin-top: 20px;"
      empty-text="暂无用户数据"
    >
      <el-table-column
        label="序号"
        type="index"
        width="70"
      ></el-table-column>

      <el-table-column
        label="创建日期"
        prop="date"
        min-width="130"
      ></el-table-column>

      <el-table-column
        label="用户名"
        prop="username"
        min-width="150"
      ></el-table-column>

     <el-table-column label="密码" min-width="150">
  <template slot-scope>
    ******
  </template>
</el-table-column>

      <el-table-column
        label="地区"
        prop="region"
        min-width="120"
      >
        <template slot-scope="scope">
          {{ regionLabel(scope.row.region) }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="180"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>

          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[4, 8, 10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="filteredData.length"
      ></el-pagination>
    </div>

    <!-- 添加或编辑用户弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="480px"
      @closed="resetUserForm"
    >
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="userRules"
        label-width="100px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="userForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="userForm.password"
            type="password"
            show-password
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="创建日期"
          prop="date"
        >
          <el-date-picker
            v-model="userForm.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>

        <el-form-item
          label="地区"
          prop="region"
        >
          <el-select
            v-model="userForm.region"
            placeholder="请选择地区"
            style="width: 100%;"
          >
            <el-option
              label="区域一"
              value="shanghai"
            ></el-option>

            <el-option
              label="区域二"
              value="beijing"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>

        <el-button
          type="primary"
          @click="submitUser"
        >
          确定
        </el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "UserView",

  data() {
    return {
      // 查询条件
      formInline: {
        user: "",
        region: "",
        date: ""
      },

      // 用户数据
      tableData: [
        {
          id: 1,
          date: "2016-05-02",
          username: "王小虎",
          password: "123456",
          region: "shanghai"
        },
        {
          id: 2,
          date: "2016-05-04",
          username: "张三",
          password: "123456",
          region: "beijing"
        },
        {
          id: 3,
          date: "2016-05-01",
          username: "李四",
          password: "123456",
          region: "shanghai"
        },
        {
          id: 4,
          date: "2016-05-03",
          username: "赵六",
          password: "123456",
          region: "beijing"
        }
      ],

      // 分页
      currentPage: 1,
      pageSize: 4,

      // 弹窗
      dialogVisible: false,
      dialogTitle: "添加用户",
      isEdit: false,
      editingId: null,

      // 用户表单
      userForm: {
        username: "",
        password: "",
        date: "",
        region: ""
      },

      // 表单验证规则
      userRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        date: [
          {
            required: true,
            message: "请选择创建日期",
            trigger: "change"
          }
        ],
        region: [
          {
            required: true,
            message: "请选择地区",
            trigger: "change"
          }
        ]
      }
    };
  },

  computed: {
    // 根据条件筛选用户
    filteredData() {
      return this.tableData.filter(item => {
        const usernameMatch =
          !this.formInline.user ||
          item.username
            .toLowerCase()
            .includes(this.formInline.user.trim().toLowerCase());

        const regionMatch =
          !this.formInline.region ||
          item.region === this.formInline.region;

        const dateMatch =
          !this.formInline.date ||
          item.date === this.formInline.date;

        return usernameMatch && regionMatch && dateMatch;
      });
    },

    // 获取当前页数据
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;

      return this.filteredData.slice(
        start,
        start + this.pageSize
      );
    }
  },

  methods: {
    // 查询用户
    onSubmit() {
      this.currentPage = 1;
    },

    // 重置查询条件
    resetSearch() {
      this.formInline = {
        user: "",
        region: "",
        date: ""
      };

      this.currentPage = 1;
    },

    // 地区名称转换
    regionLabel(region) {
      const regionMap = {
        shanghai: "区域一",
        beijing: "区域二"
      };

      return regionMap[region] || region || "-";
    },

    // 打开添加用户弹窗
    handleAdd() {
      this.isEdit = false;
      this.dialogTitle = "添加用户";
      this.editingId = null;

      this.resetUserForm();
      this.dialogVisible = true;
    },

    // 打开编辑用户弹窗
    handleEdit(row) {
      this.isEdit = true;
      this.dialogTitle = "编辑用户";
      this.editingId = row.id;

      this.userForm = {
        username: row.username,
        password: row.password,
        date: row.date,
        region: row.region
      };

      this.dialogVisible = true;
    },

    // 添加或保存用户
    submitUser() {
      this.$refs.userForm.validate(valid => {
        if (!valid) {
          return;
        }

        if (this.isEdit) {
          const index = this.tableData.findIndex(
            item => item.id === this.editingId
          );

          if (index !== -1) {
            this.$set(this.tableData, index, {
              id: this.editingId,
              username: this.userForm.username,
              password: this.userForm.password,
              date: this.userForm.date,
              region: this.userForm.region
            });
          }

          this.$message.success("用户修改成功");
        } else {
          const newId = this.tableData.length
            ? Math.max.apply(
                null,
                this.tableData.map(item => item.id)
              ) + 1
            : 1;

          this.tableData.push({
            id: newId,
            username: this.userForm.username,
            password: this.userForm.password,
            date: this.userForm.date,
            region: this.userForm.region
          });

          this.$message.success("用户添加成功");
        }

        this.dialogVisible = false;
        this.currentPage = 1;
      });
    },

    // 删除用户
    handleDelete(row) {
      this.$confirm(
        "确定要删除用户“" + row.username + "”吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.tableData = this.tableData.filter(
            item => item.id !== row.id
          );

          const maxPage = Math.max(
            1,
            Math.ceil(this.filteredData.length / this.pageSize)
          );

          if (this.currentPage > maxPage) {
            this.currentPage = maxPage;
          }

          this.$message.success("删除成功");
        })
        .catch(() => {});
    },

    // 切换页码
    handleCurrentChange(page) {
      this.currentPage = page;
    },

    // 修改每页条数
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
    },

    // 重置用户表单
    resetUserForm() {
      this.userForm = {
        username: "",
        password: "",
        date: "",
        region: ""
      };

      this.$nextTick(() => {
        if (this.$refs.userForm) {
          this.$refs.userForm.clearValidate();
        }
      });
    }
  }
};
</script>

<style scoped>
.user-view {
  width: 100%;
}

.page-title {
  margin-bottom: 25px;
  font-size: 22px;
  font-weight: bold;
  color: #303133;
}

.search-form {
  padding: 20px 15px 5px;
  background: #f8f9fb;
  border-radius: 4px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>

