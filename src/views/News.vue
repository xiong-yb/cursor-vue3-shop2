<template>
  <div class="news-page">
    <div class="news-banner">
      <h1>{{ t('nav.news') }}</h1>
    </div>

    <div class="container">
      <div class="news-content">
        <!-- 新闻分类 -->
        <div class="news-categories">
          <el-tabs v-model="activeCategory" @tab-click="handleCategoryChange">
            <el-tab-pane label="公司新闻" name="company">
              <div class="news-list">
                <div v-for="news in companyNews" :key="news.id" class="news-item">
                  <el-image :src="news.image" fit="cover" class="news-image" />
                  <div class="news-info">
                    <h3>{{ news.title }}</h3>
                    <p class="news-date">{{ news.date }}</p>
                    <p class="news-summary">{{ news.summary }}</p>
                    <el-button type="primary" @click="showNewsDetail(news)">
                      查看详情
                    </el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="行业资讯" name="industry">
              <div class="news-list">
                <div v-for="news in industryNews" :key="news.id" class="news-item">
                  <el-image :src="news.image" fit="cover" class="news-image" />
                  <div class="news-info">
                    <h3>{{ news.title }}</h3>
                    <p class="news-date">{{ news.date }}</p>
                    <p class="news-summary">{{ news.summary }}</p>
                    <el-button type="primary" @click="showNewsDetail(news)">
                      查看详情
                    </el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 新闻详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="selectedNews?.title"
      width="800px"
      class="news-dialog"
    >
      <div v-if="selectedNews" class="news-detail">
        <el-image :src="selectedNews.image" fit="cover" class="news-detail-image" />
        <div class="news-detail-content">
          <p class="news-detail-date">{{ selectedNews.date }}</p>
          <div class="news-detail-text" v-html="selectedNews.content"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { t } from '@/utils/i18n'
import type { News } from '@/types'
import newsImage1 from '@/assets/images/news/active01.jpg'
import newsImage2 from '@/assets/images/news/active02.jpg'

const activeCategory = ref('company')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const dialogVisible = ref(false)
const selectedNews = ref<News | null>(null)

// 模拟公司新闻数据
const companyNews = ref<News[]>([
  {
    id: 1,
    title: '禧图印刷荣获"2023年度优秀企业"称号',
    date: '2023-12-20',
    summary: '近日，深圳禧图纸品印刷有限公司凭借优异的产品质量和良好的市场表现，荣获"2023年度优秀企业"称号。这是对公司多年来坚持品质、创新发展的肯定。',
    image: newsImage1,
    content: `
      <p>近日，深圳禧图纸品印刷有限公司凭借优异的产品质量和良好的市场表现，荣获"2023年度优秀企业"称号。这是对公司多年来坚持品质、创新发展的肯定。</p>
      <p>作为专业的印刷制造商，禧图印刷始终坚持"质量第一、客户至上"的经营理念，不断引进先进设备，提升生产工艺，为客户提供高品质的产品和服务。</p>
      <p>此次获奖，不仅是对公司过去一年工作的肯定，更是对全体员工辛勤付出的认可。未来，禧图印刷将继续秉持工匠精神，为客户提供更优质的产品和服务。</p>
    `
  },
  {
    id: 2,
    title: '禧图印刷参加2023深圳国际印刷展',
    date: '2023-11-15',
    summary: '2023年11月，禧图印刷参加了在深圳举办的国际印刷展，展示了最新的印刷技术和产品。',
    image: newsImage2,
    content: `
      <p>2023年11月，禧图印刷参加了在深圳举办的国际印刷展，展示了最新的印刷技术和产品。</p>
      <p>展会期间，公司展示了包括广告印刷、包装印刷、特种印刷等多个系列产品，吸引了众多国内外客户的关注。</p>
      <p>通过此次展会，禧图印刷不仅展示了自身的技术实力，也与行业同仁进行了深入交流，为未来的发展积累了宝贵的经验。</p>
    `
  }
])

// 模拟行业资讯数据
const industryNews = ref<News[]>([
  {
    id: 3,
    title: '2024年扑克牌行业发展趋势分析',
    date: '2024-01-10',
    summary: '随着人们生活水平的提高和娱乐方式的多样化，扑克牌行业呈现出新的发展趋势。本文将分析2024年扑克牌行业的发展机遇与挑战。',
    image: '/src/assets/images/news/industry-trend.jpg',
    content: `
      <p>随着人们生活水平的提高和娱乐方式的多样化，扑克牌行业呈现出新的发展趋势。本文将分析2024年扑克牌行业的发展机遇与挑战。</p>
      <p>1. 个性化定制需求增加</p>
      <p>随着消费者对个性化产品的追求，定制化扑克牌的需求不断增长。企业需要提升设计能力和生产工艺，满足客户的个性化需求。</p>
      <p>2. 环保材料应用</p>
      <p>环保意识的提升促使企业采用更环保的材料和生产工艺。可降解材料、环保油墨等新材料的应用将成为行业发展趋势。</p>
      <p>3. 智能化生产</p>
      <p>智能制造技术的应用将提高生产效率，降低生产成本。企业需要加快数字化转型，提升智能化水平。</p>
    `
  }
])

const handleCategoryChange = (tab: any) => {
  activeCategory.value = tab.props.name
  currentPage.value = 1
  // 这里应该根据分类重新加载数据
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // 重新加载数据
}

const showNewsDetail = (news: News) => {
  selectedNews.value = news
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.news-page {
  .news-banner {
    height: 300px;
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('@/assets/images/banners/bannerNEWS.jpg');
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

  .news-content {
    padding: 60px 0;

    .news-categories {
      :deep(.el-tabs__nav-wrap) {
        justify-content: center;
        margin-bottom: 40px;
      }

      .news-list {
        .news-item {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 30px;
          margin-bottom: 40px;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;

          &:hover {
            transform: translateY(-5px);
          }

          .news-image {
            width: 100%;
            height: 200px;
          }

          .news-info {
            padding: 20px;

            h3 {
              font-size: 1.5rem;
              margin: 0 0 10px;
              color: #333;
            }

            .news-date {
              color: #999;
              font-size: 0.9rem;
              margin-bottom: 10px;
            }

            .news-summary {
              color: #666;
              line-height: 1.6;
              margin-bottom: 20px;
            }
          }
        }
      }
    }

    .pagination {
      margin-top: 40px;
      display: flex;
      justify-content: center;
    }
  }
}

.news-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
  }

  .news-detail {
    .news-detail-image {
      width: 100%;
      height: 400px;
    }

    .news-detail-content {
      padding: 20px;

      .news-detail-date {
        color: #999;
        font-size: 0.9rem;
        margin-bottom: 20px;
      }

      .news-detail-text {
        color: #666;
        line-height: 1.8;
        font-size: 1.1rem;

        p {
          margin-bottom: 15px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .news-page {
    .news-banner {
      height: 200px;

      h1 {
        font-size: 2rem;
      }
    }

    .news-content {
      .news-categories {
        .news-list {
          .news-item {
            grid-template-columns: 1fr;

            .news-image {
              height: 200px;
            }
          }
        }
      }
    }
  }
}
</style> 