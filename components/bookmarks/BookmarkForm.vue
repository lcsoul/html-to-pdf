<template>
  <Modal v-model="isVisible" @update:modelValue="$emit('update:visible', $event)">
    <template #title>{{ isEditing ? '编辑网址' : '添加网址' }}</template>
    <template #content>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">名称</label>
          <input
            v-model="form.title"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">网址</label>
          <input
            v-model="form.url"
            type="url"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">图标 URL</label>
          <input
            v-model="form.icon_url"
            type="url"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">分类</label>
          <select
            v-model="form.category_id"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
            required
          >
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="flex items-center">
          <input
            v-model="form.is_private"
            type="checkbox"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label class="ml-2 block text-sm text-gray-900">设为私有</label>
        </div>
        <div class="flex justify-end">
          <button
            type="button"
            @click="$emit('update:visible', false)"
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
            {{ isEditing ? '保存' : '添加' }}
          </button>
        </div>
      </form>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useAuthCustom } from '~/composables/useAuth';

const props = defineProps<{
  visible: boolean;
  categories: Array<{
    id: number;
    name: string;
    order_index: number;
  }>;
  editingBookmark: {
    id?: number;
    title?: string;
    url?: string;
    icon_url?: string;
    category_id?: number;
    is_private?: boolean;
  } | null;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'success', message: string): void;
  (e: 'error', message: string): void;
  (e: 'bookmark-updated'): void;
}>();

const { token } = useAuthCustom();
const isVisible = ref(props.visible);
const isEditing = computed(() => !!props.editingBookmark);
const isSubmitting = ref(false);

const form = ref({
  title: props.editingBookmark?.title || '',
  url: props.editingBookmark?.url || '',
  icon_url: props.editingBookmark?.icon_url || '',
  category_id: props.editingBookmark?.category_id || (props.categories[0]?.id || 0),
  is_private: props.editingBookmark?.is_private || false
});

// 同步外部visible状态
watch(() => props.visible, (newValue) => {
  isVisible.value = newValue;
});

// 当编辑的书签改变时更新表单
watch(() => props.editingBookmark, (newValue) => {
  if (newValue) {
    form.value = {
      title: newValue.title || '',
      url: newValue.url || '',
      icon_url: newValue.icon_url || '',
      category_id: newValue.category_id || (props.categories[0]?.id || 0),
      is_private: newValue.is_private || false
    };
  } else {
    resetForm();
  }
}, { deep: true });

const resetForm = () => {
  form.value = {
    title: '',
    url: '',
    icon_url: '',
    category_id: props.categories[0]?.id || 0,
    is_private: false
  };
};

const handleSubmit = async () => {
  if (!token.value) {
    emit('error', '请先登录');
    return;
  }

  isSubmitting.value = true;
  try {
    const data = {
      ...form.value,
      id: props.editingBookmark?.id
    };

    const url = data.id
      ? `/api/bookmarks/${data.id}`
      : '/api/bookmarks';
    const method = data.id ? 'PUT' : 'POST';

    const response = await $fetch<{ success: boolean }>(url, {
      method,
      body: data,
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });

    if (response.success) {
      emit('update:visible', false);
      emit('success', data.id ? '更新网址成功' : '添加网址成功');
      emit('bookmark-updated');
      resetForm();
    }
  } catch (error: any) {
    console.error('保存网址失败:', error);
    if (error.data && error.data.message) {
      emit('error', error.data.message);
    } else {
      emit('error', error.message || '保存网址失败');
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>