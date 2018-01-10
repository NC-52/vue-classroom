<template>
  <div class="container">
    <el-table :data="classrooms" class="classroom-table">
      <el-table-column
        prop="name"
        label="名稱"
      ></el-table-column>
      <el-table-column
        label="前往班級"
        align="center"
        fixed="right">
        <template slot-scope="scope">
          <!-- Button to edit -->
          <el-button
            @click="goToClassroom(scope.row)">
            前往
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Homepage',
  data () {
    return {}
  },
  computed: {
    ...mapState('Classroom', [
      'classrooms'
    ]),

    classroomKeys () {
      return Object.keys(this.classrooms)
    }
  },
  methods: {
    goToClassroom ({ id }) {
      this.$router.push({
        name: 'classroom.show',
        params: {
          classId: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
}
.classroom-table {
  max-width: 600px;
}
</style>
