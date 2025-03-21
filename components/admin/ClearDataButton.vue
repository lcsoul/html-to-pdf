<template>
  <div>
    <button
      @click="showConfirmModal = true"
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      清空所有数据
    </button>

    <Modal v-model="showConfirmModal">
      <template #title>危险操作确认</template>
      <template #content>
        <div class="space-y-4">
          <div class="bg-red-50 p-4 rounded-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">警告：此操作不可逆</h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>此操作将永久删除所有：</p>
                  <ul class="list-disc pl-5 mt-1 space-y-1">
                    <li>用户账户信息</li>
                    <li>所有分类数据</li>
                    <li>所有网址书签</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">确认操作</label>
            <input
              v-model="confirmText"
              type="text"
              placeholder="请输入'确认清空所有数据'以继续"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
            />
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showConfirmModal = false"
              class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              取消
            </button>
            <button
              type="button"
              @click="clearAllData"
              :disabled="confirmText !== '确认清空所有数据' || isLoading"
              class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="inline-block mr-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              确认清空
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthCustom } from '~/composables/useAuth';
import { useApi } from '~/utils/api';
import Modal from '~/components/common/Modal.vue';

const emit = defineEmits<{
  (e: 'success', message: string): void;
  (e: 'error', message: string): void;
}>();

const { token } = useAuthCustom();
const api = useApi();

const showConfirmModal = ref(false);
const confirmText = ref('');
const isLoading = ref(false);

const clearAllData = async () => {
  if (!token.value) {
    emit('error', '请先登录');
    return;
  }

  if (confirmText.value !== '确认清空所有数据') {
    return;
  }

  try {
    isLoading.value = true;
    const response = await api.post<{ success: boolean; message: string }>('/api/admin/clear-data');

    if (response.success) {
      emit('success', response.message || '已成功清空所有数据');
      showConfirmModal.value = false;
      confirmText.value = '';
      // 刷新页面以反映更改
      window.location.reload();
    }
  } catch (error: any) {
    console.error('清空数据失败:', error);
    if (error.data && error.data.message) {
      emit('error', error.data.message);
    } else {
      emit('error', error.message || '清空数据失败');
    }
  } finally {
    isLoading.value = false;
  }
};
</script>