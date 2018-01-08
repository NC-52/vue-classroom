<template lang="html">
  <el-container class="container">
    <el-row class="row">
      <el-header>
        <div>
          <span class="page-title">
            {{ classroomName }}
          </span>
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

      <div class="container" v-loading="loading.list">
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

      <div class="pie-chart-wrapper">
        <canvas ref="chart"></canvas>
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
              v-loading="loading.editClassroom"
              v-if="loading.editClassroom">
              <span>處理中...</span>
            </el-button>
            <el-button type="primary"
              @click="editClassroom"
              v-if="!loading.editClassroom">
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
                  <el-button type="primary" @click="submitStudentForm('studentForm')" v-loading="loading.editStudent">
                    <span v-if="loading.editStudent">處理中...</span>
                    <span v-if="!loading.editStudent">{{ studentFormTitle }}</span>
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-container>
        </div>
      </el-dialog>
    </el-row>
  </el-container>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import Chart from 'chart.js'
import { student as StudentAttr } from '@/attributes'
import StudentList from '@/components/StudentList'
import { student as StudentRoutes, classroom as ClassroomRoutes } from '@/api'

export default {
  components: {
    StudentList
  },
  props: {
    classId: String
  },
  data () {
    return {
      isNewStudent: false,
      isNewClassroom: false,
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
      students: [],
      rules: {
        first_name: [
          { required: true, message: '請輸入學生名字', trigger: 'blur' },
          { min: 1, max: 100, message: '請輸入 1 到 100 個字元', trigger: 'blur' }
        ],
        last_name: [
          { required: true, message: '請輸入學生姓氏', trigger: 'blur' },
          { min: 1, max: 100, message: '請輸入 1 到 100 個字元', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '請輸入 Email', trigger: 'blur' },
          { type: 'email', message: '請輸入正確 Email', trigger: 'blur,change' }
        ],
        class_id: [
          { required: true, message: '請選擇班級', trigger: 'blur' }
        ]
      },
      loading: {
        editStudent: false,
        editClassroom: false,
        deleteClassroom: false
      }
    }
  },

  computed: {
    ...mapState('Classroom', [
      'classrooms'
    ]),
    ...mapGetters('Classroom', [
      'classroomMap'
    ]),

    classroomName () {
      return this.classroomMap[this.classId] || '...'
    },

    studentFormTitle () {
      let pre = this.isNewStudent ? '新增' : '修改'
      return `${pre}學生`
    },

    classroomFormTitle () {
      let pre = this.isNewClassroom ? '新增' : '修改'
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
    }
  },
  methods: {
    ...mapActions('Classroom', [
      'loadClassrooms'
    ]),
    openStudentForm ({ isNew, student }) {
      this.isNewStudent = isNew || false

      if (isNew) {
        this.studentForm = {}
      } else {
        this.studentForm = student
      }

      Vue.set(this.dialogVisible, 'student', true)
    },

    loadStudents () {
      Vue.set(this.loading, 'list', true)

      let apiRoute = ClassroomRoutes.show(this.classId)
      axios.get(apiRoute)
        .then(({ data }) => {
          this.students = data.data
          // this.classroomName = data.classroomName
          Vue.set(this.loading, 'list', false)
        })
        .catch(() => {
          Vue.set(this.loading, 'list', false)
        })
    },

    getAttr (input, attr) {
      attr = attr || this.studnetAttributes
      return attr[input] || input
    },

    submitStudentForm (formName) {
      if (this.loading.editStudent) return

      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isNewStudent) {
            this.createStudent()
          } else {
            this.updateStudent()
          }
        } else {
          return false
        }
      })
    },

    createStudent () {
      let payload = this.studentForm
      let apiRoute = StudentRoutes.create()

      Vue.set(this.loading, 'editStudent', true)

      axios.post(apiRoute, payload)
        .then(() => {
          this.$message.success('成功新增學生', '成功')

          if (payload.class_id === this.classId) {
            this.loadStudents()
          } else {
            this.$router.push({ name: 'classroom.show', params: { classId: payload.class_id } })
          }

          Vue.set(this.dialogVisible, 'student', false)
          Vue.set(this.loading, 'editStudent', false)
        })
        .catch(({ message }) => {
          this.$message.error(message.data, '失敗')
          Vue.set(this.dialogVisible, 'student', false)
          Vue.set(this.loading, 'editStudent', false)
        })
    },

    updateStudent () {
      let payload = this.studentForm
      let apiRoute = StudentRoutes.update(payload.id)

      Vue.set(this.loading, 'editStudent', true)

      axios.put(apiRoute, payload)
        .then(() => {
          this.$message.success('成功更新學生', '成功')

          if (payload.class_id === this.classId) {
            this.loadStudents()
          } else {
            this.$router.push({ name: 'classroom.show', params: { classId: payload.class_id } })
          }

          Vue.set(this.dialogVisible, 'student', false)
          Vue.set(this.loading, 'editStudent', false)
        })
        .catch(({ message }) => {
          this.$message.error(message.data, '更新學生失敗')
          Vue.set(this.dialogVisible, 'student', false)
          Vue.set(this.loading, 'editStudent', false)
        })
    },

    openClassroomForm ({ isNew }) {
      this.isNewClassroom = isNew || false
      this.classroomForm = isNew
        ? {}
        : this.classroomFormProp

      Vue.set(this.dialogVisible, 'classroom', true)
    },

    editClassroom () {
      if (this.isNewClassroom) {
        this.createClassroom()
        // this.$router.push({ name: 'classrom.show', params: { id:  }})
      } else {
        this.updateClassroom()
      }
    },

    createClassroom () {
      Vue.set(this.loading, 'editClassroom', true)

      let apiRoute = ClassroomRoutes.create()
      let payload = this.classroomForm

      axios.post(apiRoute, payload)
        .then(({ data }) => {
          this.$message.success('創建教室成功！')
          this.$router.push({ name: 'classroom.show', params: { classId: data.class_id } })
          Vue.set(this.dialogVisible, 'classroom', false)
          Vue.set(this.loading, 'editClassroom', false)
        })
        .catch(_ => {
          this.$message.error('創建教室失敗')
          Vue.set(this.loading, 'editClassroom', false)
        })
    },

    updateClassroom () {
      Vue.set(this.loading, 'editClassroom', true)

      let apiRoute = ClassroomRoutes.update(this.classId)
      let payload = this.classroomForm

      axios.put(apiRoute, payload)
        .then(_ => {
          this.$message({
            message: '更新教室成功！',
            type: 'success'
          })
          this.loadStudents()
          this.loadClassrooms()
          Vue.set(this.dialogVisible, 'classroom', false)
          Vue.set(this.loading, 'editClassroom', false)
        })
        .catch(_ => {
          this.$message.error('更新教室失敗')
          Vue.set(this.loading, 'editClassroom', false)
        })
    },

    createPie () {
      new Chart(this.$ref.chart.getContext('2d'), {
        type: 'pie',
        data: {
          dataset: this.students.map(s => s.name)
        }
      })
    }
  },

  watch: {
    classId () {
      this.loadClassrooms()
      this.loadStudents()
    }
  },

  mounted () {
    this.loadStudents()
    this.createPie()
  }
}
</script>

<style lang="scss" scoped>
.page-title {
  font-size: 28px;
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
</style>