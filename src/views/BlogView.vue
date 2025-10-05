<template>
  <!-- Menggunakan layout dan warna latar dari contoh Anda -->
  <div class="px-5 py-5 md:px-12 md:py-10 text-left text-amber-50 mx-3">
    <article data-page="about">
      <header>
        <div class="text-2xl font-bold text-white mb-10 fadein-bot title-section flex items-center justify-center flex-col">
          <!-- Judul diadaptasi untuk halaman blog -->
          <h4>My Personal Blog</h4>
          <h4 class="text-base font-normal text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-amber-300">
            Thoughts, tutorials, and stories from my journey in code.
          </h4>
        </div>
      </header>
      <section>
        <!-- Menambahkan penanganan untuk status loading dan error -->
        <div v-if="loading" class="text-center py-10 text-gray-400">
          Memuat artikel...
        </div>
        <div v-if="errorMessage" class="text-center py-10 text-red-400">
          Gagal memuat data: {{ errorMessage }}
        </div>

        <!-- Grid untuk kartu-kartu blog, menggunakan class dari contoh Anda -->
        <div v-if="!loading && articles.length > 0" class="grid grid-cols-1 gap-4 pb-32 md:grid-cols-2 md:gap-3 xl:grid-cols-3 xl:gap-3 2xl:gap-5 fade-zoom-in">
          <!-- Looping data artikel dari Supabase -->
          <div v-for="article in articles" :key="article.id">
            <!-- Menerapkan styling kartu persis seperti contoh Anda -->
            <div class="item-card flex flex-col rounded bg-[#1e1e1f] hover:bg-[#282828] border border-[#383838] rounded-xl text-amber-50 px-5 py-5 h-full">
              <!-- Gambar Sampul -->
              <div class="flex items-center justify-center p-0 h-full w-full lg:p-0 zoom-in mb-4">
                <img 
                  v-if="article.cover_image_url"
                  :src="article.cover_image_url"
                  :alt="article.title"
                  loading="lazy"
                  class="drop-shadow-xl rounded-xl w-full h-48 object-cover"
                >
                <!-- Placeholder jika tidak ada gambar -->
                <div v-else class="w-full h-48 bg-[#282828] rounded-xl flex items-center justify-center text-gray-500">
                  No Image
                </div>
              </div>

              <!-- Konten Kartu -->
              <div class="w-full flex flex-col gap-2 items-start text-sm md:text-base lg:text-lg flex-grow">
                <!-- Judul Artikel -->
                <div class="title-text font-medium text-white text-lg">
                  {{ article.title }}
                </div>
                <!-- Cuplikan Konten -->
                <div class="w-full text-left text-xs text-[#c1c1c1] flex-grow">
                  {{ article.content ? article.content.substring(0, 120).replace(/<[^>]*>?/gm, '') + '...' : 'Tidak ada cuplikan.' }}
                </div>
                <!-- Tanggal Publikasi (menggantikan 'tech') -->
                <div class="w-full mt-4 text-normal text-sm text-left text-amber-200">
                  {{ new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                </div>
                <!-- Link "Baca Selengkapnya" (menggantikan ikon) -->
                <div class="w-full flex justify-end mt-2">
                  <router-link
                    :to="`/read/${article.slug}/${article.id}`"
                    class="text-sm font-semibold text-amber-300 hover:text-amber-100 transition-colors"
                  >
                    Baca Selengkapnya &rarr;
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pesan jika tidak ada artikel -->
        <div v-if="!loading && articles.length === 0 && !errorMessage" class="text-center py-16 px-6">
            <h2 class="text-xl font-semibold text-white">Belum Ada Tulisan</h2>
            <p class="text-gray-400 mt-2">Nantikan artikel pertama di sini!</p>
        </div>
      </section>
    </article>
  </div>
</template>

<script setup>
// Menggunakan <script setup> yang modern dan sudah ada
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase';

const articles = ref([]);
const loading = ref(true);
const errorMessage = ref(null);

const fetchPublishedArticles = async () => {
  try {
    loading.value = true;
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, content, created_at, cover_image_url')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;
    articles.value = data;
  } catch (err) {
    errorMessage.value = `Gagal mengambil data: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPublishedArticles();
});
</script>

<style scoped>
/* Mengambil style kustom dari contoh Anda */
.item-card:hover {
  transition: transform 0.3s ease;
  transform: translateY(-8px);
}
svg:hover{
  stroke: #ffdb70;
}
@keyframes fadeZoomIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.fade-zoom-in {
  animation: fadeZoomIn 1s ease-in-out;
}
</style>
