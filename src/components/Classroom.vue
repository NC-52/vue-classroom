<template lang="html">
  <div class="container">
    <el-row>
      <el-header class="header-classroom">
        <h1 class="page-title">
          {{ classroomName }}
        </h1>
        <div>
          <el-button type="primary" icon="el-icon-edit" @click="openClassroomForm({isNew: false})">
            編輯
          </el-button>
          <el-button @click="openStudentForm({isNew: true})">
            新增學生
          </el-button>
          <el-button @click="openClassroomForm({isNew: true})">
            新增班級
          </el-button>
        </div>
      </el-header>

      <div class="container" v-loading="classroomLoading.studentList">
        <el-table
          :data="students"
          empty-text="查無資料">
          <el-table-column
            v-for="studentKey of studentKeys"
            :prop="studentKey"
            :label="getAttr(studentKey)"
            align="center"
            sortable
            :key="studentKey.id">
          </el-table-column>

          <!-- Table action button column, fixed on the right of the table -->
          <el-table-column
            label="動作"
            align="center"
            fixed="right">
            <template slot-scope="scope">
              <!-- Button to edit -->
              <el-button
                @click="openStudentForm({isNew: false, student: scope.row})">
                修改
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog
        :title="classroomFormTitle"
        :visible.sync="dialogVisible.classroom">
        <el-form :model="classroomForm" ref="classroomForm" label-width="100px">
          <el-form-item label="班級名稱" prop="name">
            <el-input v-model="classroomForm.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              v-loading="classroomLoading.edit"
              v-if="classroomLoading.edit">
              <span>處理中...</span>
            </el-button>
            <el-button type="primary"
              @click="editClassroom"
              v-if="!classroomLoading.edit">
              <span>{{ classroomFormTitle }}</span>
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog
        :title="studentFormTitle"
        :visible.sync="dialogVisible.student">
        <div>
          <el-container class="container">
            <div class="student-create-form">
              <el-form :model="studentForm" :rules="rules" ref="studentForm" label-width="100px">
                <el-form-item label="名字" prop="first_name">
                  <el-input v-model="studentForm.first_name"></el-input>
                </el-form-item>
                <el-form-item label="姓氏" prop="last_name">
                  <el-input v-model="studentForm.last_name"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                  <el-input v-model="studentForm.email"></el-input>
                </el-form-item>
                <el-form-item label="班級" prop="class_id">
                  <el-select v-model="studentForm.class_id" placeholder="請選擇">
                    <el-option
                      :label="classroom"
                      :value="$key"
                      v-for="(classroom, $key) in classroomMap"
                      :key="classroom.id" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitStudentForm('studentForm')" v-loading="studentLoading.edit">
                    <span v-if="studentLoading.edit">處理中...</span>
                    <span v-if="!studentLoading.edit">{{ studentFormTitle }}</span>
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-container>
        </div>
      </el-dialog>
    </el-row>

    <el-row class="mt-lg">
      <el-col :span="24">
        <el-header>
          <h1 class="page-title">學生分析</h1>
        </el-header>
      </el-col>
      <el-col :span="12">
        <div class="pie-chart-wrapper">
          <ChartPie :pie-config="pieConfig" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="analysis">
          總共: {{ students.length }}位學生
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters, mapActions } from 'vuex'
import { student as StudentAttr, color as colors } from '@/attributes'
import studentRules from '@/attributes/rules/student'
import ChartPie from '@/components/chart/pie'

