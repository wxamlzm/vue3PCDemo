<template>
  <a-form-item :rules="rules" :name="name" :label="label">
    <a-upload-dragger
      :fileList="fileList"
      name="file"
      listType="text"
      accept=".doc,.docx,.pdf"
      :max-count="1"
      :before-upload="onBeforeUpload"
      @update:file-list="uploadFile"
    >
    </a-upload-dragger>
  </a-form-item>
</template>

<script lang="ts" setup>
import { message, Upload, type UploadProps } from 'ant-design-vue'

interface IUploadDragger {
  rules: any
  fileList: any
  name: string
  label: string
}

const props = withDefaults(defineProps<IUploadDragger>(), {
  name: 'fileList',
  label: '上传文件'
})
const emit = defineEmits<{ 'update:fileList' }>()

const allowedFileTypes = ['.doc', '.docx', '.pdf']

const onBeforeUpload: UploadProps['beforeUpload'] = file => {
  // 获取文件扩展名
  const fileExt = '.' + file.name.split('.').pop()?.toLocaleLowerCase()

  if (!allowedFileTypes.includes(fileExt)) {
    message.error()
    return Upload.LIST_IGNORE
  }

  const isLimit10M = file.size / 1024 / 1024 < 10
  if (!isLimit10M) {
    message.error('')
    return Upload.LIST_IGNORE
  }

  return false
}

const uploadFile = val => {
  emit('update:fileList', val)
}
</script>
