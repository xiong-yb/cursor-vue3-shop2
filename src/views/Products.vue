<template>
  <div class="products-page">
    <!-- 添加购物车动画元素 -->
    <div class="cart-animation" v-if="showCartAnimation">
      <div class="cart-animation-item" :style="cartAnimationStyle">
        <el-image :src="cartAnimationProduct?.image" fit="cover" />
      </div>
    </div>

    <div class="products-banner">
      <h1>{{ t('nav.products') }}</h1>
    </div>

    <div class="container">
      <div class="products-content">
        <!-- 产品分类 -->
        <div class="product-categories">
          <el-tabs v-model="activeCategory" @tab-click="handleCategoryChange">
            <el-tab-pane
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :name="category.id.toString()"
            >
              <div class="products-grid">
                <div v-for="product in category.products" :key="product.id" class="product-card">
                  <el-image 
                    :src="product.image" 
                    fit="contain" 
                    class="product-image"
                    @click="showProductDetail(product)"
                  >
                    <template #placeholder>
                      <div class="image-placeholder">
                        <el-icon><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                  <div class="product-info">
                    <h3>{{ product.name }}</h3>
                    <p class="product-desc">{{ product.description }}</p>
                    <div class="product-price">
                      <span class="price">¥{{ product.price?.toFixed(2) || '联系客服' }}</span>
                    </div>
                    <div class="product-actions">
                      <el-button 
                        type="primary" 
                        :icon="ShoppingCart"
                        @click="addToCart(product)"
                        :disabled="!product.price"
                      >
                        加入购物车
                      </el-button>
                      <el-button 
                        type="success" 
                        :icon="Brush"
                        @click="showCustomDesign(product)"
                      >
                        自定义设计
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>

    <!-- 产品详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="selectedProduct?.name"
      width="800px"
      class="product-dialog"
    >
      <div v-if="selectedProduct" class="product-detail">
        <el-image :src="selectedProduct.image" fit="cover" class="product-image" />
        <div class="product-description">
          <p>{{ selectedProduct.description }}</p>
          <div class="product-features">
            <h4>产品特点</h4>
            <ul>
              <li v-for="(feature, index) in selectedProduct.features" :key="index">
                {{ feature }}
              </li>
            </ul>
          </div>
          <div class="product-contact">
            <h4>联系我们</h4>
            <p>电话：020-85163633</p>
            <p>手机：13316084915</p>
            <p>邮箱：853369272@qq.com</p>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 自定义设计对话框 -->
    <el-dialog
      v-model="customDesignVisible"
      title="自定义设计"
      width="600px"
      class="custom-design-dialog"
      destroy-on-close
    >
      <el-form
        v-if="selectedProduct"
        :model="customDesignForm"
        label-position="top"
        class="design-form"
      >
        <el-form-item label="产品名称">
          <el-input v-model="selectedProduct.name" disabled />
        </el-form-item>
        
        <el-form-item label="设计需求描述" required>
          <el-input
            v-model="customDesignForm.description"
            type="textarea"
            :rows="4"
            placeholder="请详细描述您的设计需求，包括风格、颜色、尺寸等要求"
          />
        </el-form-item>
        
        <el-form-item label="参考图片">
          <div class="upload-area">
            <el-icon><upload-filled /></el-icon>
            <p>点击或拖拽图片到此处上传</p>
            <input type="file" accept="image/*" style="display: none" />
          </div>
        </el-form-item>
        
        <el-form-item label="联系方式" required>
          <el-input v-model="customDesignForm.contact" placeholder="请输入您的手机号或邮箱" />
        </el-form-item>
        
        <el-form-item label="备注">
          <el-input
            v-model="customDesignForm.remarks"
            type="textarea"
            :rows="2"
            placeholder="其他补充说明"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="customDesignVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCustomDesign">
            提交需求
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ShoppingCart, Brush, Picture } from '@element-plus/icons-vue'
import { t } from '@/utils/i18n'
import type { Product, ProductCategory, CustomDesignForm } from '@/types'
import adPokerImg from '@/assets/images/products/ad-poker.jpg'
import plasticPokerImg from '@/assets/images/products/plastic-poker.jpg'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const activeCategory = ref('1')
const dialogVisible = ref(false)
const customDesignVisible = ref(false)
const selectedProduct = ref<Product | null>(null)
const customDesignForm = ref<CustomDesignForm>({
  description: '',
  contact: '',
  remarks: ''
})

// 购物车动画相关状态
const showCartAnimation = ref(false)
const cartAnimationStyle = ref({})
const cartAnimationProduct = ref<Product | null>(null)

// 监听路由参数变化
watch(
  () => route.query.category,
  (newCategory) => {
    if (newCategory) {
      activeCategory.value = newCategory.toString()
    }
  },
  { immediate: true }
)

