<template>
  <AdminLayout>
    <form @submit.prevent="handleSave">
      <!-- Header Aksi: Judul dan Tombol Simpan -->
      <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Buat Artikel Baru</h1>
          <p class="text-sm text-gray-500 mt-1">Isi detail artikel Anda di bawah ini.</p>
        </div>
        <div class="flex items-center space-x-4">
          <router-link
            to="/admin/dashboard"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Batal
          </router-link>
          <button
            type="submit"
            :disabled="loading"
            class="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg shadow-sm hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed flex items-center"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Menyimpan...' : 'Publikasikan Artikel' }}</span>
          </button>
        </div>
      </div>

      <!-- Layout Utama: Form di Kiri, Sidebar di Kanan -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Kolom Utama (Form Konten) -->
        <div class="lg:col-span-2 space-y-6">
          <div class="p-6 bg-white rounded-lg shadow">
            <label for="title" class="block text-sm font-medium text-gray-900">Judul</label>
            <input
              v-model="article.title"
              @input="generateSlug"
              type="text"
              id="title"
              required
              class="mt-1 block w-full text-lg border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="Judul artikel yang menarik..."
            />
          </div>
          <div class="p-6 bg-white rounded-lg shadow">
            <label for="content" class="block text-sm font-medium text-gray-900 mb-2">Konten</label>
            <QuillEditor
              v-model:content="article.content"
              theme="snow"
              toolbar="full"
              contentType="html"
              style="min-height: 300px;"
            />
          </div>
        </div>

        <!-- Sidebar (Metadata dan Gambar) -->
        <div class="lg:col-span-1 space-y-6">
          <div class="p-6 bg-white rounded-lg shadow">
            <label for="status" class="block text-sm font-medium text-gray-900">Status</label>
            <select
              v-model="article.status"
              id="status"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div class="p-6 bg-white rounded-lg shadow">
            <label class="block text-sm font-medium text-gray-900 mb-2">Gambar Sampul</label>
            <div
              @dragover.prevent @drop.prevent="handleFileDrop"
              class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
            >
              <div v-if="!coverPreviewUrl" class="space-y-1 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                <div class="flex text-sm text-gray-600">
                  <label for="cover_image" class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>Upload a file</span>
                    <input @change="handleFileSelected" id="cover_image" name="cover_image" type="file" class="sr-only" accept="image/png, image/jpeg, image/webp">
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">PNG, JPG, WEBP up to 2MB</p>
              </div>
              <div v-else class="relative w-full">
                <img :src="coverPreviewUrl" alt="Image Preview" class="rounded-md w-full object-cover"/>
                <button @click.prevent="removeImage" type="button" class="absolute top-2 right-2 bg-white/75 backdrop-blur-sm rounded-full p-1 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-white">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>
          </div>
          <div class="p-6 bg-white rounded-lg shadow">
             <label for="slug" class="block text-sm font-medium text-gray-900">Slug (URL)</label>
             <input v-model="article.slug" type="text" id="slug" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50" />
          </div>
        </div>
      </div>
       <p v-if="errorMessage" class="text-sm font-bold text-red-600 mt-4 text-center bg-red-100 p-3 rounded-lg">{{ errorMessage }}</p>
    </form>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase';
import AdminLayout from '@/components/AdminLayout.vue';

const router = useRouter();
const loading = ref(false);
const errorMessage = ref(null);
const selectedFile = ref(null);
const coverPreviewUrl = ref(null);

const article = ref({
  title: '',
  slug: '',
  content: '',
  status: 'published',
});

const generateSlug = () => {
  article.value.slug = article.value.title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Ganti spasi dengan -
    .replace(/[^\w-]+/g, '') // Hapus karakter non-alfanumerik selain -
    .replace(/--+/g, '-') // Ganti -- ganda dengan satu -
    .replace(/^-+/, '') // Hapus - dari awal
    .replace(/-+$/, ''); // Hapus - dari akhir
};

const setFile = (file) => {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    errorMessage.value = "File harus berupa gambar (PNG, JPG, WEBP).";
    return;
  }
  selectedFile.value = file;
  coverPreviewUrl.value = URL.createObjectURL(file);
  errorMessage.value = null;
};

const handleFileSelected = (event) => setFile(event.target.files[0]);
const handleFileDrop = (event) => setFile(event.dataTransfer.files[0]);

const removeImage = () => {
  selectedFile.value = null;
  coverPreviewUrl.value = null;
  document.getElementById('cover_image').value = '';
};

const handleSave = async () => {
  try {
    loading.value = true;
    errorMessage.value = null;

    // Tambahan: Cek sesi pengguna sebelum melakukan aksi
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error("Sesi tidak valid. Silakan logout dan login kembali.");
    }

    let cover_image_url = null;
    if (selectedFile.value) {
      const file = selectedFile.value;
      const fileName = `${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('article_covers')
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('article_covers')
        .getPublicUrl(fileName);
      cover_image_url = urlData.publicUrl;
    }

    const { error: insertError } = await supabase.from('articles').insert([{
      title: article.value.title,
      slug: article.value.slug,
      content: article.value.content,
      status: article.value.status,
      cover_image_url: cover_image_url,
    }]);
    if (insertError) throw insertError;
    
    router.push('/admin/dashboard');
  } catch (err) {
    errorMessage.value = `Gagal menyimpan artikel: ${err.message}`;
  } finally {
    loading.value = false;
  }
};
</script>

