<template>
  <div class="orders-page">
    <div class="container">
      <h1 class="page-title">我的订单</h1>
      
      <div class="orders-content">
        <el-tabs v-model="activeTab" class="order-tabs">
          <el-tab-pane label="全部订单" name="all" />
          <el-tab-pane label="待付款" name="pending" />
          <el-tab-pane label="待发货" name="paid" />
          <el-tab-pane label="待收货" name="shipped" />
          <el-tab-pane label="已完成" name="completed" />
        </el-tabs>

        <div class="order-list">
          <el-card v-for="order in filteredOrders" :key="order.id" class="order-card">
            <div class="order-header">
              <div class="order-info">
                <span class="order-id">订单号：{{ order.orderNo }}</span>
                <span class="order-date">{{ order.createTime }}</span>
              </div>
              <el-tag :type="getStatusType(order.status)">
                {{ getStatusText(order.status) }}
              </el-tag>
            </div>

            <div class="order-items">
              <div v-for="item in order.items" :key="item.id" class="order-item">
                <el-image :src="item.image" :alt="item.name" class="item-image" />
                <div class="item-info">
                  <h3>{{ item.name }}</h3>
                  <p class="item-spec">{{ item.spec }}</p>
                  <p class="item-price">
                    <span class="price">¥{{ item.price.toFixed(2) }}</span>
                    <span class="quantity">x{{ item.quantity }}</span>
                  </p>
                </div>
              </div>
            </div>

            <div class="order-footer">
              <div class="order-total">
                共 {{ getTotalQuantity(order) }} 件商品
                合计：<span class="total-price">¥{{ getTotalPrice(order).toFixed(2) }}</span>
              </div>
              <div class="order-actions">
                <template v-if="order.status === 'pending'">
                  <el-button @click="cancelOrder(order)">取消订单</el-button>
                  <el-button type="primary" @click="payOrder(order)">立即付款</el-button>
                </template>
                <template v-else-if="order.status === 'shipped'">
                  <el-button type="primary" @click="confirmReceive(order)">确认收货</el-button>
                </template>
                <template v-else-if="order.status === 'completed'">
                  <el-button @click="viewOrderDetail(order)">查看详情</el-button>
                  <el-button type="primary" @click="buyAgain()">再次购买</el-button>
                </template>
              </div>
            </div>
          </el-card>

          <el-empty
            v-if="filteredOrders.length === 0"
            description="暂无订单"
          >
            <el-button type="primary" @click="$router.push('/products')">
              去购物
            </el-button>
          </el-empty>
        </div>

        <div class="pagination-container" v-if="filteredOrders.length > 0">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

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
  items: OrderItem[]
}

// 模拟订单数据
const orders = ref<Order[]>([
  {
    id: 1,
    orderNo: 'MP202403150001',
    status: 'pending',
    createTime: '2024-03-15 10:30:00',
    items: [
      {
        id: 1,
        name: '扑克牌A',
        spec: '标准版',
        price: 29.9,
        quantity: 1,
        image: '/src/assets/images/product1.jpg'
      }
    ]
  },
  {
    id: 2,
    orderNo: 'MP202403140001',
    status: 'shipped',
    createTime: '2024-03-14 15:20:00',
    items: [
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
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 标签页
const activeTab = ref('all')

// 根据标签页筛选订单
const filteredOrders = computed(() => {
  if (activeTab.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === activeTab.value)
})

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

// 计算订单总数量
const getTotalQuantity = (order: Order) => {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

// 计算订单总价
const getTotalPrice = (order: Order) => {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

// 取消订单
const cancelOrder = (order: Order) => {
  ElMessageBox.confirm(
    '确定要取消这个订单吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用取消订单API
    order.status = 'cancelled'
    ElMessage.success('订单已取消')
  }).catch(() => {})
}

// 支付订单
const payOrder = (order: Order) => {
  // TODO: 调用支付API
  router.push(`/payment/${order.id}`)
}

// 确认收货
const confirmReceive = (order: Order) => {
  ElMessageBox.confirm(
    '确认已收到商品？',
    '提示',
    {
      confirmButtonText: '确认收货',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    // TODO: 调用确认收货API
    order.status = 'completed'
    ElMessage.success('确认收货成功')
  }).catch(() => {})
}

// 查看订单详情
const router = useRouter()
const viewOrderDetail = (order: Order) => {
  router.push(`/orders/${order.id}`)
}

// 再次购买
const buyAgain = () => {
  // TODO: 调用再次购买API
  router.push('/cart')
}

// 处理分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // TODO: 重新加载数据
}
</script>

<style lang="scss" scoped>
.orders-page {
  padding: 40px 0;

  .page-title {
    font-size: $font-size-extra-large;
    color: $text-color-primary;
    margin-bottom: 30px;
  }

  .orders-content {
    background: #fff;
    border-radius: $border-radius-base;
    box-shadow: $box-shadow-light;
    padding: 20px;

    .order-tabs {
      margin-bottom: 20px;
    }

    .order-card {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 15px;
        border-bottom: 1px solid $border-color-light;

        .order-info {
          .order-id {
            font-weight: 500;
            color: $text-color-primary;
            margin-right: 20px;
          }

          .order-date {
            color: $text-color-secondary;
            font-size: $font-size-small;
          }
        }
      }

      .order-items {
        padding: 20px 0;

        .order-item {
          display: flex;
          gap: 15px;
          padding: 10px 0;

          &:not(:last-child) {
            border-bottom: 1px solid $border-color-lighter;
          }

          .item-image {
            width: 80px;
            height: 80px;
            border-radius: $border-radius-small;
            object-fit: cover;
          }

          .item-info {
            flex: 1;

            h3 {
              margin: 0 0 8px;
              font-size: $font-size-medium;
              color: $text-color-primary;
            }

            .item-spec {
              margin: 0 0 8px;
              font-size: $font-size-small;
              color: $text-color-secondary;
            }

            .item-price {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .price {
                font-weight: 500;
                color: $text-color-primary;
              }

              .quantity {
                color: $text-color-secondary;
              }
            }
          }
        }
      }

      .order-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 15px;
        border-top: 1px solid $border-color-light;

        .order-total {
          color: $text-color-regular;

          .total-price {
            font-size: $font-size-medium;
            font-weight: 600;
            color: $danger-color;
          }
        }

        .order-actions {
          display: flex;
          gap: 10px;
        }
      }
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .orders-page {
    padding: 20px 0;

    .orders-content {
      padding: 15px;

      .order-card {
        .order-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }

        .order-footer {
          flex-direction: column;
          gap: 15px;

          .order-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      }
    }
  }
}
</style> 