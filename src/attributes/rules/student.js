export default {
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
}