const categories = ref<ProductCategory[]>([
  {
    id: 1,
    name: '扑克牌',
    description: '专业定制扑克牌',
    image: '/src/assets/images/categories/poker.jpg',
    products: [
      {
        id: 1,
        name: '广告扑克',
        category: '扑克牌',
        description: '专业定制广告扑克牌，可印刷企业logo、产品图片等广告内容，是理想的广告宣传载体。',
        image: adPokerImg,
        images: [adPokerImg],
        specifications: {
          '材质': '优质纸张',
          '尺寸': '标准扑克牌尺寸',
          '印刷': '全彩印刷'
        },
        features: [
          '高品质纸张印刷',
          '支持全彩印刷',
          '可定制企业logo',
          '适合广告宣传',
          '多种规格可选'
        ],
        price: 99.00
      },
      {
        id: 2,
        name: '塑料扑克',
        category: '扑克牌',
        description: '采用优质PVC材料制作，防水耐用，适合长期使用，是娱乐场所的理想选择。',
        image: plasticPokerImg,
        images: [plasticPokerImg],
        specifications: {
          '材质': 'PVC',
          '尺寸': '标准扑克牌尺寸',
          '特点': '防水耐用'
        },
        features: [
          'PVC材质防水耐用',
          '适合长期使用',
          '手感舒适',
          '不易变形',
          '适合娱乐场所'
        ],
        price: 129.00
      }
    ]
  },
  {
    id: 2,
    name: '桌游卡牌',
    description: '专业定制桌游卡牌',
    image: '/src/assets/images/categories/board-games.jpg',
    products: [
      {
        id: 3,
        name: 'TCG卡牌',
        category: '桌游卡牌',
        description: '专业定制各类TCG卡牌，包括游戏卡牌、收藏卡牌等，支持多种工艺处理。',
        image: '/src/assets/images/products/tcg-cards.jpg',
        images: ['/src/assets/images/products/tcg-cards.jpg'],
        specifications: {
          '材质': '专业卡牌纸',
          '工艺': 'UV工艺',
          '防伪': '支持防伪标识'
        },
        features: [
          '专业卡牌印刷',
          '支持UV工艺',
          '可添加防伪标识',
          '适合游戏收藏',
          '多种规格可选'
        ],
        price: 199.00
      }
    ]
  },
  {
    id: 3,
    name: '塔罗牌',
    description: '精美塔罗牌定制',
    image: '/src/assets/images/categories/tarot.jpg',
    products: [
      {
        id: 4,
        name: '经典塔罗牌',
        category: '塔罗牌',
        description: '精美塔罗牌定制，采用优质纸张，印刷清晰，适合占卜和收藏。',
        image: '/src/assets/images/products/tarot.jpg',
        images: ['/src/assets/images/products/tarot.jpg'],
        specifications: {
          '材质': '优质纸张',
          '工艺': '精美印刷',
          '包装': '精美包装'
        },
        features: [
          '优质纸张印刷',
          '精美图案设计',
          '适合占卜收藏',
          '包装精美',
          '支持定制设计'
        ],
        price: 299.00
      }
    ]
  },
  {
    id: 4,
    name: '闪卡',
    description: '专业定制闪卡',
    image: '/src/assets/images/categories/flash-cards.jpg',
    products: [
      {
        id: 5,
        name: '教育闪卡',
        category: '闪卡',
        description: '专业定制教育闪卡，包括识字卡、学习卡等，适合儿童教育使用。',
        image: '/src/assets/images/products/education-cards.jpg',
        images: ['/src/assets/images/products/education-cards.jpg'],
        specifications: {
          '材质': '优质纸张',
          '尺寸': '标准闪卡尺寸',
          '印刷': '全彩印刷'
        },
        features: [
          '优质纸张印刷',
          '适合儿童教育',
          '内容丰富',
          '易于使用',
          '支持定制'
        ],
        price: 79.00
      }
    ]
  }
])

const handleCategoryChange = (tab: any) => {
  activeCategory.value = tab.props.name
}

const showProductDetail = (product: Product) => {
  selectedProduct.value = product
  dialogVisible.value = true
}

// 添加到购物车
const addToCart = async (product: Product) => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    // 触发登录弹窗显示
    window.dispatchEvent(new CustomEvent('show-login-dialog'))
    return
  }

  try {
    // 设置动画产品
    cartAnimationProduct.value = product
    showCartAnimation.value = true

    // 获取点击按钮的位置
    const button = event?.target as HTMLElement
    const rect = button?.getBoundingClientRect()
    
    if (rect) {
      // 设置动画起始位置
      cartAnimationStyle.value = {
        left: `${rect.left + rect.width / 2}px`,
        top: `${rect.top + rect.height / 2}px`
      }
    }

    // 获取当前购物车数据
    const cartData = localStorage.getItem('cart')
    const cartItems = cartData ? JSON.parse(cartData) : []
    
    // 检查商品是否已在购物车中
    const existingItem = cartItems.find((item: any) => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cartItems.push({
        id: product.id,
        name: product.name,
        spec: '标准版',
        price: product.price || 0,
        quantity: 1,
        image: product.image
      })
    }
    
    // 保存更新后的购物车数据
    localStorage.setItem('cart', JSON.stringify(cartItems))
    
    // 计算购物车总数量
    const totalQuantity = cartItems.reduce((total: number, item: any) => total + item.quantity, 0)
    
    // 触发自定义事件，通知购物车更新，并传递新的数量
    window.dispatchEvent(new CustomEvent('cart-updated', {
      detail: { count: totalQuantity }
    }))
    
    // 显示成功消息
    ElMessage.success('已添加到购物车')

    // 动画结束后重置状态
    setTimeout(() => {
      showCartAnimation.value = false
      cartAnimationProduct.value = null
    }, 800)
  } catch (error) {
    console.error('添加到购物车失败:', error)
    ElMessage.error('添加失败，请稍后重试')
  }
}

