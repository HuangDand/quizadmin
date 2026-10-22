<template>
  <div class="quiz-view">

    <!-- 页面标题 -->
    <div class="page-title">
      题目管理
    </div>

    <!-- 查询区域 -->
    <el-form
      :inline="true"
      :model="searchForm"
      class="search-form"
    >
      <el-form-item label="题目">
        <el-input
          v-model="searchForm.keyword"
          placeholder="请输入题目关键词"
          clearable
          @keyup.enter.native="handleQuizSearch"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleQuizSearch"
        >
          查询题目
        </el-button>

        <el-button
          @click="resetSearch"
        >
          重置
        </el-button>

        <el-button
          type="success"
          icon="el-icon-plus"
          @click="openQuizDialog"
        >
          添加题目
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 题目表格 -->
    <el-table
      :data="paginatedQuizData"
      border
      stripe
      style="width: 100%; margin-top: 20px;"
      empty-text="暂无题目数据"
    >
      <el-table-column
        label="序号"
        type="index"
        width="70"
      ></el-table-column>

      <el-table-column
        label="题目ID"
        prop="id"
        width="90"
      ></el-table-column>

      <el-table-column
        label="问题"
        prop="question"
        min-width="220"
      ></el-table-column>

      <el-table-column
        label="选项"
        min-width="260"
      >
        <template slot-scope="scope">
          <div
            v-for="(option, index) in scope.row.options"
            :key="index"
            class="option-item"
          >
            {{ option.label }}. {{ option.text }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="答案"
        prop="answer"
        width="100"
      ></el-table-column>

      <el-table-column
        label="操作"
        width="160"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="editQuiz(scope.row)"
          >
            编辑
          </el-button>

          <el-button
            size="mini"
            type="danger"
            @click="delQuiz(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="filteredQuizData.length"
      ></el-pagination>
    </div>

    <!-- 添加或编辑题目弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="quizDialogVisible"
      width="600px"
      @closed="resetQuizForm"
    >
      <el-form
        ref="quizForm"
        :model="quizForm"
        :rules="quizRules"
        label-width="100px"
      >
        <el-form-item
          label="问题内容"
          prop="question"
        >
          <el-input
            v-model="quizForm.question"
            placeholder="请输入问题内容"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="选项A"
          prop="optA"
        >
          <el-input
            v-model="quizForm.optA"
            placeholder="请输入选项A"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="选项B"
          prop="optB"
        >
          <el-input
            v-model="quizForm.optB"
            placeholder="请输入选项B"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="选项C"
          prop="optC"
        >
          <el-input
            v-model="quizForm.optC"
            placeholder="请输入选项C"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="选项D"
          prop="optD"
        >
          <el-input
            v-model="quizForm.optD"
            placeholder="请输入选项D"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="正确答案"
          prop="answer"
        >
          <el-select
            v-model="quizForm.answer"
            placeholder="请选择正确答案"
            style="width: 100%;"
          >
            <el-option
              label="A"
              value="A"
            ></el-option>

            <el-option
              label="B"
              value="B"
            ></el-option>

            <el-option
              label="C"
              value="C"
            ></el-option>

            <el-option
              label="D"
              value="D"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="quizDialogVisible = false">
          取消
        </el-button>

        <el-button
          type="primary"
          @click="submitQuiz"
        >
          确定
        </el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "QuizView",

  data() {
    return {
      // 查询条件
      searchForm: {
        keyword: ""
      },

      // 题目列表
      quizTableData: [
        {
          id: 1,
          question: "法国的首都是什么？",
          options: [
            { label: "A", text: "巴黎" },
            { label: "B", text: "伦敦" },
            { label: "C", text: "罗马" },
            { label: "D", text: "柏林" }
          ],
          answer: "A"
        },
        {
          id: 2,
          question: "中国的首都是什么？",
          options: [
            { label: "A", text: "上海" },
            { label: "B", text: "北京" },
            { label: "C", text: "广州" },
            { label: "D", text: "深圳" }
          ],
          answer: "B"
        },
        {
          id: 3,
          question: "1 + 1 等于多少？",
          options: [
            { label: "A", text: "1" },
            { label: "B", text: "3" },
            { label: "C", text: "2" },
            { label: "D", text: "4" }
          ],
          answer: "C"
        },
        {
          id: 4,
          question: "太阳从哪个方向升起？",
          options: [
            { label: "A", text: "西方" },
            { label: "B", text: "北方" },
            { label: "C", text: "南方" },
            { label: "D", text: "东方" }
          ],
          answer: "D"
        },
        {
          id: 5,
          question: "一年有多少个月？",
          options: [
            { label: "A", text: "10个月" },
            { label: "B", text: "11个月" },
            { label: "C", text: "12个月" },
            { label: "D", text: "13个月" }
          ],
          answer: "C"
        }
      ],

      // 分页
      currentPage: 1,
      pageSize: 5,

      // 弹窗
      quizDialogVisible: false,
      dialogTitle: "添加题目",
      isEdit: false,
      editingId: null,

      // 题目表单
      quizForm: {
        question: "",
        optA: "",
        optB: "",
        optC: "",
        optD: "",
        answer: ""
      },

      // 表单验证
      quizRules: {
        question: [
          {
            required: true,
            message: "请输入问题内容",
            trigger: "blur"
          }
        ],
        optA: [
          {
            required: true,
            message: "请输入选项A",
            trigger: "blur"
          }
        ],
        optB: [
          {
            required: true,
            message: "请输入选项B",
            trigger: "blur"
          }
        ],
        optC: [
          {
            required: true,
            message: "请输入选项C",
            trigger: "blur"
          }
        ],
        optD: [
          {
            required: true,
            message: "请输入选项D",
            trigger: "blur"
          }
        ],
        answer: [
          {
            required: true,
            message: "请选择正确答案",
            trigger: "change"
          }
        ]
      }
    };
  },

  computed: {
    // 根据关键词筛选题目
    filteredQuizData() {
      const keyword = this.searchForm.keyword
        .trim()
        .toLowerCase();

      if (!keyword) {
        return this.quizTableData;
      }

      return this.quizTableData.filter(item => {
        const questionMatch = item.question
          .toLowerCase()
          .includes(keyword);

        const optionMatch = item.options.some(option =>
          option.text.toLowerCase().includes(keyword)
        );

        return questionMatch || optionMatch;
      });
    },

    // 当前页显示的数据
    paginatedQuizData() {
      const start = (this.currentPage - 1) * this.pageSize;

      return this.filteredQuizData.slice(
        start,
        start + this.pageSize
      );
    }
  },

  methods: {
    // 查询题目
    handleQuizSearch() {
      this.currentPage = 1;
    },

    // 重置查询
    resetSearch() {
      this.searchForm.keyword = "";
      this.currentPage = 1;
    },

    // 打开添加题目弹窗
    openQuizDialog() {
      this.isEdit = false;
      this.dialogTitle = "添加题目";
      this.editingId = null;

      this.resetQuizForm();
      this.quizDialogVisible = true;
    },

    // 编辑题目
    editQuiz(row) {
      this.isEdit = true;
      this.dialogTitle = "编辑题目";
      this.editingId = row.id;

      this.quizForm = {
        question: row.question,
        optA: row.options[0].text,
        optB: row.options[1].text,
        optC: row.options[2].text,
        optD: row.options[3].text,
        answer: row.answer
      };

      this.quizDialogVisible = true;
    },

    // 添加或保存题目
    submitQuiz() {
      this.$refs.quizForm.validate(valid => {
        if (!valid) {
          return;
        }

        const options = [
          {
            label: "A",
            text: this.quizForm.optA
          },
          {
            label: "B",
            text: this.quizForm.optB
          },
          {
            label: "C",
            text: this.quizForm.optC
          },
          {
            label: "D",
            text: this.quizForm.optD
          }
        ];

        if (this.isEdit) {
          const index = this.quizTableData.findIndex(
            item => item.id === this.editingId
          );

          if (index !== -1) {
            this.$set(this.quizTableData, index, {
              id: this.editingId,
              question: this.quizForm.question,
              options: options,
              answer: this.quizForm.answer
            });
          }

          this.$message.success("题目修改成功");
        } else {
          const newId = this.quizTableData.length
            ? Math.max.apply(
                null,
                this.quizTableData.map(item => item.id)
              ) + 1
            : 1;

          this.quizTableData.push({
            id: newId,
            question: this.quizForm.question,
            options: options,
            answer: this.quizForm.answer
          });

          this.$message.success("题目添加成功");
        }

        this.quizDialogVisible = false;
        this.currentPage = 1;
      });
    },

    // 删除题目
    delQuiz(row) {
      this.$confirm(
        "确定要删除这道题目吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.quizTableData = this.quizTableData.filter(
            item => item.id !== row.id
          );

          const maxPage = Math.max(
            1,
            Math.ceil(
              this.filteredQuizData.length / this.pageSize
            )
          );

          if (this.currentPage > maxPage) {
            this.currentPage = maxPage;
          }

          this.$message.success("题目删除成功");
        })
        .catch(() => {});
    },

    // 修改每页显示数量
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
    },

    // 切换页码
    handleCurrentChange(page) {
      this.currentPage = page;
    },

    // 重置题目表单
    resetQuizForm() {
      this.quizForm = {
        question: "",
        optA: "",
        optB: "",
        optC: "",
        optD: "",
        answer: ""
      };

      this.$nextTick(() => {
        if (this.$refs.quizForm) {
          this.$refs.quizForm.clearValidate();
        }
      });
    }
  }
};
</script>

<style scoped>
.quiz-view {
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

.option-item {
  line-height: 24px;
  white-space: normal;
  word-break: break-all;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>