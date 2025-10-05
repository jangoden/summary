<template>
  <AdminLayout>
    <!-- Header Halaman -->
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Artikel Saya</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola semua artikel blog Anda dari sini.</p>
      </div>
      <router-link
        to="/admin/create"
        class="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg shadow-sm hover:bg-primary-700 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        <span>Buat Artikel Baru</span>
      </router-link>
    </div>

    <!-- Tampilan Loading -->
    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500">Memuat artikel...</p>
    </div>

    <!-- Tampilan Error -->
    <div v-if="error" class="bg-red-100 p-4 rounded-md text-red-700">
      <p><strong>Gagal memuat data:</strong> {{ error }}</p>
    </div>

    <!-- Konten Utama: Daftar Artikel dalam Bentuk Kartu -->
    <div v-if="!loading && articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="article in articles" :key="article.id" class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        <!-- Gambar Sampul -->
        <img 
          v-if="article.cover_image_url" 
          :src="article.cover_image_url" 
          :alt="article.title" 
          class="w-full h-40 object-cover"
        >
        <div v-else class="w-full h-40 bg-gray-200 flex items-center justify-center">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"></path></svg>
        </div>

        <!-- Detail Artikel -->
        <div class="p-5 flex-grow flex flex-col">
          <span 
            :class="article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
            class="px-2 py-1 text-xs font-medium rounded-full self-start mb-2"
          >
            {{ article.status }}
          </span>
          <h2 class="text-lg font-semibold text-gray-900 flex-grow mb-2" :title="article.title">
            {{ article.title.length > 50 ? article.title.substring(0, 50) + '...' : article.title }}
          </h2>
          <p class="text-sm text-gray-500 mb-4">
            {{ new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}
          </p>
        </div>

        <!-- Aksi -->
        <div class="p-4 bg-gray-50 border-t border-gray-200 flex justify-end items-center gap-2">
          <router-link :to="`/admin/edit/${article.id}`" class="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-200" title="Edit">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </router-link>
          <button @click="confirmDelete(article.id)" class="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-200" title="Hapus">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Pesan jika tidak ada artikel -->
    <div v-if="!loading && articles.length === 0 && !error" class="text-center py-16 px-6 bg-white rounded-lg shadow-md">
      <h2 class="text-xl font-semibold text-gray-800">Mulai Menulis!</h2>
      <p class="text-gray-500 mt-2">Anda belum memiliki artikel. Klik tombol di bawah untuk membuat yang pertama.</p>
      <router-link
        to="/admin/create"
        class="mt-6 inline-block px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg shadow-sm hover:bg-primary-700"
      >
        Buat Artikel Baru
      </router-link>
    </div>

  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase';
import AdminLayout from '@/components/AdminLayout.vue';

const articles = ref([]);
const loading = ref(true);
const error = ref(null);

// Fungsi untuk mengambil data artikel
const fetchArticles = async () => {
  try {
    loading.value = true;
    const { data, error: fetchError } = await supabase
      .from('articles')
      .select('id, title, status, created_at, cover_image_url') // Ambil cover_image_url juga
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;
    articles.value = data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Fungsi konfirmasi sebelum menghapus
const confirmDelete = (id) => {
  if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak bisa dibatalkan.')) {
    deleteArticle(id);
  }
};

// Fungsi untuk menghapus artikel
const deleteArticle = async (id) => {
  try {
    // Tambahan: hapus gambar dari storage jika ada
    const articleToDelete = articles.value.find(art => art.id === id);
    if (articleToDelete && articleToDelete.cover_image_url) {
      const fileName = articleToDelete.cover_image_url.split('/').pop();
      await supabase.storage.from('article_covers').remove([fileName]);
    }

    // Hapus data dari database
    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    // Update UI
    articles.value = articles.value.filter(article => article.id !== id);
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
};

onMounted(() => {
  fetchArticles();
});
</script>
