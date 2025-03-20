<template>
  <div class="mb-8">
    <div class="flex flex-wrap justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">{{ category.name }}</h2>
      <div v-if="isAuthenticated" class="group relative">
        <button class="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
        <div class="hidden group-hover:block absolute right-0 mt-1 bg-white shadow-lg rounded-md py-2 z-10 min-w-[100px]">
          <button
            @click="$emit('edit', category)"
            class="text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center p-2 w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>编辑</span>
          </button>
          <button
            @click="$emit('delete', category)"
            class="text-red-600 hover:text-red-900 hover:bg-gray-50 flex items-center p-2 w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>删除</span>
          </button>
        </div>
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
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthCustom } from '~/composables/useAuth';
import BookmarkCard from '~/components/bookmarks/BookmarkCard.vue';

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
  (e: 'edit', category: any): void;
  (e: 'delete', category: any): void;
  (e: 'edit-bookmark', bookmark: any): void;
  (e: 'delete-bookmark', bookmark: any): void;
  (e: 'success', message: string): void;
  (e: 'error', message: string): void;
}>();

const { token } = useAuthCustom();

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
    const response = await $fetch<{ success: boolean }>(`/api/bookmarks/${bookmark.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });

    if (response.success) {
      emit('success', '删除网址成功');
      emit('delete-bookmark', bookmark);
    }
  } catch (error: any) {
    console.error('删除网址失败:', error);
    if (error.data && error.data.message) {
      emit('error', error.data.message);
    } else {
      emit('error', error.message || '删除网址失败');
    }
  }
};
</script>