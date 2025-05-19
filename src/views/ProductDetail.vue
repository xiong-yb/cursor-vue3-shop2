<template>
  <div class="product-detail-page">
    <div class="container">
      <div class="product-detail-content">
        <!-- 产品展示区 -->
        <div class="product-gallery">
          <div class="main-image">
            <el-image :src="currentImage" fit="cover" />
          </div>
          <div class="thumbnail-list">
            <el-image
              v-for="(image, index) in product.images"
              :key="index"
              :src="image"
              fit="cover"
              @click="currentImage = image"
            />
          </div>
        </div>

        <!-- 产品信息区 -->
        <div class="product-info">
          <h1>{{ product.name }}</h1>
          <p class="product-desc">{{ product.description }}</p>

          <!-- 规格选择 -->
          <div class="specs-section">
            <!-- 纸张材质 -->
            <el-form-item label="纸张材质" required>
              <el-select
                v-model="selectedSpecs.material"
                placeholder="请选择纸张材质"
                class="spec-select"
              >
                <el-option
                  v-for="option in materialOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                >
                  <div class="spec-option">
                    <span class="spec-label">{{ option.label }}</span>
                    <span class="spec-desc">{{ option.description }}</span>
                    <span class="spec-price">+¥{{ option.price.toFixed(2) }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>

            <!-- 印刷工艺 -->
            <el-form-item label="印刷工艺" required>
              <el-select
                v-model="selectedSpecs.printType"
                placeholder="请选择印刷工艺"
                class="spec-select"
              >
                <el-option
                  v-for="option in printTypeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                >
                  <div class="spec-option">
                    <span class="spec-label">{{ option.label }}</span>
                    <span class="spec-desc">{{ option.description }}</span>
                    <span class="spec-price">+¥{{ option.price.toFixed(2) }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>

            <!-- 表面处理 -->
            <el-form-item label="表面处理" required>
              <el-select
                v-model="selectedSpecs.surface"
                placeholder="请选择表面处理"
                class="spec-select"
              >
                <el-option
                  v-for="option in surfaceOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                >
                  <div class="spec-option">
                    <span class="spec-label">{{ option.label }}</span>
                    <span class="spec-desc">{{ option.description }}</span>
                    <span class="spec-price">+¥{{ option.price.toFixed(2) }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>

            <!-- 包装方式 -->
            <el-form-item label="包装方式" required>
              <el-select
                v-model="selectedSpecs.packaging"
                placeholder="请选择包装方式"
                class="spec-select"
              >
                <el-option
                  v-for="option in packagingOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                >
                  <div class="spec-option">
                    <span class="spec-label">{{ option.label }}</span>
                    <span class="spec-desc">{{ option.description }}</span>
                    <span class="spec-price">+¥{{ option.price.toFixed(2) }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>

            <!-- 数量选择 -->
            <el-form-item label="数量" required>
              <el-radio-group v-model="selectedSpecs.quantity" class="quantity-group">
                <el-radio-button label="100">100副</el-radio-button>
                <el-radio-button label="200">200副</el-radio-button>
                <el-radio-button label="500">500副</el-radio-button>
                <el-radio-button label="1000">1000副</el-radio-button>
                <el-radio-button label="2000">2000副</el-radio-button>
                <el-radio-button label="5000">5000副</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>

          <!-- 价格显示 -->
          <div class="price-section">
            <div class="total-price">
              <span class="price-label">总价：</span>
              <span class="price-value">¥{{ calculateTotalPrice().toFixed(2) }}</span>
            </div>
            <p class="price-note">* 价格已包含所有选配规格费用</p>
          </div>

          <!-- 开始设计按钮 -->
          <div class="action-buttons">
            <el-button 
              type="primary" 
              size="large" 
              @click="startDesign"
              :disabled="!isSpecsSelected"
            >
              开始设计
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const currentImage = ref('')

// 产品数据
const product = ref({
  id: route.params.id,
  name: '定制扑克牌',
  description: '专业定制扑克牌，支持多种材质和工艺选择，满足不同场景需求。',
  mainImage: '/src/assets/images/products/ad-poker.jpg',
  images: [
    '/src/assets/images/products/ad-poker.jpg',
    '/src/assets/images/products/plastic-poker.jpg',
    '/src/assets/images/products/tcg-cards.jpg'
  ]
})

// 规格选项
const materialOptions = [
  { 
    value: 'standard', 
    label: '标准纸张', 
    description: '采用优质纸张，手感舒适，适合普通使用',
    price: 0.5
  },
  { 
    value: 'premium', 
    label: '高级纸张', 
    description: '采用进口纸张，手感极佳，适合收藏使用',
    price: 1.0
  },
  { 
    value: 'plastic', 
    label: 'PVC材质', 
    description: '防水耐用，适合长期使用，适合娱乐场所',
    price: 1.5
  }
]

const printTypeOptions = [
  { 
    value: 'standard', 
    label: '标准印刷', 
    description: '普通四色印刷，适合一般使用',
    price: 0.3
  },
  { 
    value: 'high', 
    label: '高清印刷', 
    description: '高精度印刷，色彩更鲜艳',
    price: 0.6
  },
  { 
    value: 'special', 
    label: '特殊印刷', 
    description: '支持专色印刷，适合特殊需求',
    price: 1.0
  }
]

const surfaceOptions = [
  { 
    value: 'none', 
    label: '无处理', 
    description: '标准表面，适合普通使用',
    price: 0
  },
  { 
    value: 'uv', 
    label: 'UV处理', 
    description: '表面UV处理，增加耐磨性',
    price: 0.4
  },
  { 
    value: 'embossed', 
    label: '压纹处理', 
    description: '表面压纹处理，提升质感',
    price: 0.6
  }
]

const packagingOptions = [
  { 
    value: 'standard', 
    label: '标准包装', 
    description: '普通纸盒包装',
    price: 0.2
  },
  { 
    value: 'premium', 
    label: '精美包装', 
    description: '高档纸盒包装，适合送礼',
    price: 0.5
  },
  { 
    value: 'custom', 
    label: '定制包装', 
    description: '可定制包装设计',
    price: 1.0
  }
]

// 选中的规格
const selectedSpecs = ref({
  material: '',
  printType: '',
  surface: '',
  packaging: '',
  quantity: '100'
})

// 是否已选择所有规格
const isSpecsSelected = computed(() => {
  return selectedSpecs.value.material && 
         selectedSpecs.value.printType && 
         selectedSpecs.value.surface && 
         selectedSpecs.value.packaging
})

// 计算总价
const calculateTotalPrice = () => {
  const basePrice = 0.5 // 基础价格
  let total = basePrice

  // 添加材质价格
  const material = materialOptions.find(m => m.value === selectedSpecs.value.material)
  if (material) total += material.price

  // 添加印刷工艺价格
  const printType = printTypeOptions.find(p => p.value === selectedSpecs.value.printType)
  if (printType) total += printType.price

  // 添加表面处理价格
  const surface = surfaceOptions.find(s => s.value === selectedSpecs.value.surface)
  if (surface) total += surface.price

  // 添加包装价格
  const packaging = packagingOptions.find(p => p.value === selectedSpecs.value.packaging)
  if (packaging) total += packaging.price

  // 根据数量计算总价
  const quantity = parseInt(selectedSpecs.value.quantity)
  total *= quantity

  // 数量折扣
  if (quantity >= 5000) {
    total *= 0.8 // 8折
  } else if (quantity >= 2000) {
    total *= 0.85 // 8.5折
  } else if (quantity >= 1000) {
    total *= 0.9 // 9折
  } else if (quantity >= 500) {
    total *= 0.95 // 9.5折
  }

  return total
}

// 开始设计
const startDesign = () => {
  if (!isSpecsSelected.value) {
    ElMessage.warning('请选择所有规格')
    return
  }

  // 保存选择的规格到 localStorage
  localStorage.setItem('designSpecs', JSON.stringify({
    productId: product.value.id,
    specs: selectedSpecs.value,
    totalPrice: calculateTotalPrice()
  }))

  // 跳转到设计页面
  router.push({
    name: 'design',
    params: { productId: product.value.id }
  })
}
</script>

<style lang="scss" scoped>
@use "sass:color";
@use "@/styles/variables.scss" as *;

.product-detail-page {
  padding: 40px 0;

  .product-detail-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    background: #fff;
    border-radius: $border-radius-base;
    padding: 30px;
    box-shadow: $box-shadow-light;

    .product-gallery {
      .main-image {
        width: 100%;
        height: 400px;
        border-radius: $border-radius-base;
        overflow: hidden;
        margin-bottom: 20px;

        .el-image {
          width: 100%;
          height: 100%;
        }
      }

      .thumbnail-list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;

        .el-image {
          width: 100%;
          height: 100px;
          border-radius: $border-radius-small;
          cursor: pointer;
          transition: transform $transition-duration;

          &:hover {
            transform: scale(1.05);
          }
        }
      }
    }

    .product-info {
      h1 {
        font-size: 1.8rem;
        margin: 0 0 15px;
        color: $text-color-primary;
      }

      .product-desc {
        color: $text-color-regular;
        line-height: 1.6;
        margin-bottom: 30px;
      }

      .specs-section {
        margin-bottom: 30px;

        .spec-select {
          width: 100%;
        }

        .spec-option {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .spec-label {
            font-weight: 500;
          }

          .spec-desc {
            font-size: 0.9rem;
            color: $text-color-secondary;
          }

          .spec-price {
            color: $danger-color;
            font-weight: 500;
          }
        }

        .quantity-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;

          .el-radio-button {
            margin-right: 0;
          }
        }
      }

      .price-section {
        margin-bottom: 30px;
        padding: 20px;
        background: $background-color;
        border-radius: $border-radius-base;

        .total-price {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 10px;

          .price-label {
            font-size: 1.1rem;
            color: $text-color-regular;
          }

          .price-value {
            font-size: 2rem;
            font-weight: 600;
            color: $danger-color;
          }
        }

        .price-note {
          margin: 0;
          font-size: 0.9rem;
          color: $text-color-secondary;
        }
      }

      .action-buttons {
        .el-button {
          width: 100%;
          height: 44px;
          font-size: 1.1rem;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .product-detail-page {
    .product-detail-content {
      grid-template-columns: 1fr;
      gap: 30px;
      padding: 20px;

      .product-gallery {
        .main-image {
          height: 300px;
        }
      }

      .product-info {
        h1 {
          font-size: 1.5rem;
        }

        .specs-section {
          .quantity-group {
            .el-radio-button {
              flex: 1;
              min-width: calc(50% - 5px);
            }
          }
        }
      }
    }
  }
}
</style> 