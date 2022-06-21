<template>
  <div>
    <el-form ref="profileForm" label-position="top" :model="user" size="small">
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="user.username" />
      </el-form-item>
      <el-form-item label="昵称：" prop="nickname">
        <el-input v-model="user.nickname" />
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="user.email" type="email" />
      </el-form-item>
      <el-form-item label="个人描述：" prop="description">
        <el-input v-model="user.description" :rows="5" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateProfile">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateProfile } from '@/api/user'
import { deepClone } from '@/utils'

export default {
  name: 'RProfile',
  data() {
    return {
      user: {}
    }
  },
  created() {
    this.user = deepClone(this.$store.getters.user)
  },
  methods: {
    updateProfile() {
      const user = { ...this.user }
      delete user.avatar
      updateProfile(user).then(resp => {
        this.$message.success(resp.message)
        this.$store.dispatch('user/setInfo', resp.data)
      })
    }
  }
}
</script>

<style lang="scss">

</style>
