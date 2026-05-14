<template>
  <el-form ref="ruleFormRef" :model="formData">
   <el-row :gutter="24">
     <template v-for="item in formItemAttrs" :key="item.props">
     <el-col v-bind="item.col">
      <el-form-item :label="item.label" :prop="item.props">
       <component :is="isComp(item.comp)" v-model="formData[item.props]" :placeholder="item.placeholder">
         <template v-if="item.comp==='select'">
          <el-option label="全部" value=""></el-option>
           <el-option v-for="option in item.options" :label="option.label" :value="option.value" :key="option.value"></el-option>
         </template>
       </component>
     </el-form-item>
    </el-col>

    </template> 
   </el-row>
   <el-row>
     <el-button type="primary" @click="handleSearch">查询</el-button>
     <el-button  @click="handleReset(ruleFormRef)">重置</el-button>
   </el-row>
  </el-form>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { ElInput, ElSelect, ElOption } from 'element-plus'


const props = defineProps({
  formItem: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['search'])

const formItemAttrs = computed(() => {
  const {formItem} = props
  formItem.forEach(item => {
    item.col= {xs:24,sm:12,md:8,lg:6,xl:6}
  })
  return formItem
})

//表单数据
const ruleFormRef = ref()
const formData = reactive({})
const isComp = (comp) => {
  return {
    input: ElInput,
    select: ElSelect
  }[comp]
}

const handleSearch = () => {
  emit('search',formData)
}

const handleReset = (formEl) => {
  if(!formEl) return
  formEl.resetFields()
  emit('search',formData)
}
</script>