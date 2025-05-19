<template>
  <div class="order-detail-page">
    <div class="container">
      <div class="page-header">
        <el-page-header @back="$router.push('/orders')" :title="t('nav.orders')" />
        <h1 class="page-title">订单详情</h1>
      </div>

      <div class="order-detail-content" v-if="order">
        <!-- 订单状态 -->
        <el-card class="status-card">
          <div class="status-header">
            <div class="status-info">
              <el-tag :type="getStatusType(order.status)" size="large">
                {{ getStatusText(order.status) }}
              </el-tag>
              <p class="status-desc">{{ getStatusDescription(order.status) }}</p>
            </div>
            <div class="status-actions" v-if="order.status === 'pending'">
              <el-button @click="cancelOrder">取消订单</el-button>
              <el-button type="primary" @click="payOrder">立即付款</el-button>
            </div>
          </div>
        </el-card>

        <!-- 订单信息 -->
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>订单信息</span>
            </div>
          </template>
          <div class="info-list">
            <div class="info-item">
              <span class="label">订单编号：</span>
              <span class="value">{{ order.orderNo }}</span>
            </div>
            <div class="info-item">
              <span class="label">创建时间：</span>
              <span class="value">{{ order.createTime }}</span>
            </div>
            <div class="info-item" v-if="order.payTime">
              <span class="label">付款时间：</span>
              <span class="value">{{ order.payTime }}</span>
            </div>
            <div class="info-item" v-if="order.shipTime">
              <span class="label">发货时间：</span>
              <span class="value">{{ order.shipTime }}</span>
            </div>
            <div class="info-item" v-if="order.completeTime">
              <span class="label">完成时间：</span>
              <span class="value">{{ order.completeTime }}</span>
            </div>
          </div>
        </el-card>

        <!-- 商品信息 -->
        <el-card class="products-card">
          <template #header>
            <div class="card-header">
              <span>商品信息</span>
            </div>
          </template>
          <div class="products-list">
            <div v-for="item in order.items" :key="item.id" class="product-item">
              <el-image :src="item.image" :alt="item.name" class="product-image" />
              <div class="product-info">
                <h3>{{ item.name }}</h3>
                <p class="product-spec">{{ item.spec }}</p>
                <div class="product-price">
                  <span class="price">¥{{ item.price.toFixed(2) }}</span>
                  <span class="quantity">x{{ item.quantity }}</span>
                </div>
              </div>
              <div class="product-subtotal">
                ¥{{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>
          <div class="order-total">
            <div class="total-item">
              <span class="label">商品总数：</span>
              <span class="value">{{ getTotalQuantity(order) }} 件</span>
            </div>
            <div class="total-item">
              <span class="label">商品总额：</span>
              <span class="value">¥{{ getTotalPrice(order).toFixed(2) }}</span>
            </div>
            <div class="total-item">
              <span class="label">运费：</span>
              <span class="value">¥{{ order.shippingFee?.toFixed(2) || '0.00' }}</span>
            </div>
            <div class="total-item grand-total">
              <span class="label">实付金额：</span>
              <span class="value">¥{{ getGrandTotal(order).toFixed(2) }}</span>
            </div>
          </div>
        </el-card>

        <!-- 收货信息 -->
        <el-card class="address-card" v-if="order.address">
          <template #header>
            <div class="card-header">
              <span>收货信息</span>
            </div>
          </template>
          <div class="address-info">
            <p class="name-phone">
              <span class="name">{{ order.address.name }}</span>
              <span class="phone">{{ order.address.phone }}</span>
            </p>
            <p class="address">{{ order.address.fullAddress }}</p>
          </div>
        </el-card>
      </div>

      <el-empty v-else description="订单不存在" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { t } from '@/utils/i18n'

interface Address {
  name: string
  phone: string
  fullAddress: string
}

interface OrderItem {
  id: number
  name: string
  spec: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: number
  orderNo: string
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  createTime: string
  payTime?: string
  shipTime?: string
  completeTime?: string
  shippingFee?: number
  address?: Address
  items: OrderItem[]
}

const route = useRoute()
const router = useRouter()
const order = ref<Order | null>(null)

// 获取订单详情
const fetchOrderDetail = async () => {
  try {
    // TODO: 调用获取订单详情API
    // 模拟数据
    order.value = {
      id: Number(route.params.id),
      orderNo: 'MP202403150001',
      status: 'pending',
      createTime: '2024-03-15 10:30:00',
      shippingFee: 10,
      address: {
        name: '张三',
        phone: '13800138000',
        fullAddress: '广东省广州市天河区天河路123号'
      },
      items: [
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
      ]
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  }
}

// 获取状态类型
const getStatusType = (status: Order['status']) => {
  const types = {
    pending: 'warning',
    paid: 'info',
    shipped: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return types[status]
}

// 获取状态文本
const getStatusText = (status: Order['status']) => {
  const texts = {
    pending: '待付款',
    paid: '待发货',
    shipped: '待收货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return texts[status]
}

// 获取状态描述
const getStatusDescription = (status: Order['status']) => {
  const descriptions = {
    pending: '请尽快完成支付，超时订单将自动取消',
    paid: '商家正在处理您的订单，请耐心等待',
    shipped: '商品已发出，请注意查收',
    completed: '交易已完成，感谢您的购买',
    cancelled: '订单已取消'
  }
  return descriptions[status]
}

// 计算订单总数量
const getTotalQuantity = (order: Order) => {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

// 计算订单商品总价
const getTotalPrice = (order: Order) => {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

// 计算订单实付金额
const getGrandTotal = (order: Order) => {
  return getTotalPrice(order) + (order.shippingFee || 0)
}

// 取消订单
const cancelOrder = () => {
  if (!order.value) return
  
  ElMessageBox.confirm(
    '确定要取消这个订单吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // TODO: 调用取消订单API
      order.value!.status = 'cancelled'
      ElMessage.success('订单已取消')
    } catch (error) {
      console.error('取消订单失败:', error)
      ElMessage.error('取消订单失败')
    }
  }).catch(() => {})
}

// 支付订单
const payOrder = () => {
  if (!order.value) return
  router.push(`/payment/${order.value.id}`)
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<style lang="scss" scoped>
.order-detail-page {
  padding: 40px 0;

  .page-header {
    margin-bottom: 30px;

    .page-title {
      font-size: $font-size-extra-large;
      color: $text-color-primary;
      margin: 20px 0 0;
    }
  }

  .order-detail-content {
    display: grid;
    gap: 20px;

    .status-card {
      .status-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .status-info {
          .status-desc {
            margin: 10px 0 0;
            color: $text-color-secondary;
            font-size: $font-size-small;
          }
        }

        .status-actions {
          display: flex;
          gap: 10px;
        }
      }
    }

    .info-card,
    .products-card,
    .address-card {
      .card-header {
        font-weight: 500;
        color: $text-color-primary;
      }

      .info-list {
        .info-item {
          display: flex;
          margin-bottom: 12px;

          &:last-child {
            margin-bottom: 0;
          }

          .label {
            width: 100px;
            color: $text-color-secondary;
          }

          .value {
            color: $text-color-primary;
          }
        }
      }

      .products-list {
        .product-item {
          display: flex;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid $border-color-lighter;

          &:last-child {
            border-bottom: none;
          }

          .product-image {
            width: 80px;
            height: 80px;
            border-radius: $border-radius-small;
            object-fit: cover;
          }

          .product-info {
            flex: 1;
            margin: 0 20px;

            h3 {
              margin: 0 0 8px;
              font-size: $font-size-medium;
              color: $text-color-primary;
            }

            .product-spec {
              margin: 0 0 8px;
              font-size: $font-size-small;
              color: $text-color-secondary;
            }

            .product-price {
              display: flex;
              gap: 20px;
              color: $text-color-regular;

              .price {
                font-weight: 500;
                color: $text-color-primary;
              }
            }
          }

          .product-subtotal {
            font-weight: 500;
            color: $danger-color;
            min-width: 100px;
            text-align: right;
          }
        }
      }

      .order-total {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid $border-color-light;

        .total-item {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;

          .label {
            color: $text-color-regular;
            margin-right: 20px;
          }

          .value {
            min-width: 100px;
            text-align: right;
          }

          &.grand-total {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px dashed $border-color-light;

            .label,
            .value {
              font-size: $font-size-medium;
              font-weight: 600;
              color: $danger-color;
            }
          }
        }
      }

      .address-info {
        .name-phone {
          margin: 0 0 10px;

          .name {
            font-weight: 500;
            margin-right: 20px;
          }

          .phone {
            color: $text-color-secondary;
          }
        }

        .address {
          margin: 0;
          color: $text-color-regular;
          line-height: 1.6;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .order-detail-page {
    padding: 20px 0;

    .order-detail-content {
      .status-card {
        .status-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 15px;

          .status-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      }

      .products-card {
        .products-list {
          .product-item {
            flex-wrap: wrap;

            .product-info {
              margin: 10px 0;
              width: 100%;
            }

            .product-subtotal {
              width: 100%;
              text-align: left;
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
}
</style> 