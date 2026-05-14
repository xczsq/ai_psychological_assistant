<template>
    <el-dialog :title="isEdit ? '编辑文章' : '新增文章'" v-model="dialogVisible" width="50%" @close="handleClose">
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="formData.categoryId" placeholder="请选择分类">
            <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章摘要" prop="summary">
          <el-input type="textarea" v-model="formData.summary" placeholder="请输入摘要(可选)" maxlength="1000" show-word-limit :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select v-model="formData.tagArray" placeholder="请输入标签(可选)" multiple filterable allow-create style="width: 100%">
              <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>
        <el-form-item label="封面图片">
              <div class="cover-uploads">
                <el-upload
                  class="avatar-uploader"
                  action="#"
                  :before-upload="beforeUpload"
                  :http-request="handleUploadRequest"
                  :show-file-list="false"
                  accept="image/*"
                  >
                  <div v-if="!imgUrl" class="cover-placeholder">
                       <p>点击上传封面</p>
                  </div>
                  <img v-else :src="imgUrl" alt="封面图片" class="cover-image">
                </el-upload>
                <div v-if="imgUrl" class="cover-remove">
                  <el-button type="danger" size="mini" @click="handleRemove">移除封面</el-button>
                </div>
              </div>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <RichTextEditor 
          v-model="formData.content" 
          placeholder="请输入文章内容"
          :maxCharCount="5000"
          @change="handleContentChange"
          @created="handleEditorCreated"
          min-height="400px"
           />
        </el-form-item>
      </el-form>
      <div v-if="btnPreview">
        <h2>预览</h2>
        <div v-html="formData.content"></div>
      </div>
      <template #footer>
           <el-button type="primary" @click="btnPreview = !btnPreview">{{ btnPreview ? '取消预览' : '预览' }}</el-button>
            <el-button type="primary" @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSubmit()" :loading="loading">{{ isEdit ? '更新' : '创建' }}文章</el-button>
      </template>
    </el-dialog>
</template>
<script setup>
import { ref,computed,reactive,nextTick,watch } from 'vue'
import { ElDialog,ElMessage } from 'element-plus'
import { uploadFile,createArticle,updateArticle } from '@/api/admin'
import { fileBaseUrl } from '@/config/index'
import RichTextEditor from '@/components/RichTextEditor.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: () => []
  },
  article: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue','success'])

//监听编辑数据
watch(()=>props.article,(newVal)=>{
     if(newVal){
      nextTick(()=>{
          Object.assign(formData,newVal)
          businessId.value = newVal.id
          imgUrl.value = fileBaseUrl + newVal.coverImage
      })
     }
})
const dialogVisible = computed({
  get(){
    return props.modelValue
  },
  set(val){
    emit('update:modelValue', val)
  }
})
const handleClose = () => {
  formRef.value.resetFields()
  businessId.value = null
  formData.tagArray = []
  handleRemove()
  emit('update:modelValue', false)
}

const isEdit = computed(() => !!props.article?.id)

const formRef = ref()

//表单数据
const formData =reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": 1,
    "summary": "",
    "tags": "",
    "tagArray": [],
    "id": ""
})

const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { max: 100, message: '文章标题最多100个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { max: 5000, message: '文章内容最多5000个字符', trigger: 'blur' }
  ]
})

const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]

//上传
const imgUrl = ref('')
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5MB = file.size / 1024 / 1024 < 5
  if(!isImage){
    ElMessage.error('请上传图片文件')
    return false
  }
  if(!isLt5MB){
    ElMessage.error('图片大小不能超过5MB')
    return false
  }
  return true
}
const businessId = ref(null)
//上传请求
const handleUploadRequest = async ({file}) => {
   businessId.value = crypto.randomUUID()

   const fileRes = await uploadFile(file,{
    businessId:businessId.value,
  })
  imgUrl.value = fileBaseUrl + fileRes.filePath
  formData.coverImage = fileRes.filePath
}
//移除封面
const handleRemove = () => {
  imgUrl.value = ''
  formData.coverImage = ''
}
//文章内容改变
const handleContentChange = (data) => {
  formData.content = data.html
}
//编辑器创建
const editorInstance=ref(null)
const handleEditorCreated = (editor) => {
   editorInstance.value = editor
   if(formData.content && editor){
       nextTick(() => {
       editor.setHtml(formData.content)
     })
   }
}

const btnPreview = ref(false)

//提交

const loading = ref(false)
const handleSubmit = () => {
   formRef.value.validate((valid,fields)=>{
     if(valid){
        loading.value = true
     }
     const submitData={
       ...formData,
       tags: formData.tagArray.join(',')
     }
     delete submitData.tagArray
      
     if(!isEdit.value){
       submitData.id = businessId.value
       createArticle(submitData).then(res=>{
          loading.value = false
          emit('success')
        })
     }else{
        updateArticle(props.article.id,submitData).then(res=>{
          loading.value = false
          emit('success')
        })
     }    
  }) 
}
</script>
<style lang="scss" scoped>
.cover-uploads{
  display: flex;
  align-items: flex-end;
  gap: 10px;
  color: #909399;
}

.avatar-uploader{
  width: 200px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  overflow: hidden;
  :deep(.el-upload) {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.cover-image{
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.cover-remove{
  flex-shrink: 0;
}
</style>