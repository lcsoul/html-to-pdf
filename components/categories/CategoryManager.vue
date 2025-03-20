<template>
  <Modal v-model="isVisible" @update:modelValue="$emit('update:visible', $event)">
    <template #title>分类管理</template>
    <template #content>
      <div class="space-y-4">
        <div class="flex justify-end">
          <button
            @click="showForm = true"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            添加分类
          </button>
        </div>

        <!-- 分类列表 -->
        <div class="space-y-2">
          <div v-for="category in categories" :key="category.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <span class="text-gray-900">{{ category.name }}</span>
              <span class="text-sm text-gray-500">(排序: {{ category.order_index }})</span>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="editCategory(category)"
                class="text-gray-600 hover:text-gray-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="confirmDeleteCategory(category)"
                class="text-red-600 hover:text-red-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 添加/编辑分类表单 -->
        <div v-if="showForm" class="mt-4 pt-4 border-t">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">名称</label>
              <input
                v-model="form.name"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">排序</label>
              <input
                v-model="form.order_index"
                type="number"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
                required
              />
            </div>
            <div class="flex justify-end">
              <button
                type="button"
                @click="resetForm"
                class="mr-2 inline-flex justify-center rounded-md border border-gray-300 bg-white py-1.5 px-3 sm:py-2 sm:px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-1.5 px-3 sm:py-2 sm:px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isSubmitting" class="inline-block mr-2">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ editingCategory ? '保存' : '添加' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useAuthCustom } from '~/composables/useAuth';
import { useApi } from '~/utils/api';

const props = defineProps<{
  visible: boolean;
  categories: Array<{
    id: number;
    name: string;
    order_index: number;
  }>;
  editingCategory: {
    id?: number;
    name?: string;
    order_index?: number;
  } | null;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'success', message: string): void;
  (e: 'error', message: string): void;
  (e: 'category-updated'): void;
}>();

const { token } = useAuthCustom();
const api = useApi();
const isVisible = ref(props.visible);
const showForm = ref(!!props.editingCategory);
const editingCategory = ref(props.editingCategory);
const isSubmitting = ref(false);

const form = ref({
  name: props.editingCategory?.name || '',
  order_index: props.editingCategory?.order_index || 0
});

// 同步外部visible状态
watch(() => props.visible, (newValue) => {
  isVisible.value = newValue;
});

// 当编辑的分类改变时更新表单
watch(() => props.editingCategory, (newValue) => {
  editingCategory.value = newValue;
  if (newValue) {
    showForm.value = true;
    form.value = {
      name: newValue.name || '',
      order_index: newValue.order_index || 0
    };
  }
}, { deep: true });

const editCategory = (category: any) => {
  editingCategory.value = category;
  form.value = { ...category };
  showForm.value = true;
};

const resetForm = () => {
  showForm.value = false;
  editingCategory.value = null;
  form.value = {
    name: '',
    order_index: 0
  };
};

// 确认删除分类
const confirmDeleteCategory = async (category: any) => {
  if (!confirm('确定要删除这个分类吗？删除后该分类下的所有网址将被删除。')) return;
  await deleteCategory(category);
};

// 删除分类
const deleteCategory = async (category: any) => {
  if (!token.value) {
    emit('error', '请先登录');
    return;
  }

  try {
    const response = await api.del<{ success: boolean }>(`/api/categories/${category.id}`);

    if (response.success) {
      emit('success', '删除分类成功');
      emit('category-updated');
    }
  } catch (error: any) {
    console.error('删除分类失败:', error);
    if (error.data && error.data.message) {
      emit('error', error.data.message);
    } else {
      emit('error', error.message || '删除分类失败');
    }
  }
};

// 提交分类表单
const handleSubmit = async () => {
  if (!token.value) {
    emit('error', '请先登录');
    return;
  }

  isSubmitting.value = true;
  try {
    const data = {
      ...form.value,
      id: editingCategory.value?.id
    };

    const url = data.id
      ? `/api/categories/${data.id}`
      : '/api/categories';

    const response = await (data.id ? api.put : api.post)<{ success: boolean }>(url, data);

    if (response.success) {
      emit('success', data.id ? '更新分类成功' : '添加分类成功');
      emit('category-updated');
      resetForm();
    }
  } catch (error: any) {
    console.error('保存分类失败:', error);
    if (error.data && error.data.message) {
      emit('error', error.data.message);
    } else {
      emit('error', error.message || '保存分类失败');
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>