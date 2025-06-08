// types/form.ts
export interface BaseFormData {
  batchNo: string;
  applyTime: string;
  applyType: string[];
}

export interface SingleFormData {
  id: string;
  // ... 其他表单字段
}
