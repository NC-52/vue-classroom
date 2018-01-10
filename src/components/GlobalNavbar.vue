<template lang="html">
  <el-header id="global-navbar" class="card-shadow-xs">
    <el-container class="global-navbar-container container">
      <div class="logo-wrapper hidden-xs">
        <router-link
          class="logo-container"
          :to="{ name: 'homepage' }">
          <figure class="logo">
            <img src="https://png.icons8.com/ios/540/finn.png" class="logo-img" alt="">
          </figure>
          <figure class="hi">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc40S0ZeCHpQGVJO3PRQCG753Fhnl498Sim2D8J6bgL7rCJ22F" alt="">
          </figure>
        </router-link>
        <el-checkbox class="checkbox-beta" v-model="isBeta">
          {{ isBeta ? 'beta' : '' }}
        </el-checkbox>
      </div>
      <el-row>
        <ul class="list">
          <li class="list-item">
            <el-autocomplete
              v-model="keyword"
              :fetch-suggestions="querySearchAsync"
              placeholder="請輸入關鍵字"
              @select="handleSelect"
            ></el-autocomplete>
          </li>
          <li class="list-item">
            <el-dropdown>
              <span class="el-dropdown-link">
                班級<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <router-link
                  :to="{ name: 'classroom.show', params: { classId: $key } }"
                  v-for="(classroom, $key) in classroomMap"
                  :key="classroom.id">
                  <el-dropdown-item>
                    {{ classroom }}
                  </el-dropdown-item>
                </router-link>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li class="list-item" v-if="isBeta">
            <router-link :to="{ name: 'student.list' }">
              學生列表
            </router-link>
          </li>
          <li class="list-item" v-if="isBeta">
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
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { cookie } from '@/helper'

export default {
  name: 'GlobalNavbar',
  data () {
    let isBetaCookieName = 'isBeta'

    return {
      keyword: '',
      isBeta: cookie.read(isBetaCookieName) === 'true',
      isBetaCookieName
    }
  },

  computed: {
    ...mapState('Classroom', [
      'loading', 'classrooms'
    ]),

    ...mapState('Search', {
      searchRawResults: (state) => state.rawResult,
      searchTimeout: (state) => state.timeout
    }),

    ...mapGetters('Classroom', [
      'classroomMap'
    ]),

    ...mapGetters('Search', {
      searchResult: 'result'
    })
  },

  methods: {
    ...mapActions('Classroom', [
      'loadClassrooms'
    ]),

    ...mapActions('Search', [
      'search'
    ]),

    ...mapMutations('Search', [
      'setRawResult', 'setKeyword', 'setSearchTimeout'
    ]),

    querySearchAsync (keyword, showResult) {
      this.search()

      clearTimeout(this.searchTimeout)

      this.setSearchTimeout(
        setTimeout(_ => {
          showResult(this.searchResult)
        }, 1000)
      )
    },

    handleSelect (item) {
      let res = {
        name: 'classroom.show'
      }

      switch (item.role) {
        case 'students':
          res.params = { classId: item.data.class_id }
          res.query = { student: item.data.id }
          break

        case 'classrooms':
          res.params = { classId: item.data.id }
          this.$message({
            message: `前往 ${item.value}`,
            type: 'success'
          })
          break

        default:
          this.$message(item.name)
          return
      }

      this.$router.push(res)
    }
  },

  watch: {
    keyword (newKeyword) {
      this.setKeyword(newKeyword)
    },
    isBeta (val) {
      cookie.write(this.isBetaCookieName, val, 1)
    }
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

  .logo {
    height: inherit;

    // .logo-container
    &-container {
      height: 50px;
    }

    // .logo-wrapper
    &-wrapper {
      position: absolute;
      display: flex;
      align-items: center;
      left: 50px;
      height: 50px;

      @media screen and (max-width: 600px) {
        display: none;
      }
    }

    // .logo-img
    &-img {
      height: 100%;
    }
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

  .hi {
    position: absolute;
    top: -7px;
    left: 48px;
    width: 30px;

    img {
      width: inherit;
    }
  }

  .checkbox-beta {
    margin-left: 40px;
  }
</style>
