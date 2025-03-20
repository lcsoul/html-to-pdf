<template>
  <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
    <!-- 头部 -->
    <div class="flex flex-wrap justify-between items-center mb-6">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-0">网址导航</h1>
      <div class="flex items-center space-x-2">
        <button
          v-if="user && categories.length > 0"
          @click="showAddBookmarkModal = true"
          class="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          添加网址
        </button>
        <button
          v-if="user"
          @click="showCategoryManagerModal = true"
          class="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          管理分类
        </button>
      </div>
    </div>

    <!-- 加载状态指示器 -->
    <div v-if="isLoading" class="flex justify-center my-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>

    <!-- 空状态提示 -->
    <div v-else-if="categories.length === 0" class="text-center my-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="text-lg text-gray-600">暂无分类和网址</p>
      <p v-if="user" class="text-gray-500 mt-2">请先添加分类，然后添加网址</p>
    </div>

    <!-- 分类列表 -->
    <CategorySection
      v-else
      v-for="category in categories"
      :key="category.id"
      :category="category"
      :bookmarks="getBookmarksByCategory(category.id)"
      :is-authenticated="!!user"
      @edit="editingCategory = $event"
      @delete="showCategoryManagerModal = true"
      @edit-bookmark="editingBookmark = $event; showAddBookmarkModal = true"
      @delete-bookmark="fetchBookmarks"
      @success="handleSuccess"
      @error="handleError"
    />

    <!-- 书签表单 -->
    <BookmarkForm
      :visible="showAddBookmarkModal"
      @update:visible="showAddBookmarkModal = $event"
      :categories="categories"
      :editing-bookmark="editingBookmark"
      @bookmark-updated="fetchBookmarks"
      @success="handleSuccess"
      @error="handleError"
    />

    <!-- 分类管理 -->
    <CategoryManager
      :visible="showCategoryManagerModal"
      @update:visible="showCategoryManagerModal = $event"
      :categories="categories"
      :editing-category="editingCategory"
      @category-updated="onCategoryUpdated"
      @success="handleSuccess"
      @error="handleError"
    />

    <!-- 提示信息 -->
    <Toast
      v-model="showToast"
      :message="toastMessage"
      :type="toastType"
      :timeout="3000"
    />

    <!-- 移动端悬浮添加按钮 -->
    <div v-if="user" class="fixed bottom-6 right-6 sm:hidden z-10 flex flex-col space-y-2">
      <button
        v-if="categories.length > 0"
        @click="showAddBookmarkModal = true"
        class="w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthCustom } from '~/composables/useAuth';
import { useApi } from '~/utils/api';
import CategorySection from '~/components/categories/CategorySection.vue';
import BookmarkForm from '~/components/bookmarks/BookmarkForm.vue';
import CategoryManager from '~/components/categories/CategoryManager.vue';
import Toast from '~/components/common/Toast.vue';

interface Category {
  id: number;
  name: string;
  order_index: number;
}

interface Bookmark {
  id: number;
  title: string;
  url: string;
  icon_url?: string;
  category_id: number;
  is_private: boolean;
  is_deleted: boolean;
}

const { user } = useAuthCustom();
const api = useApi();

const categories = ref<Category[]>([]);
const bookmarks = ref<Bookmark[]>([]);

const showAddBookmarkModal = ref(false);
const showCategoryManagerModal = ref(false);
const editingBookmark = ref<Bookmark | null>(null);
const editingCategory = ref<Category | null>(null);

// Toast 提示相关
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref<'success' | 'error' | 'info'>('info');

// 显示错误提示
const handleError = (message: string) => {
  toastMessage.value = message;
  toastType.value = 'error';
  showToast.value = true;
};

// 显示成功提示
const handleSuccess = (message: string) => {
  toastMessage.value = message;
  toastType.value = 'success';
  showToast.value = true;
};

// 加载状态
const isLoading = ref(false);

// 获取分类列表
const fetchCategories = async () => {
  isLoading.value = true;
  try {
    const response = await api.get<{ success: boolean; categories: Category[] }>('/api/categories');
    if (response.success) {
      categories.value = response.categories.sort((a, b) => a.order_index - b.order_index);
    }
  } catch (error: any) {
    console.error('获取分类失败:', error);
    handleError(error.data?.message || '获取分类失败');
  } finally {
    isLoading.value = false;
  }
};

// 获取网址列表
const fetchBookmarks = async () => {
  isLoading.value = true;
  try {
    const response = await api.get<{ success: boolean; bookmarks: Bookmark[] }>('/api/bookmarks');
    if (response.success) {
      bookmarks.value = response.bookmarks.filter(b => !b.is_deleted);
    }
  } catch (error: any) {
    console.error('获取网址失败:', error);
    handleError(error.data?.message || '获取网址失败');
  } finally {
    isLoading.value = false;
  }
};

// 根据分类获取网址
const getBookmarksByCategory = (categoryId: number) => {
  return bookmarks.value.filter(b => b.category_id === categoryId);
};

// 分类更新后处理
const onCategoryUpdated = async () => {
  await Promise.all([fetchCategories(), fetchBookmarks()]);
};

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchBookmarks()]);
});
</script>