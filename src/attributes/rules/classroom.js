export default {
  name: [
    { required: true, message: '請輸入班級名稱', trigger: 'blur' },
    { min: 1, max: 100, message: '請輸入 1 到 100 個字元', trigger: 'blur' }
  ]
}
