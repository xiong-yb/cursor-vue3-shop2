<template>
  <div class="profile-page">
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="profile-sidebar">
            <div class="user-info">
              <el-avatar :size="80" :src="userInfo.avatar" />
              <h3>{{ userInfo.username }}</h3>
              <p class="email">{{ userInfo.email }}</p>
            </div>
            <el-menu
              :default-active="activeMenu"
              class="profile-menu"
              @select="handleMenuSelect"
            >
              <el-menu-item index="basic">
                <el-icon><user /></el-icon>
                <span>基本信息</span>
              </el-menu-item>
              <el-menu-item index="security">
                <el-icon><lock /></el-icon>
                <span>账号安全</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="profile-content">
            <!-- 基本信息 -->
            <div v-if="activeMenu === 'basic'" class="content-section">
              <h2>基本信息</h2>
              <el-form
                ref="basicFormRef"
                :model="basicForm"
                :rules="basicRules"
                label-width="100px"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="basicForm.username" />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="userInfo.email" disabled />
                </el-form-item>
                <el-form-item label="头像">
                  <el-upload
                    class="avatar-uploader"
                    action="/api/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="basicForm.avatar" :src="basicForm.avatar" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
                  </el-upload>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleBasicSubmit" :loading="basicLoading">
                    保存修改
                  </el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- 账号安全 -->
            <div v-if="activeMenu === 'security'" class="content-section">
              <h2>账号安全</h2>
              <el-form
                ref="passwordFormRef"
                :model="passwordForm"
                :rules="passwordRules"
                label-width="100px"
              >
                <el-form-item label="当前密码" prop="currentPassword">
                  <el-input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    show-password
                  />
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input
                    v-model="passwordForm.newPassword"
                    type="password"
                    show-password
                  />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    show-password
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handlePasswordSubmit" :loading="passwordLoading">
                    修改密码
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Lock, Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

// 用户信息
const userInfo = reactive({
  username: '测试用户',
  email: 'test@example.com',
  avatar: ''
})

// 菜单激活状态
const activeMenu = ref('basic')

// 基本信息表单
const basicFormRef = ref<FormInstance>()
const basicLoading = ref(false)
const basicForm = reactive({
  username: userInfo.username,
  avatar: userInfo.avatar
})

const basicRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ]
}

// 密码修改表单
const passwordFormRef = ref<FormInstance>()
const passwordLoading = ref(false)
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules: FormRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 处理菜单选择
const handleMenuSelect = (key: string) => {
  activeMenu.value = key
}

// 处理头像上传
const handleAvatarSuccess = (response: any) => {
  basicForm.avatar = response.url
}

const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

// 提交基本信息
const handleBasicSubmit = async () => {
  if (!basicFormRef.value) return
  
  try {
    await basicFormRef.value.validate()
    basicLoading.value = true
    
    // TODO: 调用更新基本信息API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    userInfo.username = basicForm.username
    userInfo.avatar = basicForm.avatar
    ElMessage.success('基本信息更新成功')
  } catch (error) {
    console.error('更新基本信息失败:', error)
  } finally {
    basicLoading.value = false
  }
}

// 提交密码修改
const handlePasswordSubmit = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    passwordLoading.value = true
    
    // TODO: 调用修改密码API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    ElMessage.success('密码修改成功')
  } catch (error) {
    console.error('修改密码失败:', error)
  } finally {
    passwordLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.profile-page {
  padding: 40px 0;

  .profile-sidebar {
    background: #fff;
    border-radius: $border-radius-base;
    box-shadow: $box-shadow-light;
    padding: 20px;

    .user-info {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid $border-color-light;

      h3 {
        margin: 10px 0 5px;
        font-size: 18px;
        color: $text-color-primary;
      }

      .email {
        color: $text-color-secondary;
        font-size: 14px;
        margin: 0;
      }
    }

    .profile-menu {
      border-right: none;
      margin-top: 20px;
    }
  }

  .profile-content {
    background: #fff;
    border-radius: $border-radius-base;
    box-shadow: $box-shadow-light;
    padding: 30px;

    .content-section {
      h2 {
        margin: 0 0 30px;
        font-size: 20px;
        color: $text-color-primary;
      }
    }
  }
}

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed $border-color;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color $transition-duration;

    &:hover {
      border-color: $primary-color;
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: cover;
  }
}

@media (max-width: 768px) {
  .profile-page {
    .el-row {
      display: flex;
      flex-direction: column;
    }

    .el-col {
      width: 100% !important;
      margin-bottom: 20px;
    }
  }
}
</style> 