export default {
  components: {
    ChartPie
  },
  props: {
    classId: [Number, String]
  },
  data () {
    return {
      isNew: {
        student: false,
        classroom: false
      },
      dialogVisible: {
        student: false,
        classroom: false
      },
      classroomForm: {},
      studnetAttributes: StudentAttr,
      studentForm: {
        first_name: '',
        last_name: '',
        email: '',
        class_id: ''
      },
      rules: studentRules
    }
  },

  computed: {
    ...mapState('Classroom', {
      classrooms: (state) => state.classrooms,
      classroomLoading: (state) => state.loading,
      students: (state) => state.students
    }),

    ...mapState('Student', {
      studentLoading: (state) => state.loading
    }),

    ...mapGetters('Classroom', [
      'classroomMap'
    ]),

    classroomName () {
      return this.classroomMap[this.classId] || '...'
    },

    studentFormTitle () {
      let pre = this.isNew.student ? '新增' : '修改'
      return `${pre}學生`
    },

    classroomFormTitle () {
      let pre = this.isNew.classroom ? '新增' : '修改'
      return `${pre}班級`
    },

    studentKeys () {
      return Object.keys(this.studnetAttributes)
    },

    studentData () {
      return this.students
        .map(student => {
          return {
            ...student,
            classroom: this.getAttr(student.class_id, this.classroomMap)
          }
        })
    },

    classroomFormProp () {
      let currentClassId = this.classId
      return {
        class_id: currentClassId,
        name: this.classroomMap[currentClassId]
      }
    },

    pieConfig () {
      return {
        type: 'pie',
        data: {
          datasets: [
            {
              data: this.students.map(s => 1),
              backgroundColor: colors.main
            }
          ],
          labels: this.students.map(s => `${s.first_name} ${s.last_name}`)
        },
        options: {
          responsive: true,
          legend: {
            display: false
          },
          title: {
            display: false
          }
        }
      }
    }
  },
  methods: {
    ...mapActions('Classroom', [
      'loadClassrooms', 'createClassroom', 'updateClassroom', 'loadClassStudents'
    ]),

    ...mapActions('Student', [
      'createStudent', 'updateStudent', 'showStudent'
    ]),

    openStudentForm ({ isNew, student }) {
      Vue.set(this.isNew, 'student', isNew || false)

      if (isNew) {
        this.studentForm = {}
      } else {
        this.studentForm = student
      }

      Vue.set(this.dialogVisible, 'student', true)
    },

    handleLoadClassStudents () {
      this.loadClassStudents(this.classId)
    },

    getAttr (input, attr) {
      attr = attr || this.studnetAttributes
      return attr[input] || input
    },

    submitStudentForm (formName) {
      if (this.studentLoading.edit) return

      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isNew.student) {
            this.handleCreateStudent()
          } else {
            this.handleUpdateStudent()
          }
        } else {
          return false
        }
      })
    },

    handleCreateStudent () {
      let payload = this.studentForm
      let successCallback = (data) => {
        this.$message.success('成功新增學生', '成功')
        if (payload.class_id === this.classId) {
          this.handleLoadClassStudents()
        } else {
          this.handleLoadClassStudents()
          this.$router.push({ name: 'classroom.show', params: { classId: payload.class_id } })
        }
        Vue.set(this.dialogVisible, 'student', false)
      }
      let errorCallback = () => {
        this.$message.error('新增學生失敗', '失敗')
        Vue.set(this.dialogVisible, 'student', false)
      }

      this.createStudent({ payload, successCallback, errorCallback })
    },

    handleUpdateStudent () {
      let payload = this.studentForm
      let successCallback = (data) => {
        this.$message.success('成功更新學生', '成功')
        if (payload.class_id === this.classId) {
          this.handleLoadClassStudents()
        } else {
          this.$router.push({ name: 'classroom.show', params: { classId: payload.class_id } })
        }
        Vue.set(this.dialogVisible, 'student', false)
      }
      let errorCallback = () => {
        this.$message.error('更新學生失敗', '失敗')
        Vue.set(this.dialogVisible, 'student', false)
      }

      this.updateStudent({ payload, successCallback, errorCallback })
    },

    openClassroomForm ({ isNew }) {
      Vue.set(this.isNew, 'classroom', isNew || false)
      this.classroomForm = isNew
        ? {}
        : this.classroomFormProp

      Vue.set(this.dialogVisible, 'classroom', true)
    },

    editClassroom () {
      if (this.isNew.classroom) {
        this.handleCreateClassroom()
      } else {
        this.handleUpdateClassroom()
      }
    },

    handleCreateClassroom () {
      let payload = this.classroomForm

      let successCallback = (data) => {
        this.$message.success('創建班級成功！')
        this.$router.push({ name: 'classroom.show', params: { classId: data.class_id } })
        Vue.set(this.dialogVisible, 'classroom', false)
      }
      let errorCallback = () => {
        this.$message.error('創建班級失敗')
      }

      this.createClassroom({ payload, successCallback, errorCallback })
    },

    handleUpdateClassroom () {
      let payload = { ...this.classroomForm, id: this.classId }
      let successCallback = () => {
        this.$message({
          message: '更新班級成功！',
          type: 'success'
        })
        this.handleLoadClassStudents()
        this.loadClassrooms()
        Vue.set(this.dialogVisible, 'classroom', false)
      }
      let errorCallback = () => {
        this.$message.error('更新班級失敗')
      }

      this.updateClassroom({ payload, successCallback, errorCallback })
    },

    handleQueryString (studentId) {
      if (studentId) {
        let successCallback = (data) => {
          this.openStudentForm({ isNew: false, student: data.data })
        }
        let errorCallback = (response) => {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
        this.showStudent({ id: studentId, successCallback, errorCallback })
      }
    }
  },

  watch: {
    classId () {
      this.loadClassrooms()
      this.handleLoadClassStudents()
    }
  },

  beforeRouteUpdate (to, from, next) {
    let studentId = to.query.student

    if (studentId) {
      this.handleQueryString(studentId)
    }

    next()
  },

  mounted () {
    this.handleLoadClassStudents()
    this.handleQueryString(
      this.$route.query.student
    )
  }
}
</script>

<style lang="scss" scoped>
.page-title {
  display: inline;
  font-size: 28px;
  vertical-align: middle;
  margin-right: 15px;
  margin-bottom: 0;
}

.header-classroom {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 80px;

  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
}

.student-create-form {
  width: 100%;
}

@media screen and (max-width: 768px) {
  .el-dialog {
    width: calc(100vw - 20px);
  }
}

.position-right {
  position: absolute;
  top: 0;
  right: 0;
}

.pie-chart-wrapper {
  width: 600px;
}

.analysis {
  display: flex;
  align-items: flex-end;
}
</style>