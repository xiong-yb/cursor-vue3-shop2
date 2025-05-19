<!-- 主布局组件：包含页面的整体结构，包括头部导航、主要内容区域和页脚 -->
<template>
  <div class="main-layout">
    <!-- 头部导航区域：固定在页面顶部 -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <!-- Logo区域：显示网站名称 -->
          <div class="logo">
            <span>MP卡牌</span>
          </div>
          
          <!-- 主导航菜单：使用 Element Plus 的 Menu 组件 -->
          <nav class="nav">
            <el-menu
              mode="horizontal"
              :router="true"
              :default-active="activeMenu"
              class="nav-menu"
            >
              <el-menu-item index="/">{{ t('nav.home') }}</el-menu-item>
              <el-menu-item index="/products">{{ t('nav.products') }}</el-menu-item>
              <el-menu-item index="/news">{{ t('nav.news') }}</el-menu-item>
              <el-menu-item index="/about">{{ t('nav.about') }}</el-menu-item>
              <el-menu-item index="/contact">{{ t('nav.contact') }}</el-menu-item>
            </el-menu>
          </nav>

          <!-- 头部右侧功能区：包含购物车、用户菜单和语言切换 -->
          <div class="header-right">
            <!-- 购物车图标：显示购物车商品数量 -->
            <router-link to="/cart" class="cart-link" @click.prevent="handleCartClick">
              <el-badge :value="cartCount" :hidden="cartCount === 0" class="cart-badge">
                <el-icon :size="24"><shopping-cart /></el-icon>
              </el-badge>
            </router-link>

            <!-- 用户菜单：登录后显示用户头像和下拉菜单 -->
            <template v-if="isLoggedIn">
              <el-dropdown @command="handleUserCommand">
                <span class="user-dropdown">
                  <el-avatar :size="32" :src="userAvatar" />
                  <span class="username">{{ username }}</span>
                  <el-icon><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                    <el-dropdown-item command="orders">我的订单</el-dropdown-item>
                    <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <!-- 未登录状态显示登录注册按钮 -->
            <template v-else>
              <div class="auth-buttons">
                <el-button type="text" @click="showLoginDialog">登录</el-button>
                <el-divider direction="vertical" />
                <el-button type="primary" @click="showRegisterDialog">注册</el-button>
              </div>
            </template>

            <!-- 语言切换下拉菜单：支持中英文切换 -->
            <el-dropdown @command="handleLanguageChange" class="language-switch">
              <span class="el-dropdown-link">
                {{ currentLang === 'zh-CN' ? '中文' : 'English' }}
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="zh-CN">中文</el-dropdown-item>
                  <el-dropdown-item command="en-US">English</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域：使用路由视图和过渡动画 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 页脚区域：包含公司信息和快速链接 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <!-- 公司信息：地址、联系方式等 -->
          <div class="footer-info">
            <h3>MP卡牌</h3>
            <p>地址：中国广州市增城市新塘太平洋工业区139号511340</p>
            <p>电话：020-85163633 (工作时间)</p>
            <p>手机：13316084915 (工作时间)</p>
            <p>邮箱：853369272@qq.com</p>
          </div>
          <!-- 快速链接：网站主要页面的链接 -->
          <div class="footer-links">
            <h4>快速链接</h4>
            <ul>
              <li><router-link to="/">{{ t('nav.home') }}</router-link></li>
              <li><router-link to="/products">{{ t('nav.products') }}</router-link></li>
              <li><router-link to="/news">{{ t('nav.news') }}</router-link></li>
              <li><router-link to="/about">{{ t('nav.about') }}</router-link></li>
              <li><router-link to="/contact">{{ t('nav.contact') }}</router-link></li>
            </ul>
          </div>
          <!-- 二维码区域：显示微信二维码和客服号 -->
          <div class="footer-qrcodes">
            <h4>关注我们</h4>
            <div class="qrcode-container">
              <div class="qrcode-item">
                <el-image :src="qrcodeImages.wechat" fit="cover" />
                <p>微信公众号</p>
              </div>
              <div class="qrcode-item">
                <el-image :src="qrcodeImages.service" fit="cover" />
                <p>客服微信号</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 版权信息 -->
        <div class="footer-bottom">
          <p>&copy; {{ new Date().getFullYear() }} MP卡牌 版权所有</p>
        </div>
      </div>
    </footer>

    <!-- 登录对话框：使用 Element Plus 的 Dialog 组件 -->
    <el-dialog
      v-model="loginDialogVisible"
      title="欢迎登录"
      width="420px"
      :close-on-click-modal="false"
      class="auth-dialog"
      destroy-on-close
    >
      <div class="auth-container">
        <div class="auth-header">
          <h2>欢迎回来</h2>
          <p class="auth-subtitle">请登录您的账号</p>
        </div>
        <!-- 登录表单：包含邮箱、密码输入框和记住我选项 -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-position="top"
          class="auth-form"
          @keyup.enter="handleLogin"
        >
          <el-form-item prop="email">
            <el-input
              v-model="loginForm.email"
              placeholder="请输入邮箱"
              :prefix-icon="Message"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
              size="large"
            />
          </el-form-item>
          <div class="form-actions">
            <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
            <el-button type="text" @click="showForgotPassword" class="forgot-link">
              忘记密码？
            </el-button>
          </div>
          <el-button
            type="primary"
            class="submit-btn"
            :loading="loginLoading"
            @click="handleLogin"
            size="large"
          >
            登录
          </el-button>
          <div class="auth-footer">
            还没有账号？
            <el-button type="text" @click="switchToRegister" class="switch-link">
              立即注册
            </el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>

    <!-- 注册对话框：使用 Element Plus 的 Dialog 组件 -->
    <el-dialog
      v-model="registerDialogVisible"
      title="创建账号"
      width="420px"
      :close-on-click-modal="false"
      class="auth-dialog"
      destroy-on-close
    >
      <div class="auth-container">
        <div class="auth-header">
          <h2>加入我们</h2>
          <p class="auth-subtitle">创建您的账号</p>
        </div>
        <!-- 注册表单：包含邮箱、验证码、密码输入框 -->
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          label-position="top"
          class="auth-form"
          @keyup.enter="handleRegister"
        >
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱"
              :prefix-icon="Message"
              size="large"
            >
              <template #append>
                <el-button
                  :disabled="!!countdown"
                  @click="sendVerifyCode"
                  class="verify-btn"
                  :class="{ 'is-counting': countdown }"
                >
                  {{ countdown ? `${countdown}s` : '获取验证码' }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <el-input
              v-model="registerForm.verifyCode"
              placeholder="请输入邮箱验证码"
              :prefix-icon="Key"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请设置密码"
              :prefix-icon="Lock"
              show-password
              size="large"
            />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请确认密码"
              :prefix-icon="Lock"
              show-password
              size="large"
            />
          </el-form-item>
          <el-button
            type="primary"
            class="submit-btn"
            :loading="registerLoading"
            @click="handleRegister"
            size="large"
          >
            注册
          </el-button>
          <div class="auth-footer">
            已有账号？
            <el-button type="text" @click="switchToLogin" class="switch-link">
              立即登录
            </el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>

    <!-- 忘记密码对话框：使用 Element Plus 的 Dialog 组件 -->
    <el-dialog
      v-model="forgotPasswordDialogVisible"
      title="重置密码"
      width="420px"
      :close-on-click-modal="false"
      class="auth-dialog"
      destroy-on-close
    >
      <div class="auth-container">
        <div class="auth-header">
          <h2>重置密码</h2>
          <p class="auth-subtitle">请输入您的邮箱，我们将发送验证码</p>
        </div>
        <!-- 忘记密码表单：分两步进行，先验证邮箱，再重置密码 -->
        <el-form
          ref="forgotPasswordFormRef"
          :model="forgotPasswordForm"
          :rules="forgotPasswordRules"
          label-position="top"
          class="auth-form"
        >
          <!-- 步骤1：邮箱验证 -->
          <template v-if="forgotPasswordStep === 1">
            <el-form-item prop="email">
              <el-input
                v-model="forgotPasswordForm.email"
                placeholder="请输入邮箱"
                :prefix-icon="Message"
                size="large"
              >
                <template #append>
                  <el-button
                    :disabled="!!forgotPasswordCountdown"
                    @click="sendForgotPasswordVerifyCode"
                    class="verify-btn"
                    :class="{ 'is-counting': forgotPasswordCountdown }"
                  >
                    {{ forgotPasswordCountdown ? `${forgotPasswordCountdown}s` : '获取验证码' }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="verifyCode">
              <el-input
                v-model="forgotPasswordForm.verifyCode"
                placeholder="请输入邮箱验证码"
                :prefix-icon="Key"
                size="large"
              />
            </el-form-item>

            <el-button
              type="primary"
              class="submit-btn"
              :loading="forgotPasswordLoading"
              @click="verifyForgotPasswordCode"
              size="large"
            >
              下一步
            </el-button>
          </template>

          <!-- 步骤2：重置密码 -->
          <template v-if="forgotPasswordStep === 2">
            <el-form-item prop="password">
              <el-input
                v-model="forgotPasswordForm.password"
                type="password"
                placeholder="请设置新密码"
                :prefix-icon="Lock"
                show-password
                size="large"
              />
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model="forgotPasswordForm.confirmPassword"
                type="password"
                placeholder="请确认新密码"
                :prefix-icon="Lock"
                show-password
                size="large"
              />
            </el-form-item>

            <el-button
              type="primary"
              class="submit-btn"
              :loading="forgotPasswordLoading"
              @click="resetForgotPassword"
              size="large"
            >
              重置密码
            </el-button>
          </template>

          <div class="auth-footer">
            <el-button type="text" @click="switchToLogin" class="switch-link">
              返回登录
            </el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入 Vue 核心功能
import { ref, computed, onMounted, onUnmounted } from 'vue'
// 导入路由相关功能
import { useRouter, useRoute } from 'vue-router'
// 导入 Element Plus 组件和类型
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
// 导入 Element Plus 图标
import { Message, Lock, Key, ShoppingCart, ArrowDown } from '@element-plus/icons-vue'
// 导入国际化工具
import { t } from '@/utils/i18n'
// 导入状态管理
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useLanguageStore } from '@/stores/language'
// 导入二维码图片
import qrcodeImages from '@/assets/images/qrcodes'

// 初始化路由和状态管理实例
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const languageStore = useLanguageStore()

// 计算属性：获取当前状态
const currentLang = computed(() => languageStore.currentLang) // 当前语言
const cartCount = ref(0)
const isLoggedIn = computed(() => userStore.isLoggedIn) // 登录状态
const username = computed(() => userStore.username) // 用户名
const userAvatar = computed(() => userStore.userAvatar) // 用户头像

// 登录相关状态
const loginDialogVisible = ref(false) // 登录对话框显示状态
const loginFormRef = ref<FormInstance>() // 登录表单引用
const loginLoading = ref(false) // 登录加载状态
const loginForm = ref({
  email: '', // 邮箱
  password: '', // 密码
  remember: false // 记住我
})

// 登录表单验证规则
const loginRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

// 注册相关状态
const registerDialogVisible = ref(false) // 注册对话框显示状态
const registerFormRef = ref<FormInstance>() // 注册表单引用
const registerLoading = ref(false) // 注册加载状态
const countdown = ref(0) // 验证码倒计时
const registerForm = ref({
  email: '', // 邮箱
  verifyCode: '', // 验证码
  password: '', // 密码
  confirmPassword: '' // 确认密码
})

// 注册表单验证规则
const registerRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度应为6位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (value !== registerForm.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 菜单激活状态
const activeMenu = computed(() => route.path)

// 忘记密码相关状态
const forgotPasswordDialogVisible = ref(false) // 忘记密码对话框显示状态
const forgotPasswordFormRef = ref<FormInstance>() // 忘记密码表单引用
const forgotPasswordLoading = ref(false) // 忘记密码加载状态
const forgotPasswordCountdown = ref(0) // 忘记密码验证码倒计时
const forgotPasswordStep = ref(1) // 忘记密码步骤
const forgotPasswordForm = ref({
  email: '', // 邮箱
  verifyCode: '', // 验证码
  password: '', // 新密码
  confirmPassword: '' // 确认新密码
})

// 忘记密码表单验证规则
const forgotPasswordRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度应为6位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请设置新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (value !== forgotPasswordForm.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 处理语言切换
const handleLanguageChange = (lang: 'zh-CN' | 'en-US') => {
  languageStore.setLanguage(lang)
}

// 处理用户菜单命令
const handleUserCommand = (command: string) => {
  if (!isLoggedIn.value) {
    showLoginDialog()
    return
  }

  switch (command) {
    case 'profile':
      router.push('/profile') // 跳转到个人中心
      break
    case 'orders':
      router.push('/orders') // 跳转到订单页面
      break
    case 'logout':
      handleLogout() // 处理退出登录
      break
  }
}

// 显示登录对话框
const showLoginDialog = () => {
  loginDialogVisible.value = true
}

// 显示注册对话框
const showRegisterDialog = () => {
  registerDialogVisible.value = true
}

// 显示忘记密码对话框
const showForgotPassword = () => {
  loginDialogVisible.value = false
  forgotPasswordDialogVisible.value = true
}

// 发送验证码
const sendVerifyCode = async () => {
  if (!registerForm.value.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }
  
  try {
    // TODO: 调用发送邮箱验证码API
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    ElMessage.success('验证码已发送到您的邮箱')
  } catch (error) {
    console.error('发送验证码失败:', error)
  }
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loginLoading.value = true
    
    // TODO: 调用登录API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟登录成功
    localStorage.setItem('token', 'test-token')
    userStore.setUser({
      username: '测试用户',
      avatar: '',
      token: 'test-token'
    })
    loginDialogVisible.value = false
    ElMessage.success('登录成功')

    // 处理登录后的重定向
    const redirect = route.query.redirect as string
    if (redirect) {
      router.push(redirect)
    }
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loginLoading.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    await registerFormRef.value.validate()
    registerLoading.value = true
    
    // TODO: 调用注册API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    registerDialogVisible.value = false
    ElMessage.success('注册成功，请登录')
    showLoginDialog()
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    registerLoading.value = false
  }
}

// 处理退出登录
const handleLogout = async () => {
  try {
    // TODO: 调用退出登录API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 清除用户信息和购物车数据
    localStorage.removeItem('token')
    localStorage.removeItem('cart') // 清除购物车数据
    userStore.clearUser()
    cartCount.value = 0 // 重置购物车数量
    
    ElMessage.success('已退出登录')
    router.push('/')
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}

// 切换登录/注册对话框
const switchToRegister = () => {
  loginDialogVisible.value = false
  registerDialogVisible.value = true
}

// 切换到登录对话框
const switchToLogin = () => {
  // 关闭当前显示的弹窗（注册或忘记密码）
  if (registerDialogVisible.value) {
    registerDialogVisible.value = false
  } else if (forgotPasswordDialogVisible.value) {
    forgotPasswordDialogVisible.value = false
  }
  // 打开登录弹窗
  loginDialogVisible.value = true
}

// 处理购物车点击
const handleCartClick = () => {
  if (!isLoggedIn.value) {
    showLoginDialog()
    return
  }
  router.push('/cart')
}

// 发送忘记密码验证码
const sendForgotPasswordVerifyCode = async () => {
  if (!forgotPasswordForm.value.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }

  try {
    // TODO: 调用发送邮箱验证码API
    forgotPasswordCountdown.value = 60
    const timer = setInterval(() => {
      forgotPasswordCountdown.value--
      if (forgotPasswordCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    ElMessage.success('验证码已发送到您的邮箱')
  } catch (error) {
    console.error('发送验证码失败:', error)
    ElMessage.error('发送验证码失败，请稍后重试')
  }
}

// 验证忘记密码验证码
const verifyForgotPasswordCode = async () => {
  if (!forgotPasswordFormRef.value) return

  try {
    await forgotPasswordFormRef.value.validate()
    forgotPasswordLoading.value = true

    // TODO: 调用验证码验证API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 验证成功，进入下一步
    forgotPasswordStep.value = 2
    ElMessage.success('验证码验证成功')
  } catch (error) {
    console.error('验证码验证失败:', error)
    ElMessage.error('验证码验证失败，请检查后重试')
  } finally {
    forgotPasswordLoading.value = false
  }
}

// 重置忘记密码
const resetForgotPassword = async () => {
  if (!forgotPasswordFormRef.value) return

  try {
    await forgotPasswordFormRef.value.validate()
    forgotPasswordLoading.value = true

    // TODO: 调用重置密码API
    await new Promise(resolve => setTimeout(resolve, 1000))

    ElMessage.success('密码重置成功，请使用新密码登录')
    forgotPasswordDialogVisible.value = false
    showLoginDialog()
  } catch (error) {
    console.error('重置密码失败:', error)
    ElMessage.error('重置密码失败，请稍后重试')
  } finally {
    forgotPasswordLoading.value = false
  }
}

// 更新购物车数量
const updateCartCount = () => {
  const cartData = localStorage.getItem('cart')
  if (cartData) {
    const cartItems = JSON.parse(cartData)
    cartCount.value = cartItems.reduce((total: number, item: any) => total + item.quantity, 0)
  } else {
    cartCount.value = 0
  }
}

// 监听购物车更新事件
const handleCartUpdate = (event: CustomEvent) => {
  if (event.detail?.count !== undefined) {
    cartCount.value = event.detail.count
  } else {
    updateCartCount()
  }
}

onMounted(() => {
  updateCartCount()
  window.addEventListener('cart-updated', handleCartUpdate as EventListener)
  // 添加登录对话框事件监听
  window.addEventListener('show-login-dialog', () => {
    loginDialogVisible.value = true
  })
})

onUnmounted(() => {
  window.removeEventListener('cart-updated', handleCartUpdate as EventListener)
  // 移除登录对话框事件监听
  window.removeEventListener('show-login-dialog', () => {
    loginDialogVisible.value = true
  })
})

// 在组件挂载时初始化用户状态
onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    // TODO: 调用获取用户信息API
    userStore.setUser({
      username: '测试用户',
      avatar: '',
      token
    })
  }
})
</script>

<style lang="scss" scoped>
// 使用 SCSS 变量和混合器
@use "sass:color";
@use "@/styles/variables.scss" as *;

// 主布局样式：使用 flex 布局实现页面整体结构
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  // 头部样式：固定在页面顶部，包含导航和用户功能区
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80px;

      // Logo样式：显示网站名称
      .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        
        span {
          font-size: 24px;
          font-weight: 600;
          color: $text-color-primary;
        }
      }

      // 导航菜单样式：使用 flex 布局居中显示
      .nav {
        flex: 1;
        margin: 0 40px;

        .nav-menu {
          border-bottom: none;
          justify-content: center;
        }
      }

      // 头部右侧功能区样式：包含购物车、用户菜单和语言切换
      .header-right {
        display: flex;
        align-items: center;
        gap: 20px;

        // 购物车链接样式：包含徽章显示商品数量
        .cart-link {
          display: flex;
          align-items: center;
          color: $text-color-primary;
          text-decoration: none;
          padding: 8px;
          border-radius: $border-radius-small;
          transition: all $transition-duration;

          &:hover {
            background-color: $background-color;
            color: $primary-color;
          }

          .cart-badge {
            :deep(.el-badge__content) {
              background-color: $danger-color;
              transform: translateY(-50%) translateX(100%);
            }
          }
        }

        // 用户下拉菜单样式：显示用户头像和用户名
        .user-dropdown {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 5px 10px;
          border-radius: $border-radius-small;
          transition: background-color $transition-duration;

          &:hover {
            background-color: $background-color;
          }

          .username {
            margin: 0 8px;
            color: $text-color-primary;
          }
        }

        // 认证按钮样式：登录和注册按钮
        .auth-buttons {
          display: flex;
          align-items: center;
        }

        // 语言切换样式：下拉菜单
        .language-switch {
          margin-left: 20px;
          
          .el-dropdown-link {
            cursor: pointer;
            display: flex;
            align-items: center;
            color: $text-color-primary;
            font-size: 14px;

            .el-icon {
              margin-left: 4px;
            }
          }
        }
      }
    }
  }

  // 主要内容区域样式：使用 flex 布局，顶部留出头部空间
  .main-content {
    flex: 1;
    margin-top: 80px;
  }

  // 页脚样式：深色背景，包含公司信息和快速链接
  .footer {
    background: #333;
    color: #fff;
    padding: 60px 0 20px;

    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr; // 修改为三列布局
      gap: 40px;
      margin-bottom: 40px;

      // 页脚信息样式：公司联系信息
      .footer-info {
        h3 {
          font-size: 1.5rem;
          margin-bottom: 20px;
          color: #fff;
        }

        p {
          margin: 10px 0;
          color: #ccc;
          line-height: 1.6;
        }
      }

      // 页脚链接样式：快速导航链接
      .footer-links {
        h4 {
          font-size: 1.2rem;
          margin-bottom: 20px;
          color: #fff;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            margin-bottom: 10px;

            a {
              color: #ccc;
              text-decoration: none;
              transition: color $transition-duration;

              &:hover {
                color: #fff;
              }
            }
          }
        }
      }

      // 二维码区域样式
      .footer-qrcodes {
        h4 {
          font-size: 1.2rem;
          margin-bottom: 20px;
          color: #fff;
        }

        .qrcode-container {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .qrcode-item {
          text-align: center;

          .el-image {
            width: 120px;
            height: 120px;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 8px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(64, 158, 255, 0.5);
            padding: 4px;
            transition: all 0.3s ease;

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
              border-color: rgba(64, 158, 255, 0.8);
            }
          }

          p {
            color: #ccc;
            margin: 0;
            font-size: 14px;
          }
        }
      }
    }

    // 页脚底部样式：版权信息
    .footer-bottom {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      p {
        color: #999;
        margin: 0;
        font-size: 14px;
      }
    }
  }
}

