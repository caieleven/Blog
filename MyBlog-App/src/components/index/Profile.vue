<template>
  <div>
    <!-- 头像 -->
    <div class="avatar">
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">你好啊！<br>只是我的博客</div>
        <el-avatar :size="20" fit="contain">
          <img :src="profile.avatar" alt="">
        </el-avatar>
      </el-tooltip>
    </div>
    <!-- 简介 -->
    <div class="introduction">
      <!--      <p>{{ profile.nickname }}</p>-->
      <p>夏季实训小组</p>
    </div>
    <!-- 社交 -->
    <div class="social">
      <a v-for="(scl,index) in social" :key="index" target="_blank" :href="scl.link">
        <el-avatar :src="scl.icon" fit="cover" :title="scl.name">
          {{ scl.name }}
        </el-avatar>
      </a>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'Profile',
  data() {
    return {
      social: [
        {
          name: 'GitHub',
          link: 'https://github.com/caieleven',
          icon: 'https://ico.hnysnet.com/get.php?url=https://github.com'
        },
        {
          name: 'Gitee',
          link: 'https://gitee.com/caieleven',
          icon: 'https://ico.hnysnet.com/get.php?url=https://gitee.com'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['profile'])
  }
}
</script>

<style scoped lang="scss">
.avatar {
  text-align: center;
}

.introduction {
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.75rem;
}

.social {
  text-align: center;
  margin-top: 1.2rem;

  a {
    margin-right: 7px;
  }
}
</style>
<style lang="scss">
.el-avatar {
  background: none;
}
</style>

