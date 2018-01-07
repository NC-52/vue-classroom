<template lang="html">
  <el-header id="global-navbar" class="card-shadow-xs">
    <el-container class="global-navbar-container container">
      <el-row>
        <ul class="list">
          <li class="list-item">
            <el-autocomplete
              v-model="state4"
              :fetch-suggestions="querySearchAsync"
              placeholder="Please input"
              @select="handleSelect"
              v-if="0"
            ></el-autocomplete>
          </li>
          <li class="list-item">
            <el-dropdown>
              <span class="el-dropdown-link">
                教室<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(classroom, $key) in classroomMap"
                  :key="classroom.id">
                  <router-link :to="{ name: 'classroom.show', params: { classId: $key } }">
                    {{ classroom }}
                  </router-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li class="list-item">
            <router-link :to="{ name: 'student.list' }">
              學生列表
            </router-link>
          </li>
          <li class="list-item">
            <router-link :to="{ name: 'student.create' }">
              新增學生
            </router-link>
          </li>
        </ul>
      </el-row>
    </el-container>
  </el-header>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'GlobalNavbar',
  data () {
    return {}
  },
  computed: {
    ...mapState('Classroom', [
      'loading', 'classrooms'
    ]),
    ...mapGetters('Classroom', [
      'classroomMap'
    ])
  },
  methods: {
    ...mapActions('Classroom', [
      'loadClassrooms'
    ])
  },
  mounted () {
    this.loadClassrooms()
  }
}
</script>

<style lang="scss" scoped>
  #global-navbar {
    position: fixed;
    display: flex;
    align-items: center;
    top: 0;
    left: 0;
    margin-bottom: 20px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.87);
    z-index: 500;
  }

  .global-navbar-container {
    display: flex;
    justify-content: center;
    padding-top: 20px;
  }

  .list {
    display: flex;

    // .list-item
    &-item {
      display: inline-flex;
      align-items: center;
      padding: 0 10px;
    }
  }

  .el-dropdown-link {
    font-size: 16px;
  }
</style>
