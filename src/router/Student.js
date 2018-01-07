import Student from '@/components/Student'
import StudentCreate from '@/components/StudentCreate'
import StudentList from '@/components/StudentList'

export default {
  path: '/student',
  name: 'student',
  component: Student,
  redirect: () => '/student/list',
  children: [
    {
      path: 'list',
      name: 'student.list',
      component: StudentList
    },
    {
      path: 'create',
      name: 'student.create',
      component: StudentCreate
    },
    {
      path: '*',
      component: StudentList
    }
  ]
}
