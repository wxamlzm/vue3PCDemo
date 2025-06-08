export interface User {
  id: number
  name: string
  email: string
  age: number
}

export interface DialogFormData {
  name: string
  email: string
  age: number | ''
}

// 定义资源通用接口
export interface Resource {
  name: string
  email: string
  age: number | ''
  type: string
  status: string | number
  createTime: string
  updateTime: string
  [key: string]: any
}

// 定义查询参数接口
export interface QueryParams {
  keyword?: string
  status?: string
  type?: string
  pageSize: number
  current: number
  [key: string]: any
}

export interface Developer {
  key: string
  developerId: string
  permissions: string[]
}

export interface FormState {
  groupId: string
  projectName: string
  gitlabIdentifier: string
  status: boolean
  createDevBranch: boolean
  createMainBranch: boolean
  developers: Developer[]
  remarks: string
}