// 表单样式：登录、注册和忘记密码表单的通用样式
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

// 响应式设计：针对不同屏幕尺寸调整布局
@media (max-width: 1200px) {
  .main-layout {
    .header {
      .header-content {
        .nav {
          margin: 0 20px;
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .main-layout {
    .header {
      .header-content {
        .nav {
          display: none; // 在中等屏幕上隐藏导航菜单
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .main-layout {
    .header {
      .header-content {
        .header-right {
          .cart-link {
            padding: 4px;
          }
          
          .username {
            display: none; // 在小屏幕上隐藏用户名
          }
        }
      }
    }

    .footer {
      .footer-content {
        grid-template-columns: 1fr; // 在小屏幕上改为单列布局
        gap: 30px;
      }
    }
  }
}

// 登录注册对话框样式：自定义 Element Plus 对话框样式
.auth-dialog {
  :deep(.el-dialog__header) {
    display: none;
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.auth-container {
  padding: 40px;

  // 对话框头部样式
  .auth-header {
    text-align: center;
    margin-bottom: 30px;

    h2 {
      font-size: 24px;
      color: $text-color-primary;
      margin: 0 0 8px;
      font-weight: 600;
    }

    .auth-subtitle {
      color: $text-color-secondary;
      font-size: 14px;
      margin: 0;
    }
  }

  // 表单样式
  .auth-form {
    .el-form-item {
      margin-bottom: 20px;
    }

    // 输入框样式
    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px $border-color inset;
      transition: all $transition-duration;

      &:hover {
        box-shadow: 0 0 0 1px $primary-color inset;
      }

      &.is-focus {
        box-shadow: 0 0 0 1px $primary-color inset;
      }
    }

    :deep(.el-input__prefix-inner) {
      color: $text-color-secondary;
    }

    // 验证码按钮样式
    .verify-btn {
      padding: 0 15px;
      height: 32px;
      font-size: 14px;
      border: none;
      background: transparent;
      color: $primary-color;
      transition: all $transition-duration;

      &:hover:not(:disabled) {
        color: color.scale($primary-color, $lightness: 10%);
      }

      &:disabled {
        color: $text-color-disabled;
      }

      &.is-counting {
        color: $text-color-disabled;
      }
    }

    // 表单操作区域样式
    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      .forgot-link {
        color: $primary-color;
        font-size: 14px;
        padding: 0;

        &:hover {
          color: color.scale($primary-color, $lightness: 10%);
        }
      }
    }

    // 提交按钮样式
    .submit-btn {
      width: 100%;
      height: 44px;
      font-size: 16px;
      margin-bottom: 16px;
      border-radius: $border-radius-base;
      transition: all $transition-duration;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba($primary-color, 0.2);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }

    // 表单底部样式
    .auth-footer {
      text-align: center;
      color: $text-color-secondary;
      font-size: 14px;

      .switch-link {
        color: $primary-color;
        padding: 0 4px;
        font-weight: 500;

        &:hover {
          color: color.scale($primary-color, $lightness: 10%);
        }
      }
    }
  }
}

// 对话框动画效果
.auth-dialog {
  :deep(.el-dialog) {
    border-radius: $border-radius-large;
    overflow: hidden;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.3s ease-out;
  }

  &.is-visible {
    :deep(.el-dialog) {
      transform: translateY(0);
      opacity: 1;
    }
  }
}

// 移动端响应式调整
@media (max-width: 480px) {
  .auth-container {
    padding: 30px 20px;
  }
}
</style> 