<template>
  <div class="about-page">
    <div class="about-banner">
      <h1>{{ t('about.title') }}</h1>
    </div>
    
    <div class="about-content">
      <div class="company-intro">
        <h2>公司简介</h2>
        <p>深圳禧图纸品印刷有限公司是一家集研发、生产、销售和服务于一体的专业印刷生产厂家。注册资金2180万人民币。主要生产设计OEM代加工，广告印刷、包装印刷、特种印刷、精装包装盒等产品。</p>
        <p>公司自成立至今，已经过了多次跨越式的发展,在业内有一定的实力。目前本公司已具备国际及国内多项质量认证证书，并为众多知名企业提供OEM代工服务:网易游戏，37游戏，好未来教育，洪恩教育，美泰玩具，迪士尼等企业提供配套生产各类卡牌桌面游戏。</p>
      </div>

      <div class="company-strength">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/utils/i18n'
</script>

<style lang="scss" scoped>
.about-page {
  .about-banner {
    height: 300px;
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('@/assets/images/banners/aboutUS.jpg');
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

  .about-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;

    .company-intro {
      margin-bottom: 60px;
      text-align: center;

      h2 {
        font-size: 2rem;
        margin-bottom: 20px;
        color: #333;
      }

      p {
        font-size: 1.1rem;
        line-height: 1.8;
        color: #666;
        margin-bottom: 20px;
        text-align: left;
      }
    }

    .company-strength {
      h2 {
        font-size: 2rem;
        text-align: center;
        margin-bottom: 40px;
        color: #333;
      }

      .strength-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;
        text-align: center;

        .strength-item {
          padding: 30px;
          background: #f5f5f5;
          border-radius: 8px;
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
}

@media (max-width: 768px) {
  .about-page {
    .about-content {
      .company-strength {
        .strength-grid {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}
</style> 