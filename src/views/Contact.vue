<template>
  <div class="contact-page">
    <div class="contact-banner">
      <h1>{{ t('nav.contact') }}</h1>
    </div>

    <div class="container">
      <div class="contact-content">
        <div class="contact-grid">
          <!-- 联系信息 -->
          <div class="contact-info">
            <h2>联系方式</h2>
            <div class="info-list">
              <div class="info-item">
                <el-icon><location /></el-icon>
                <div class="info-content">
                  <h3>公司地址</h3>
                  <p>中国广州市增城市新塘太平洋工业区139号511340</p>
                </div>
              </div>
              <div class="info-item">
                <el-icon><phone /></el-icon>
                <div class="info-content">
                  <h3>联系电话</h3>
                  <p>020-85163633 (工作时间)</p>
                  <p>13316084915 (工作时间)</p>
                </div>
              </div>
              <div class="info-item">
                <el-icon><message /></el-icon>
                <div class="info-content">
                  <h3>电子邮箱</h3>
                  <p>853369272@qq.com</p>
                </div>
              </div>
              <div class="info-item">
                <el-icon><clock /></el-icon>
                <div class="info-content">
                  <h3>工作时间</h3>
                  <p>周一至周五: 9:00 - 18:00</p>
                  <p>周六: 9:00 - 12:00</p>
                  <p>周日: 休息</p>
                </div>
              </div>
            </div>

            <div class="qrcode-section">
              <h3>关注我们</h3>
              <div class="qrcode-grid">
                <div class="qrcode-item">
                  <el-image :src="qrcodeImages.wechat" fit="cover" />
                  <p>微信公众号</p>
                </div>
                <div class="qrcode-item">
                  <el-image :src="qrcodeImages.service" fit="cover" />
                  <p>客服微信</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 联系表单 -->
          <div class="contact-form">
            <h2>在线留言</h2>
            <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-position="top"
              @submit.prevent="handleSubmit"
            >
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" placeholder="请输入您的姓名" />
              </el-form-item>
              <el-form-item label="电话" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入您的联系电话" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入您的电子邮箱" />
              </el-form-item>
              <el-form-item label="留言内容" prop="message">
                <el-input
                  v-model="form.message"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入您的留言内容"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" native-type="submit" :loading="submitting">
                  提交留言
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 地图 -->
        <div class="map-section">
          <h2>公司位置</h2>
          <div class="map-container">
            <!-- 这里可以嵌入地图，例如百度地图或高德地图 -->
            <div class="map-placeholder">
              地图加载中...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { t } from '@/utils/i18n'
import { Location, Phone, Message, Clock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import qrcodeImages from '@/assets/images/qrcodes'

const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = ref({
  name: '',
  phone: '',
  email: '',
  message: ''
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  message: [
    { required: true, message: '请输入留言内容', trigger: 'blur' },
    { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    // 这里应该调用API发送表单数据
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用

    ElMessage.success('留言提交成功，我们会尽快与您联系！')
    formRef.value.resetFields()
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.contact-page {
  .contact-banner {
    height: 300px;
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('@/assets/images/banners/contactUS.jpg');
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-align: center;

    h1 {
      font-size: 2.5rem;
      margin: 0;
    }
  }

  .contact-content {
    padding: 60px 0;

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 60px;

      .contact-info {
        h2 {
          font-size: 2rem;
          margin-bottom: 30px;
          color: #333;
        }

        .info-list {
          .info-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 30px;

            .el-icon {
              font-size: 24px;
              color: #409EFF;
              margin-right: 15px;
              margin-top: 5px;
            }

            .info-content {
              h3 {
                font-size: 1.2rem;
                margin: 0 0 10px;
                color: #333;
              }

              p {
                color: #666;
                margin: 5px 0;
                line-height: 1.6;
              }
            }
          }
        }

        .qrcode-section {
          margin-top: 40px;

          h3 {
            font-size: 1.2rem;
            margin-bottom: 20px;
            color: #333;
          }

          .qrcode-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;

            .qrcode-item {
              text-align: center;

              .el-image {
                width: 120px;
                height: 120px;
                border-radius: 4px;
                margin-bottom: 10px;
              }

              p {
                color: #666;
                margin: 0;
                font-size: 14px;
              }
            }
          }
        }
      }

      .contact-form {
        background: #fff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

        h2 {
          font-size: 2rem;
          margin-bottom: 30px;
          color: #333;
        }

        :deep(.el-form-item__label) {
          font-weight: 500;
        }
      }
    }

    .map-section {
      h2 {
        font-size: 2rem;
        margin-bottom: 30px;
        color: #333;
        text-align: center;
      }

      .map-container {
        height: 400px;
        background: #f5f5f5;
        border-radius: 8px;
        overflow: hidden;

        .map-placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 1.2rem;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .contact-page {
    .contact-banner {
      height: 200px;

      h1 {
        font-size: 2rem;
      }
    }

    .contact-content {
      .contact-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style> 