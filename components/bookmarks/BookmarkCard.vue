<template>
  <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 relative group">
    <a :href="bookmark.url" target="_blank" class="block p-3 md:p-4">
      <div class="flex items-center">
        <img
          v-if="bookmark.icon_url"
          :src="bookmark.icon_url"
          :alt="bookmark.title"
          class="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 flex-shrink-0"
          @error="handleImageError"
        />
        <div v-else class="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
          <span class="text-gray-500 text-xs md:text-sm">{{ bookmark.title[0] }}</span>
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="text-base md:text-lg font-medium text-gray-900 truncate">{{ bookmark.title }}</h3>
          <p class="text-xs md:text-sm text-gray-500 truncate">{{ bookmark.url }}</p>
        </div>
      </div>
    </a>
    <div v-if="isAuthenticated" class="hidden group-hover:flex absolute top-2 right-2 bg-white shadow-sm rounded-md py-1 px-2 space-x-2 z-10">
      <button
        @click.prevent="$emit('edit', bookmark)"
        class="text-gray-600 hover:text-gray-900 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        @click.prevent="$emit('delete', bookmark)"
        class="text-red-600 hover:text-red-900 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  bookmark: {
    id: number;
    title: string;
    url: string;
    icon_url?: string;
    category_id: number;
    is_private: boolean;
    is_deleted: boolean;
  };
  isAuthenticated: boolean;
}>();

defineEmits<{
  (e: 'edit', bookmark: any): void;
  (e: 'delete', bookmark: any): void;
}>();

// 处理图片加载错误
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.style.display = 'none';
};
</script>