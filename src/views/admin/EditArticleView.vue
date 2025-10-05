<template>
  <AdminLayout>
    <div class="bg-white p-8 rounded-lg shadow max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-gray-800">Edit Artikel</h1>

      <div v-if="loading" class="text-center">Memuat data artikel...</div>
      <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>

      <form v-if="!loading && article" @submit.prevent="handleUpdate">
        <div class="grid grid-cols-1 gap-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Judul</label>
            <input
              v-model="article.title"
              type="text"
              id="title"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label for="slug" class="block text-sm font-medium text-gray-700">Slug (URL)</label>
            <input
              v-model="article.slug"
              type="text"
              id="slug"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label for="content" class="block text-sm font-medium text-gray-700">Konten</label>
            <textarea
              v-model="article.content"
              id="content"
              rows="10"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
            <p class="mt-2 text-sm text-gray-500">Anda bisa menggunakan format Markdown di sini.</p>
          </div>

          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select
              v-model="article.status"
              id="status"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div class="mt-8 flex justify-end space-x-4">
          <router-link
            to="/admin/dashboard"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Batal
          </router-link>
          <button
            type="submit"
            :disabled="saving"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {{ saving ? 'Menyimpan...' : 'Update Artikel' }}
          </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@/supabase';
import AdminLayout from '@/components/AdminLayout.vue';

const route = useRoute();
const router = useRouter();

const article = ref(null);
const loading = ref(true);
const saving = ref(false);
const errorMessage = ref(null);

const articleId = route.params.id;

// Fungsi untuk mengambil data artikel yang akan diedit
const fetchArticle = async () => {
  try {
    loading.value = true;
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', articleId)
      .single(); // .single() untuk mengambil satu baris data saja

    if (error) throw error;
    article.value = data;
  } catch (err) {
    errorMessage.value = `Gagal memuat artikel: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

// Fungsi untuk update artikel
const handleUpdate = async () => {
  try {
    saving.value = true;
    const { error } = await supabase
      .from('articles')
      .update({
        title: article.value.title,
        slug: article.value.slug,
        content: article.value.content,
        status: article.value.status,
      })
      .eq('id', articleId); // Kondisi WHERE id = articleId

    if (error) throw error;
    router.push('/admin/dashboard');
  } catch (err) {
    errorMessage.value = `Gagal mengupdate artikel: ${err.message}`;
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchArticle();
});
</script>