import type { Language } from '@/types'

// 定义消息类型
type Messages = {
  [key in Language]: {
    nav: {
      home: string
      about: string
      products: string
      news: string
      contact: string
    }
    about: {
      title: string
    }
    home: {
      banner: {
        title: string
        subtitle: string
        learnMore: string
      }
      products: {
        title: string
        viewDetails: string
      }
      about: {
        title: string
        learnMore: string
      }
      strength: {
        title: string
        founded: string
        area: string
        employees: string
        experience: string
      }
    }
  }
}

// 语言包
const messages: Messages = {
  'zh-CN': {
    nav: {
      home: '首页',
      about: '关于我们',
      products: '产品中心',
      news: '新闻资讯',
      contact: '联系我们'
    },
    about: {
      title: '关于我们'
    },
    home: {
      banner: {
        title: '专业扑克牌制造商',
        subtitle: '20年专注扑克牌生产，品质保证',
        learnMore: '了解更多'
      },
      products: {
        title: '产品中心',
        viewDetails: '查看详情'
      },
      about: {
        title: '深圳禧图纸品印刷有限公司',
        learnMore: '了解更多'
      },
      strength: {
        title: '企业实力',
        founded: '成立年份',
        area: '厂房面积(㎡)',
        employees: '员工人数',
        experience: '行业经验(年)'
      }
    }
  },
  'en-US': {
    nav: {
      home: 'Home',
      about: 'About',
      products: 'Products',
      news: 'News',
      contact: 'Contact'
    },
    about: {
      title: 'About Us'
    },
    home: {
      banner: {
        title: 'Professional Playing Cards Manufacturer',
        subtitle: '20 Years of Excellence in Playing Cards Production',
        learnMore: 'Learn More'
      },
      products: {
        title: 'Products',
        viewDetails: 'View Details'
      },
      about: {
        title: 'Guangzhou Yuhua Playing Cards Co., Ltd.',
        learnMore: 'Learn More'
      },
      strength: {
        title: 'Enterprise Strength',
        founded: 'Founded Year',
        area: 'Factory Area(㎡)',
        employees: 'Employees',
        experience: 'Years Experience'
      }
    }
  }
}

// 当前语言
let currentLang: Language = 'zh-CN'

// 获取当前语言
export const getCurrentLang = (): Language => {
  return currentLang
}

// 设置语言
export const setLang = (lang: Language): void => {
  currentLang = lang
  localStorage.setItem('language', lang)
  document.documentElement.lang = lang
}

// 获取翻译文本
export const t = (key: string): string => {
  const keys = key.split('.')
  let result: any = messages[currentLang]
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k]
    } else {
      return key
    }
  }
  
  return typeof result === 'string' ? result : key
}

// 初始化语言设置
export const initLang = (): void => {
  const savedLang = localStorage.getItem('language') as Language
  if (savedLang && (savedLang === 'zh-CN' || savedLang === 'en-US')) {
    setLang(savedLang)
  } else {
    // 根据浏览器语言设置默认语言
    const browserLang = navigator.language.toLowerCase()
    setLang(browserLang.startsWith('zh') ? 'zh-CN' : 'en-US')
  }
} 