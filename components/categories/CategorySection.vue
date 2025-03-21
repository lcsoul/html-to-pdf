<template>
  <div class="mb-8 animate-fade-in">
    <div class="flex flex-wrap justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">{{ category.name }}</h2>
      <div v-if="isAuthenticated" class="flex items-center space-x-2">
        <button
          @click="handleEditCategory"
          class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="handleDeleteCategory"
          class="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 网址列表 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      <BookmarkCard
        v-for="bookmark in bookmarks"
        :key="bookmark.id"
        :bookmark="bookmark"
        :is-authenticated="isAuthenticated"
        @edit="handleEditBookmark"
        @delete="handleDeleteBookmark"
        class="transform hover:-translate-y-1 hover:shadow-md transition-all duration-200"
      />
    </div>
  </div>
  <!-- 编辑分类模态框 -->
  <Modal v-model="showEditModal">
    <template #title>编辑分类</template>
    <template #content>
      <form @submit.prevent="handleSubmitEdit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">名称</label>
          <input
            v-model="editForm.name"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">排序</label>
          <input
            v-model="editForm.order_index"
            type="number"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
            required
          />
        </div>
        <div class="flex justify-end">
          <button
            type="button"
            @click="showEditModal = false"
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
            保存
          </button>
        </div>
      </form>
    </template>
  </Modal>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthCustom } from '~/composables/useAuth';
import { useApi } from '~/utils/api';
import BookmarkCard from '~/components/bookmarks/BookmarkCard.vue';
import Modal from '~/components/common/Modal.vue';

const props = defineProps<{
  category: {
    id: number;
    name: string;
    order_index: number;
  };
  bookmarks: Array<{
    id: number;
    title: string;
    url: string;
    icon_url?: string;
    category_id: number;
    is_private: boolean;
    is_deleted: boolean;
  }>;
  isAuthenticated: boolean;
}>();

const emit = defineEmits<{
  (e: 'category-updated', category: any): void;
  (e: 'category-deleted', category: any): void;
  (e: 'edit-bookmark', bookmark: any): void;
  (e: 'delete-bookmark', bookmark: any): void;
  (e: 'success', message: string): void;
  (e: 'error', message: string): void;
}>();

const { token } = useAuthCustom();
const api = useApi();

// 处理编辑书签
const handleEditBookmark = (bookmark: any) => {
  emit('edit-bookmark', bookmark);
};

// 处理删除书签
const handleDeleteBookmark = async (bookmark: any) => {
  if (!confirm('确定要删除这个网址吗？')) return;

  if (!token.value) {
    emit('error', '请先登录');
    return;
  }

  try {
    const response = await api.del<{ success: boolean }>(`/api/bookmarks/${bookmark.id}`);

    if (response.success) {
      emit('success', '删除网址成功');
      emit('delete-bookmark', bookmark);
    }
  } catch (error: any) {
    console.error('删除网址失败:', error);
    // 处理API返回的错误信息
    if (error.data && error.data.message) {
      emit('error', error.data.message);
    } else if (error.statusCode === 403 || (error.data && error.data.statusCode === 403)) {
      emit('error', '无权限删除，可能是因为您不是该书签的创建者');
    } else {
      emit('error', error.message || '删除网址失败');
    }
  }
};

// 编辑分类相关状态
const showEditModal = ref(false);
const isSubmitting = ref(false);
const editForm = ref({
  name: '',
  order_index: 0
});

// 处理编辑分类
const handleEditCategory = () => {
  editForm.value = {
    name: props.category.name,
    order_index: props.category.order_index
  };
  showEditModal.value = true;
};

// 提交编辑分类表单
const handleSubmitEdit = async () => {
  if (!token.value) {
    emit('error', '请先登录');
    return;
  }

  try {
    isSubmitting.value = true;
    const response = await api.put<{ success: boolean }>(`/api/categories/${props.category.id}`, {
      name: editForm.value.name,
      order_index: editForm.value.order_index
    });

    if (response.success) {
      const updatedCategory = { ...props.category, ...editForm.value };
      emit('success', '更新分类成功');
      emit('category-updated', updatedCategory);
      emit('edit', updatedCategory);
      showEditModal.value = false;
    }
  } catch (error: any) {
    console.error('更新分类失败:', error);
    if (error.data && error.data.message) {
      emit('error', error.data.message);
    } else {
      emit('error', error.message || '更新分类失败');
    }
  } finally {
    isSubmitting.value = false;
  }
};

// 处理删除分类
const handleDeleteCategory = async () => {
  if (!confirm('确定要删除这个分类吗？该分类下的所有网址也会被删除。')) return;

  if (!token.value) {
    emit('error', '请先登录');
    return;
  }

  try {
    const response = await api.del<{ success: boolean }>(`/api/categories/${props.category.id}`);

    if (response.success) {
      emit('success', '删除分类成功');
      emit('category-deleted', props.category);
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
</script>