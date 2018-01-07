<template lang="html">
  <div>
    <el-container class="container">
      <div class="student-create-form">
        <el-form :model="studentForm" :rules="rules" ref="studentForm" label-width="120px">
          <el-form-item label="姓氏" prop="last_name">
            <el-input v-model="studentForm.last_name"></el-input>
          </el-form-item>
          <el-form-item label="名字" prop="first_name">
            <el-input v-model="studentForm.first_name"></el-input>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="studentForm.email"></el-input>
          </el-form-item>
          <el-form-item label="班級" prop="class_id">
            <el-select v-model="studentForm.class_id" placeholder="請選擇">
              <el-option label="一班" value="1"></el-option>
              <el-option label="二班" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('studentForm')" v-loading="loading.create">
              <span v-if="loading.create">處理中...</span>
              <span v-if="!loading.create">新增學生</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-container>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import { student as StudentRoutes } from '@/api'

export default {
  data () {
    return {
      studentForm: {
        first_name: '',
        last_name: '',
        email: '',
        class_id: ''
      },
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
        create: false,
        update: false
      }
    }
  },

  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createUser()
        } else {
          return false
        }
      })
    },

    createUser () {
      let payload = this.studentForm
      let apiRoute = StudentRoutes.create()

      Vue.set(this.loading, 'create', true)
      axios.post(apiRoute, payload)
        .then(() => {
          this.$alert('成功新增學生', '成功')
          Vue.set(this.loading, 'create', false)
        })
        .catch(({ message }) => {
          this.$alert(message.data, '失敗')
          Vue.set(this.loading, 'create', false)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .student-create-form {
    width: 600px;
  }

  .el-form-item__error {
    padding: 0;
  }
</style>