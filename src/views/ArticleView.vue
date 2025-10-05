<template>
  <!-- Latar belakang gelap yang konsisten dengan halaman blog -->
  <div class="bg-[#111112] text-white min-h-screen">
    <!-- Tombol kembali yang elegan -->
    <div class="max-w-5xl mx-auto px-5 py-8">
      <router-link to="/blog" class="inline-flex items-center gap-2 text-amber-300 hover:text-amber-100 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        <span>Kembali ke Semua Artikel</span>
      </router-link>
    </div>

    <!-- Tampilan Loading -->
    <div v-if="loading" class="text-center py-20 text-gray-400">
      <p>Memuat artikel...</p>
    </div>

    <!-- Tampilan Error -->
    <div v-if="errorMessage" class="max-w-3xl mx-auto text-center py-20 text-red-400">
      <p><strong>Gagal memuat artikel:</strong> {{ errorMessage }}</p>
    </div>

    <!-- Konten Artikel Utama -->
    <article v-if="!loading && article" class="fade-zoom-in">
      <!-- Gambar Sampul sebagai Hero Image -->
      <figure v-if="article.cover_image_url" class="mb-12">
        <img :src="article.cover_image_url" :alt="article.title" class="w-full h-auto max-h-[500px] object-cover">
      </figure>

      <div class="max-w-3xl mx-auto px-5">
        <!-- Header Artikel: Judul & Metadata -->
        <header class="mb-10 text-center">
          <h1 class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-amber-300 leading-tight">
            {{ article.title }}
          </h1>
          <p class="mt-4 text-base text-gray-400">
            Dipublikasikan pada {{ new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}
          </p>
        </header>

        <!-- Garis Pemisah -->
        <hr class="border-gray-700 my-12">

        <!-- Isi Konten Artikel -->
        <div
          class="prose prose-lg prose-invert max-w-none"
          v-html="article.content">
        </div>
      </div>
    </article>

    <!-- Footer halaman -->
    <footer class="max-w-5xl mx-auto px-5 py-16 mt-16 border-t border-gray-800 text-center">
      <p class="text-gray-500">Terima kasih telah membaca.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/supabase';

const route = useRoute();
const article = ref(null);
const loading = ref(true);
const errorMessage = ref(null);

const fetchArticleDetail = async (id) => {
  try {
    loading.value = true;
    errorMessage.value = null;
    article.value = null;

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Artikel tidak ditemukan.');
    
    article.value = data;

    // Update judul tab browser
    document.title = `${data.title} | Blog`;

  } catch (err) {
    errorMessage.value = err.message;
    console.error("Gagal mengambil detail artikel:", err);
  } finally {
    loading.value = false;
  }
};

// Panggil fetchArticleDetail saat komponen pertama kali dimuat
onMounted(() => {
  fetchArticleDetail(route.params.id);
});

// Tambahan: Panggil ulang jika pengguna navigasi antar artikel (jika ada fitur 'artikel terkait')
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchArticleDetail(newId);
  }
});

// Reset judul tab saat komponen dihancurkan
import { onUnmounted } from 'vue';
onUnmounted(() => {
  document.title = 'Portofolio'; // Ganti dengan judul default situs Anda
});
</script>

<style scoped>
/* Menyesuaikan styling dari Tailwind Typography agar lebih pas dengan tema */
.prose {
  /* Variabel CSS untuk warna link agar sesuai dengan aksen amber */
  --tw-prose-links: #fcd34d; /* amber-300 */
  --tw-prose-body: #d1d5db; /* gray-300 */
  --tw-prose-headings: #ffffff;
  --tw-prose-bold: #ffffff;
}
@keyframes fadeZoomIn {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.fade-zoom-in {
  animation: fadeZoomIn 0.5s ease-in-out;
}
</style>

