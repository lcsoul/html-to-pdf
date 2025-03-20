<template>
  <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
    <div class="flex flex-wrap justify-between items-center mb-6">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-0">网址导航</h1>
      <div class="flex items-center space-x-2">
        <button
          v-if="user && categories.length > 0"
          @click="showAddModal = true"
          class="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          添加网址
        </button>
        <button
          v-if="user"
          @click="showCategoryModal = true"
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
    <div v-else v-for="category in categories" :key="category.id" class="mb-8">
      <div class="flex flex-wrap justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">{{ category.name }}</h2>
        <div v-if="user" class="group relative">
          <button class="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
          <div class="hidden group-hover:block absolute right-0 mt-1 bg-white shadow-lg rounded-md py-2 z-10 min-w-[100px]">
            <button
              @click="editCategory(category)"
              class="text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center p-2 w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>编辑</span>
            </button>
            <button
              @click="deleteCategory(category)"
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
        <div
          v-for="bookmark in getBookmarksByCategory(category.id)"
          :key="bookmark.id"
          class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 relative group"
        >
          <a
            :href="bookmark.url"
            target="_blank"
            class="block p-3 md:p-4"
          >
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
          <div v-if="user" class="hidden group-hover:flex absolute top-2 right-2 bg-white shadow-sm rounded-md py-1 px-2 space-x-2 z-10">
            <button
              @click.prevent="editBookmark(bookmark)"
              class="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click.prevent="deleteBookmark(bookmark)"
              class="text-red-600 hover:text-red-900 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑网址弹窗 -->
    <Modal v-model="showAddModal">
      <template #title>{{ editingBookmark ? '编辑网址' : '添加网址' }}</template>
      <template #content>
        <form @submit.prevent="handleBookmarkSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">名称</label>
            <input
              v-model="bookmarkForm.title"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">网址</label>
            <input
              v-model="bookmarkForm.url"
              type="url"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">图标 URL</label>
            <input
              v-model="bookmarkForm.icon_url"
              type="url"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">分类</label>
            <select
              v-model="bookmarkForm.category_id"
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
              v-model="bookmarkForm.is_private"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">设为私有</label>
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              @click="showAddModal = false"
              class="mr-2 inline-flex justify-center rounded-md border border-gray-300 bg-white py-1.5 px-3 sm:py-2 sm:px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              取消
            </button>
            <button
              type="submit"
              class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-1.5 px-3 sm:py-2 sm:px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {{ editingBookmark ? '保存' : '添加' }}
            </button>
          </div>
        </form>
      </template>
    </Modal>

    <!-- 分类管理弹窗 -->
    <Modal v-model="showCategoryModal">
      <template #title>分类管理</template>
      <template #content>
        <div class="space-y-4">
          <div class="flex justify-end">
            <button
              @click="showAddCategoryForm = true"
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
                  @click="deleteCategory(category)"
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
          <div v-if="showAddCategoryForm" class="mt-4 pt-4 border-t">
            <form @submit.prevent="handleCategorySubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">名称</label>
                <input
                  v-model="categoryForm.name"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">排序</label>
                <input
                  v-model="categoryForm.order_index"
                  type="number"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div class="flex justify-end">
                <button
                  type="button"
                  @click="showAddCategoryForm = false"
                  class="mr-2 inline-flex justify-center rounded-md border border-gray-300 bg-white py-1.5 px-3 sm:py-2 sm:px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  取消
                </button>
                <button
                  type="submit"
                  class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-1.5 px-3 sm:py-2 sm:px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {{ editingCategory ? '保存' : '添加' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </template>
    </Modal>

    <!-- 提示信息 -->
    <Toast
      :show="showToast"
      @update:show="showToast = $event"
      :message="toastMessage"
      :type="toastType"
      :timeout="3000"
    />

    <!-- 移动端悬浮添加按钮 -->
    <div v-if="user" class="fixed bottom-6 right-6 sm:hidden z-10 flex flex-col space-y-2">
      <button
        v-if="categories.length > 0"
        @click="showAddModal = true"
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
import { ref, onMounted } from 'vue'
import { useAuthCustom } from '~/composables/useAuth'
// Modal 组件已在全局注册，无需导入

interface Category {
  id: number
  name: string
  order_index: number
}

interface Bookmark {
  id: number
  title: string
  url: string
  icon_url?: string
  category_id: number
  is_private: boolean
  is_deleted: boolean
}

const { user, token } = useAuthCustom()

const categories = ref<Category[]>([])
const bookmarks = ref<Bookmark[]>([])

const showAddModal = ref(false)
const showCategoryModal = ref(false)
const showAddCategoryForm = ref(false)
const editingBookmark = ref<Bookmark | null>(null)
const editingCategory = ref<Category | null>(null)

const bookmarkForm = ref({
  title: '',
  url: '',
  icon_url: '',
  category_id: 0,
  is_private: false
})

const categoryForm = ref({
  name: '',
  order_index: 0
})

// Toast 提示相关
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'info'>('info')

// 显示错误提示
const showError = (message: string) => {
  toastMessage.value = message
  toastType.value = 'error'
  showToast.value = true
}

// 显示成功提示
const showSuccess = (message: string) => {
  toastMessage.value = message
  toastType.value = 'success'
  showToast.value = true
}

// 加载状态
const isLoading = ref(false)

// 获取分类列表
const fetchCategories = async () => {
  isLoading.value = true
  try {
    const response = await $fetch<{ success: boolean; categories: Category[] }>('/api/categories', {
      headers: token.value ? {
        Authorization: `Bearer ${token.value}`
      } : undefined
    })
    if (response.success) {
      categories.value = response.categories.sort((a, b) => a.order_index - b.order_index)
    }
  } catch (error: any) {
    console.error('获取分类失败:', error)
    if (error.data && error.data.message) {
      showError(error.data.message)
    }
  } finally {
    isLoading.value = false
  }
}

// 获取网址列表
const fetchBookmarks = async () => {
  isLoading.value = true
  try {
    const response = await $fetch<{ success: boolean; bookmarks: Bookmark[] }>('/api/bookmarks', {
      headers: token.value ? {
        Authorization: `Bearer ${token.value}`
      } : undefined
    })
    if (response.success) {
      bookmarks.value = response.bookmarks.filter(b => !b.is_deleted)
    }
  } catch (error: any) {
    console.error('获取网址失败:', error)
    if (error.data && error.data.message) {
      showError(error.data.message)
    }
  } finally {
    isLoading.value = false
  }
}

// 根据分类获取网址
const getBookmarksByCategory = (categoryId: number) => {
  return bookmarks.value.filter(b => b.category_id === categoryId)
}

// 处理图片加载错误
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}

// 编辑网址
const editBookmark = (bookmark: Bookmark) => {
  editingBookmark.value = bookmark
  bookmarkForm.value = {
    title: bookmark.title,
    url: bookmark.url,
    icon_url: bookmark.icon_url || '',
    category_id: bookmark.category_id,
    is_private: bookmark.is_private
  }
  showAddModal.value = true
}

// 删除网址
const deleteBookmark = async (bookmark: Bookmark) => {
  if (!confirm('确定要删除这个网址吗？')) return

  try {
    const response = await $fetch<{ success: boolean }>(`/api/bookmarks/${bookmark.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    if (response.success) {
      await fetchBookmarks()
    }
  } catch (error: any) {
    console.error('删除网址失败:', error)
    if (error.data && error.data.message) {
      showError(error.data.message)
    } else {
      showError(error.message || '删除网址失败')
    }
  }
}

// 提交网址表单
const handleBookmarkSubmit = async () => {
  try {
    const url = editingBookmark.value
      ? `/api/bookmarks/${editingBookmark.value.id}`
      : '/api/bookmarks'
    const method = editingBookmark.value ? 'PUT' : 'POST'

    const response = await $fetch<{ success: boolean }>(url, {
      method,
      body: bookmarkForm.value,
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    if (response.success) {
      showAddModal.value = false
      editingBookmark.value = null
      bookmarkForm.value = {
        title: '',
        url: '',
        icon_url: '',
        category_id: 0,
        is_private: false
      }
      await fetchBookmarks()
      showSuccess(editingBookmark.value ? '更新网址成功' : '添加网址成功')
    }
  } catch (error: any) {
    console.error('保存网址失败:', error)
    if (error.data && error.data.message) {
      showError(error.data.message)
    } else {
      showError(error.message || '保存网址失败')
    }
  }
}

// 编辑分类
const editCategory = (category: Category) => {
  editingCategory.value = category
  categoryForm.value = { ...category }
  showAddCategoryForm.value = true
}

// 删除分类
const deleteCategory = async (category: Category) => {
  if (!confirm('确定要删除这个分类吗？删除后该分类下的所有网址将被删除。')) return

  try {
    const response = await $fetch<{ success: boolean }>(`/api/categories/${category.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    if (response.success) {
      await Promise.all([fetchCategories(), fetchBookmarks()])
      showSuccess('删除分类成功')
    }
  } catch (error: any) {
    console.error('删除分类失败:', error)
    if (error.data && error.data.message) {
      showError(error.data.message)
    } else {
      showError(error.message || '删除分类失败')
    }
  }
}

// 提交分类表单
const handleCategorySubmit = async () => {
  try {
    const url = editingCategory.value
      ? `/api/categories/${editingCategory.value.id}`
      : '/api/categories'
    const method = editingCategory.value ? 'PUT' : 'POST'

    const response = await $fetch<{ success: boolean }>(url, {
      method,
      body: categoryForm.value,
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    if (response.success) {
      showAddCategoryForm.value = false
      editingCategory.value = null
      categoryForm.value = {
        name: '',
        order_index: 0
      }
      await fetchCategories()
      showSuccess(editingCategory.value ? '更新分类成功' : '添加分类成功')
    }
  } catch (error: any) {
    console.error('保存分类失败:', error)
    if (error.data && error.data.message) {
      showError(error.data.message)
    } else {
      showError(error.message || '保存分类失败')
    }
  }
}

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchBookmarks()])
})
</script>