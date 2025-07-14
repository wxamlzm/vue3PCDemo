<template>
  <a-input
    v-model:value="displayValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @keydown="handleKeyDown"
    @compositionstart="handleCompositionStart"
    @compositionend="handleCompositionEnd"
    @blur="handleBlur"
    @paste="handlePaste"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';

interface Props {
  modelValue?: number | string | null;
  pattern?: RegExp;
  placeholder?: string;
  disabled?: boolean;
  autoToNumber?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  pattern: undefined,
  placeholder: undefined,
  disabled: false,
  autoToNumber: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string | null): void;
  (e: 'change', value: number | string | null): void;
}>();

const displayValue = ref<string>('');
const isComposing = ref<boolean>(false);

// 初始化显示值
watch(() => props.modelValue, (newVal) => {
  if (newVal !== parseFloat(displayValue.value)) {
    displayValue.value = newVal !== null && newVal !== undefined ? String(newVal) : '';
  }
}, { immediate: true });

// 处理键盘输入
const handleKeyDown = (e: KeyboardEvent) => {
  // 没有设置 pattern 或者处于中文输入状态时不限制
  if (!props.pattern || isComposing.value) return;

  const { key } = e;
  const currentValue = displayValue.value;
  const target = e.target as HTMLInputElement;
  const selectionStart = target.selectionStart ?? 0;
  const selectionEnd = target.selectionEnd ?? 0;
  
  // 允许的功能键
  const allowedKeys = [
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
    'Tab', 'Home', 'End'
  ];
  
  if (allowedKeys.includes(key)) {
    return;
  }
  
  // 模拟输入后的值
  const newValue = 
    currentValue.slice(0, selectionStart) + 
    key + 
    currentValue.slice(selectionEnd);
  
  // 验证新值
  if (props.pattern && !props.pattern.test(newValue)) {
    e.preventDefault();
    // 震动反馈
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }
};

// 处理中文输入法
const handleCompositionStart = (e: CompositionEvent) => {
  isComposing.value = true;
};

const handleCompositionEnd = (e: CompositionEvent) => {
  isComposing.value = false;
  const target = e.target as HTMLInputElement;
  // 只有设置了 pattern 才验证
  if (props.pattern && !props.pattern.test(target.value)) {
    displayValue.value = String(props.modelValue || '');
    message.warning('输入内容不符合格式要求');
  }
};

// 处理粘贴
const handlePaste = (e: ClipboardEvent) => {
  // 没有设置 pattern 时不限制
  if (!props.pattern) return;
  
  e.preventDefault();
  const pasteData = e.clipboardData?.getData('text/plain') ?? '';
  const target = e.target as HTMLInputElement;
  const currentValue = target.value;
  const selectionStart = target.selectionStart ?? 0;
  const selectionEnd = target.selectionEnd ?? 0;
  
  const newValue = 
    currentValue.slice(0, selectionStart) + 
    pasteData + 
    currentValue.slice(selectionEnd);
  
  if (props.pattern.test(newValue)) {
    displayValue.value = newValue;
    updateValue(newValue);
  } else {
    message.warning('粘贴内容不符合格式要求');
  }
};

// 处理失焦
const handleBlur = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const value = target.value;
  
  // 处理空值
  if (value === '') {
    emit('update:modelValue', null);
    emit('change', null);
    return;
  }
  
  updateValue(value);
};

// 更新值
const updateValue = (value: string) => {
  let newValue: string | number | null = value;
  
  if (props.autoToNumber && value !== '' && !isNaN(Number(value))) {
    newValue = Number(value);
  } else if (value === '') {
    newValue = null;
  }
  
  if (newValue !== props.modelValue) {
    emit('update:modelValue', newValue);
    emit('change', newValue);
  }
};
</script>