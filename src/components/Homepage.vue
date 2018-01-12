<template>
  <div class="container" v-loading="classroomLoading.classrooms">
    <el-table :data="classrooms" class="classroom-table" empty-text="查無資料">
      <el-table-column
        prop="name"
        label="名稱"
      ></el-table-column>
      <el-table-column
        label="前往班級"
        align="center"
        fixed="right">
        <template slot-scope="scope">
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
    ...mapState('Classroom', {
      classrooms: (state) => state.classrooms,
      classroomLoading: (state) => state.loading
    })
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
