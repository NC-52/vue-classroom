<template lang="html">
  <div class="container">
    <el-header class="text-left">
      <h1>{{ pageName || '學生列表' }}</h1>
    </el-header>
    <el-table
      :data="studentData"
      v-loading="loading.list">
      <el-table-column
        v-for="studentKey of studentKeys"
        :label="getAttr(studentKey)"
        align="center"
        sortable
        :key="studentKey.id">
        <template slot-scope="scope">
          <span
            v-if="isEditing.rowIndex !== scope.$index"
            @dblclick="toggleEditing(scope.$index)">
            {{ scope.row[studentKey] }}
          </span>
          <input
            class="input-editing"
            v-else
            type="text"
            @input="$set(editing, studentKey, $event.target.value)"
            :value="students[scope.$index][studentKey]">
        </template>
      </el-table-column>

      <!-- Table action button column, fixed on the right of the table -->
          <el-table-column
            label="動作"
            align="center"
            fixed="right">
            <template slot-scope="scope">
              <!-- Button to edit -->
              <el-button
                v-if="isEditing.rowIndex !== scope.$index"
                @click="toggleEditing(scope.$index)">
                修改
              </el-button>
              <!-- Button for finishing edits -->
              <el-tooltip
                v-else
                class="item"
                effect="light"
                content="要按下「完成」才會儲存"
                placement="bottom">
                <el-button
                  type="success"
                  @click="editStudent(scope.row)">
                  完成
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'
import axios from 'axios'
import { student as StudentRoutes } from '@/api'

export default {
  name: 'StudentList',
  props: {
    pageName: String
  },
  data () {
    return {
      students: [{}],
      attributes: {
        id: '編號',
        class_id: '班級',
        first_name: '名',
        last_name: '姓',
        email: 'email'
      },
      eidting: {},
      isEditing: {
        rowIndex: ''
      },
      loading: {
        list: false,
        update: false
      }
    }
  },

  computed: {
    studentData () {
      return this.students
        .map((student) => {
          let { id, first_name, last_name, class_id, email } = student
          return {
            id, first_name, last_name, class_id, email
          }
        })
    },
    studentKeys () {
      return Object.keys(this.studentData[0])
    }
  },

  methods: {
    ...mapActions('Student', [
      'updateStudent'
    ]),
    loadStudents () {
      Vue.set(this.loading, 'list', true)
      axios.get(StudentRoutes.show())
        .then(({ data }) => {
          this.students = data.data
          Vue.set(this.loading, 'list', false)
        })
        .catch(() => {
          Vue.set(this.loading, 'list', false)
        })
    },
    getAttr (input, attr) {
      attr = attr || this.attributes
      return attr[input] || input
    },
    toggleEditing (rowIndex) {
      this.editing = this.students[rowIndex]
      Vue.set(this.isEditing, 'rowIndex', rowIndex)
    },
    editStudent (rowData) {
      let { $index, id } = rowData
      let { loading, isEditing, students } = this
      Vue.set(this.loading, 'update', true)
      this.updateStudent({
        id,
        payload: students[$index],
        successCallback: () => {
          Vue.set(loading, 'update', false)
          Vue.set(isEditing, 'rowIndex', '')
        },
        errorCallback: () => {
          Vue.set(loading, 'update', false)
          Vue.set(isEditing, 'rowIndex', '')
        }
      })
      // this.students[$index] = this.editing
      // Vue.set(this.isEditing, 'rowIndex', '')
    }
  },
  mounted () {
    this.loadStudents()
  }
}
</script>

<style lang="scss" scoped>
  .input-editing {
    padding: {
      left: 10px;
      right: 5px;
    }
  }
</style>