// 产品分类类型
export interface ProductCategory {
  id: number
  name: string
  description: string
  image: string
  products: Product[]
}

// 企业实力项类型
export interface StrengthItem {
  id: number
  icon: string
  value: string
  label: string
  color: string
}

// 新闻类型
export interface News {
  id: number
  title: string
  content: string
  date: string
  summary: string
  image?: string
}

// 产品类型
export interface Product {
  id: number
  name: string
  category: string
  description: string
  image: string
  images: string[]
  specifications: Record<string, string>
  features: string[]
  price?: number
}

// 自定义设计表单类型
export interface CustomDesignForm {
  description: string
  contact: string
  remarks?: string
}

// 语言类型
export type Language = 'zh-CN' | 'en-US'

// 用户反馈类型
export interface Feedback {
  id: number
  name: string
  content: string
  rating: number
  date: string
  avatar?: string
} 