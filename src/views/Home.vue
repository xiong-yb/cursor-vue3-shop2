<template>
  <div class="home-page">
    <!-- Banner Section -->
    <div class="banner">
      <el-carousel :interval="5000" height="600px" indicator-position="outside" :arrow="'always'" class="banner-carousel">
        <el-carousel-item v-for="(item, index) in bannerItems" :key="index">
          <div class="banner-content" :style="{ backgroundImage: `url(${item.image})` }">
            <div class="banner-overlay">
              <h1>{{ item.title }}</h1>
              <p>{{ item.subtitle }}</p>
              <el-button type="primary" size="large">{{ t('home.banner.learnMore') }}</el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- Products Section -->
    <div class="products-section">
      <div class="container">
        <h2>{{ t('home.products.title') }}</h2>
        <div class="products-grid">
          <div v-for="category in productCategories" :key="category.id" class="product-card">
            <el-image :src="category.image" fit="cover" />
            <h3>{{ category.name }}</h3>
            <p>{{ category.description }}</p>
            <el-button 
              type="primary" 
              plain
              @click="goToCategory(category.id)"
            >
              {{ t('home.products.viewDetails') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- About Section -->
    <div class="about-section">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2>{{ t('home.about.title') }}</h2>
            <p>深圳禧图纸品印刷有限公司是一家集研发、生产、销售和服务于一体的专业印刷生产厂家。注册资金2180万人民币。</p>
            <el-button type="primary">{{ t('home.about.learnMore') }}</el-button>
          </div>
          <div class="about-image">
            <el-image :src="companyImg" fit="cover" />
          </div>
        </div>
      </div>
    </div>

    <!-- Strength Section -->
    <div class="strength-section">
      <div class="container">
        <h2>{{ t('home.strength.title') }}</h2>
        <div class="strength-grid">
          <div class="strength-item">
            <h3>2014</h3>
            <p>{{ t('home.strength.founded') }}</p>
          </div>
          <div class="strength-item">
            <h3>10000</h3>
            <p>{{ t('home.strength.area') }}</p>
          </div>
          <div class="strength-item">
            <h3>150</h3>
            <p>{{ t('home.strength.employees') }}</p>
          </div>
          <div class="strength-item">
            <h3>20</h3>
            <p>{{ t('home.strength.experience') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '@/utils/i18n'
import type { ProductCategory } from '@/types'
import playingCardsImg from '@/assets/images/products/card01.jpg'
import boardGamesImg from '@/assets/images/products/card02.png'
import tarotImg from '@/assets/images/products/card03.jpg'
import flashCardsImg from '@/assets/images/products/card04.jpg'
import companyImg from '@/assets/images/company/company.png'
import banner01 from '@/assets/images/banners/banner01.jpg'
import tarot from '@/assets/images/banners/tarot.jpg'
import custom from '@/assets/images/banners/custom.jpg'

const router = useRouter()

const bannerItems = ref([
  {
    title: '专业扑克牌制造商',
    subtitle: '20年专注扑克牌生产，品质保证',
    image: tarot
  },
  {
    title: '定制化服务',
    subtitle: '为您提供专业的定制化印刷解决方案',
    image: custom
  },
  {
    title: '品质保证',
    subtitle: '采用先进设备，确保每一张卡牌都完美呈现',
    image: banner01
  }
])

const productCategories = ref<ProductCategory[]>([
  {
    id: 1,
    name: '扑克牌',
    description: '专业定制各类扑克牌，包括广告扑克、塑料扑克、魔术扑克等',
    image: playingCardsImg,
    products: []
  },
  {
    id: 2,
    name: '桌游卡牌',
    description: '提供各类桌游卡牌定制服务，包括TCG卡牌、游戏卡牌等',
    image: boardGamesImg,
    products: []
  },
  {
    id: 3,
    name: '塔罗牌',
    description: '专业塔罗牌定制，精美印刷，品质保证',
    image: tarotImg,
    products: []
  },
  {
    id: 4,
    name: '闪卡',
    description: '各类闪卡定制，包括教育闪卡、收藏闪卡等',
    image: flashCardsImg,
    products: []
  }
])

// 跳转到对应产品分类
const goToCategory = (categoryId: number) => {
  router.push({
    path: '/products',
    query: { category: categoryId.toString() }
  })
}
</script>

<style lang="scss" scoped>
.home-page {
  .banner {
    position: relative;
    margin: 0;
    padding: 0;

    .banner-carousel {
      :deep(.el-carousel__container) {
        height: 600px;
      }

      :deep(.el-carousel__item) {
        .banner-content {
          height: 100%;
          background-size: cover;
          background-position: center;
          position: relative;
          transition: all 0.3s ease;

          .banner-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: rgba(0, 0, 0, 0);
            transition: all 0.3s ease;
            opacity: 0;

            h1 {
              color: #fff;
              font-size: 3rem;
              margin: 0 0 20px;
              text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
              transform: translateY(20px);
              transition: all 0.3s ease;
            }

            p {
              color: #fff;
              font-size: 1.5rem;
              margin: 0 0 30px;
              text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
              transform: translateY(20px);
              transition: all 0.3s ease;
            }

            .el-button {
              transform: translateY(20px);
              transition: all 0.3s ease;
            }
          }

          &:hover {
            .banner-overlay {
              background: rgba(0, 0, 0, 0.5);
              opacity: 1;

              h1, p, .el-button {
                transform: translateY(0);
              }
            }
          }
        }
      }

      :deep(.el-carousel__indicators) {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        margin: 0;
        padding: 0;
        z-index: 2;
      }

      :deep(.el-carousel__arrow) {
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        width: 44px;
        height: 44px;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.5);
        }
      }

      :deep(.el-carousel__indicators--outside) {
        .el-carousel__button {
          width: 30px;
          height: 3px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 3px;
        }

        .is-active .el-carousel__button {
          background-color: #fff;
        }
      }
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .products-section {
    padding: 80px 0;
    background: #f5f5f5;
    margin: 0;

    h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 40px;
      color: #333;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;

      .product-card {
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s;

        &:hover {
          transform: translateY(-5px);
        }

        .el-image {
          width: 100%;
          height: 200px;
        }

        h3 {
          padding: 20px 20px 10px;
          margin: 0;
          font-size: 1.5rem;
          color: #333;
        }

        p {
          padding: 0 20px 20px;
          margin: 0;
          color: #666;
          line-height: 1.6;
        }

        .el-button {
          margin: 0 20px 20px;
        }
      }
    }
  }

  .about-section {
    padding: 80px 0;

    .about-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;

      .about-text {
        h2 {
          font-size: 2.5rem;
          margin-bottom: 20px;
          color: #333;
        }

        p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #666;
          margin-bottom: 30px;
        }
      }

      .about-image {
        .el-image {
          width: 100%;
          height: 400px;
          border-radius: 8px;
        }
      }
    }
  }

  .strength-section {
    padding: 80px 0;
    background: #f5f5f5;

    h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 40px;
      color: #333;
    }

    .strength-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 30px;

      .strength-item {
        background: #fff;
        padding: 30px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s;

        &:hover {
          transform: translateY(-5px);
        }

        h3 {
          font-size: 2.5rem;
          color: #409EFF;
          margin: 0 0 10px;
        }

        p {
          font-size: 1.1rem;
          color: #666;
          margin: 0;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .home-page {
    .banner {
      height: 400px;

      .banner-content {
        h1 {
          font-size: 2rem;
        }

        p {
          font-size: 1.2rem;
        }
      }
    }

    .about-section {
      .about-content {
        grid-template-columns: 1fr;
      }
    }

    .strength-section {
      .strength-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}

@media (max-width: 480px) {
  .home-page {
    .strength-section {
      .strength-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style> 