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
      login: string
      register: string
      logout: string
      myAccount: string
      cart: string
    }
    about: {
      title: string
      companyIntro: string
      companyHistory: string
      companyCulture: string
      companyHonor: string
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
        hotProducts: string
        newProducts: string
      }
      about: {
        title: string
        learnMore: string
        companyProfile: string
      }
      strength: {
        title: string
        founded: string
        area: string
        employees: string
        experience: string
      }
    }
    product: {
      title: string
      category: string
      price: string
      addToCart: string
      buyNow: string
      description: string
      specifications: string
      relatedProducts: string
    }
    cart: {
      title: string
      empty: string
      total: string
      checkout: string
      continueShopping: string
      remove: string
      quantity: string
    }
    user: {
      login: string
      register: string
      username: string
      password: string
      confirmPassword: string
      email: string
      phone: string
      forgotPassword: string
      rememberMe: string
    }
    common: {
      loading: string
      success: string
      error: string
      confirm: string
      cancel: string
      save: string
      delete: string
      edit: string
      search: string
      filter: string
      sort: string
      more: string
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
      contact: '联系我们',
      login: '登录',
      register: '注册',
      logout: '退出',
      myAccount: '我的账户',
      cart: '购物车'
    },
    about: {
      title: '关于我们',
      companyIntro: '公司简介',
      companyHistory: '发展历程',
      companyCulture: '企业文化',
      companyHonor: '企业荣誉'
    },
    home: {
      banner: {
        title: '专业扑克牌制造商',
        subtitle: '20年专注扑克牌生产，品质保证',
        learnMore: '了解更多'
      },
      products: {
        title: '产品中心',
        viewDetails: '查看详情',
        hotProducts: '热门产品',
        newProducts: '新品上市'
      },
      about: {
        title: '深圳禧图纸品印刷有限公司',
        learnMore: '了解更多',
        companyProfile: '公司简介'
      },
      strength: {
        title: '企业实力',
        founded: '成立年份',
        area: '厂房面积(㎡)',
        employees: '员工人数',
        experience: '行业经验(年)'
      }
    },
    product: {
      title: '产品详情',
      category: '产品分类',
      price: '价格',
      addToCart: '加入购物车',
      buyNow: '立即购买',
      description: '产品描述',
      specifications: '产品规格',
      relatedProducts: '相关产品'
    },
    cart: {
      title: '购物车',
      empty: '购物车是空的',
      total: '总计',
      checkout: '结算',
      continueShopping: '继续购物',
      remove: '删除',
      quantity: '数量'
    },
    user: {
      login: '登录',
      register: '注册',
      username: '用户名',
      password: '密码',
      confirmPassword: '确认密码',
      email: '邮箱',
      phone: '手机号',
      forgotPassword: '忘记密码',
      rememberMe: '记住我'
    },
    common: {
      loading: '加载中',
      success: '成功',
      error: '错误',
      confirm: '确认',
      cancel: '取消',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      search: '搜索',
      filter: '筛选',
      sort: '排序',
      more: '更多'
    }
  },
  'en-US': {
    nav: {
      home: 'Home',
      about: 'About',
      products: 'Products',
      news: 'News',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      myAccount: 'My Account',
      cart: 'Cart'
    },
    about: {
      title: 'About Us',
      companyIntro: 'Company Profile',
      companyHistory: 'History',
      companyCulture: 'Culture',
      companyHonor: 'Honors'
    },
    home: {
      banner: {
        title: 'Professional Playing Cards Manufacturer',
        subtitle: '20 Years of Excellence in Playing Cards Production',
        learnMore: 'Learn More'
      },
      products: {
        title: 'Products',
        viewDetails: 'View Details',
        hotProducts: 'Hot Products',
        newProducts: 'New Arrivals'
      },
      about: {
        title: 'Shenzhen Xitu Playing Cards Co., Ltd.',
        learnMore: 'Learn More',
        companyProfile: 'Company Profile'
      },
      strength: {
        title: 'Enterprise Strength',
        founded: 'Founded Year',
        area: 'Factory Area(㎡)',
        employees: 'Employees',
        experience: 'Years Experience'
      }
    },
    product: {
      title: 'Product Details',
      category: 'Category',
      price: 'Price',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      description: 'Description',
      specifications: 'Specifications',
      relatedProducts: 'Related Products'
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      total: 'Total',
      checkout: 'Checkout',
      continueShopping: 'Continue Shopping',
      remove: 'Remove',
      quantity: 'Quantity'
    },
    user: {
      login: 'Login',
      register: 'Register',
      username: 'Username',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      email: 'Email',
      phone: 'Phone',
      forgotPassword: 'Forgot Password',
      rememberMe: 'Remember Me'
    },
    common: {
      loading: 'Loading',
      success: 'Success',
      error: 'Error',
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      more: 'More'
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
  //console.log('Setting language in i18n:', lang) // 添加调试日志
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