// 显示自定义设计对话框
const showCustomDesign = (product: Product) => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    // 触发登录弹窗显示
    window.dispatchEvent(new CustomEvent('show-login-dialog'))
    return
  }
  
  router.push({
    name: 'product-detail',
    params: { id: product.id.toString() }
  })
}

// 处理自定义设计提交
const handleCustomDesign = async () => {
  try {
    // TODO: 调用自定义设计API
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('设计需求已提交，我们会尽快与您联系')
    customDesignVisible.value = false
  } catch (error) {
    console.error('提交设计需求失败:', error)
    ElMessage.error('提交失败，请稍后重试')
  }
}
</script>

<style lang="scss" scoped>
.products-page {
  .products-banner {
    height: 300px;
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('@/assets/images/banners/productBk.jpg');
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

  .products-content {
    padding: 60px 0;

    .product-categories {
      :deep(.el-tabs__nav-wrap) {
        justify-content: center;
        margin-bottom: 40px;
      }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 30px;
        margin-top: 20px;

        .product-card {
          background: #fff;
          border-radius: $border-radius-base;
          overflow: hidden;
          box-shadow: $box-shadow-light;
          transition: transform 0.3s, box-shadow 0.3s;
          display: flex;
          flex-direction: column;
          height: 100%;
          border: 1px solid $border-color;

          &:hover {
            transform: translateY(-5px);
            box-shadow: $box-shadow-base;
          }

          .product-image {
            width: 100%;
            height: 250px;
            cursor: pointer;
            background-color: #f5f7fa;
            transition: transform 0.3s;

            &:hover {
              transform: scale(1.05);
            }

            :deep(.el-image__inner) {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .image-placeholder {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #f5f7fa;
              color: #909399;
              font-size: 24px;
            }
          }

          .product-info {
            padding: 20px;
            flex: 1;
            display: flex;
            flex-direction: column;

            h3 {
              font-size: 1.25rem;
              margin: 0 0 10px;
              color: $text-color-primary;
              line-height: 1.4;
              height: 2.8em;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .product-desc {
              color: $text-color-regular;
              line-height: 1.6;
              margin-bottom: 15px;
              flex: 1;
              height: 4.8em;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
            }

            .product-price {
              margin-bottom: 15px;
              
              .price {
                font-size: 1.25rem;
                font-weight: 600;
                color: $danger-color;
              }
            }

            .product-actions {
              display: flex;
              gap: 10px;

              .el-button {
                flex: 1;
                justify-content: center;
              }
            }
          }
        }
      }
    }
  }
}

.product-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
  }

  .product-detail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    padding: 20px;

    .product-image {
      width: 100%;
      height: 400px;
      border-radius: 8px;
    }

    .product-description {
      p {
        font-size: 1.1rem;
        line-height: 1.8;
        color: #666;
        margin-bottom: 20px;
      }

      .product-features,
      .product-contact {
        h4 {
          font-size: 1.2rem;
          margin-bottom: 15px;
          color: #333;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;

          li {
            color: #666;
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;

            &:before {
              content: "•";
              position: absolute;
              left: 0;
              color: #409EFF;
            }
          }
        }

        p {
          margin: 5px 0;
          font-size: 1rem;
        }
      }
    }
  }
}

// 自定义设计对话框样式
.custom-design-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
  }

  .design-form {
    .el-form-item {
      margin-bottom: 20px;
    }

    .upload-area {
      border: 2px dashed $border-color;
      border-radius: $border-radius-base;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: all $transition-duration;

      &:hover {
        border-color: $primary-color;
      }

      .el-icon {
        font-size: 24px;
        color: $text-color-secondary;
        margin-bottom: 10px;
      }

      p {
        margin: 0;
        color: $text-color-secondary;
      }
    }
  }
}

// 简化购物车动画样式
.cart-animation {
  position: fixed;
  z-index: 9999;
  pointer-events: none;

  .cart-animation-item {
    position: fixed;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    transform-origin: center;
    animation: cartAnimation 0.8s ease-out forwards;

    .el-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

@keyframes cartAnimation {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.2);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .products-page {
    .products-banner {
      height: 200px;

      h1 {
        font-size: 2rem;
      }
    }

    .product-dialog {
      .product-detail {
        grid-template-columns: 1fr;
      }
    }

    .products-content {
      padding: 30px 0;

      .product-categories {
        .products-grid {
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;

          .product-card {
            .product-image {
              height: 200px;
            }

            .product-info {
              padding: 15px;

              h3 {
                font-size: 1.1rem;
              }

              .product-actions {
                flex-direction: column;
              }
            }
          }
        }
      }
    }
  }
}
</style> 