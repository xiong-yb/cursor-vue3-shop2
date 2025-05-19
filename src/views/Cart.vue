<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">购物车</h1>
      
      <div v-if="cartItems.length > 0" class="cart-content">
        <el-table :data="cartItems" style="width: 100%">
          <el-table-column label="商品" min-width="400">
            <template #default="{ row }">
              <div class="product-info">
                <el-image :src="row.image" :alt="row.name" class="product-image" />
                <div class="product-details">
                  <h3>{{ row.name }}</h3>
                  <p class="product-spec">{{ row.spec }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="单价" width="120" align="center">
            <template #default="{ row }">
              <span class="price">¥{{ row.price.toFixed(2) }}</span>
            </template>
          </el-table-column>
          
          <el-table-column label="数量" width="150" align="center">
            <template #default="{ row }">
              <el-input-number
                v-model="row.quantity"
                :min="1"
                :max="99"
                size="small"
                @change="updateQuantity(row)"
              />
            </template>
          </el-table-column>
          
          <el-table-column label="小计" width="120" align="center">
            <template #default="{ row }">
              <span class="subtotal">¥{{ (row.price * row.quantity).toFixed(2) }}</span>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="100" align="center">
            <template #default="{ row }">
              <el-button
                type="danger"
                link
                @click="removeItem(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="cart-footer">
          <div class="cart-summary">
            <p>共 {{ totalQuantity }} 件商品</p>
            <p class="total-price">
              总计：<span>¥{{ totalPrice.toFixed(2) }}</span>
            </p>
          </div>
          <el-button type="primary" size="large" @click="checkout">
            结算
          </el-button>
        </div>
      </div>
      
      <el-empty
        v-else
        description="购物车是空的"
      >
        <el-button type="primary" @click="$router.push('/products')">
          去购物
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

interface CartItem {
  id: number
  name: string
  spec: string
  price: number
  quantity: number
  image: string
}

// 模拟购物车数据
const cartItems = ref<CartItem[]>([
  {
    id: 1,
    name: '扑克牌A',
    spec: '标准版',
    price: 29.9,
    quantity: 1,
    image: '/src/assets/images/product1.jpg'
  },
  {
    id: 2,
    name: '扑克牌B',
    spec: '豪华版',
    price: 39.9,
    quantity: 2,
    image: '/src/assets/images/product2.jpg'
  }
])

// 计算总数量和总价
const totalQuantity = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

// 更新商品数量
const updateQuantity = (item: CartItem) => {
  // TODO: 调用更新购物车API
  console.log('更新数量:', item.id, item.quantity)
}

// 删除商品
const removeItem = (item: CartItem) => {
  ElMessageBox.confirm(
    '确定要删除这个商品吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除购物车商品API
    cartItems.value = cartItems.value.filter(i => i.id !== item.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 结算
const router = useRouter()
const checkout = () => {
  // TODO: 调用结算API
  router.push('/checkout')
}
</script>

<style lang="scss" scoped>
.cart-page {
  padding: 40px 0;

  .page-title {
    font-size: $font-size-extra-large;
    color: $text-color-primary;
    margin-bottom: 30px;
  }

  .cart-content {
    background: #fff;
    border-radius: $border-radius-base;
    box-shadow: $box-shadow-light;
    padding: 20px;

    .product-info {
      display: flex;
      align-items: center;
      gap: 15px;

      .product-image {
        width: 80px;
        height: 80px;
        border-radius: $border-radius-small;
        object-fit: cover;
      }

      .product-details {
        h3 {
          margin: 0 0 8px;
          font-size: $font-size-medium;
          color: $text-color-primary;
        }

        .product-spec {
          margin: 0;
          font-size: $font-size-small;
          color: $text-color-secondary;
        }
      }
    }

    .price, .subtotal {
      font-weight: 500;
      color: $text-color-primary;
    }

    .subtotal {
      color: $danger-color;
    }

    .cart-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 20px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid $border-color-light;

      .cart-summary {
        text-align: right;

        p {
          margin: 5px 0;
          color: $text-color-regular;
        }

        .total-price {
          font-size: $font-size-medium;
          
          span {
            font-size: $font-size-large;
            font-weight: 600;
            color: $danger-color;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .cart-page {
    padding: 20px 0;

    .cart-content {
      padding: 15px;

      .product-info {
        .product-image {
          width: 60px;
          height: 60px;
        }
      }

      .cart-footer {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;

        .cart-summary {
          text-align: center;
        }
      }
    }
  }
}
</style> 