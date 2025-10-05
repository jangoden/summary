<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-800">Admin Panel</h1>
          </div>
          <div class="flex items-center">
            <button
              @click="handleLogout"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
    <main class="py-8">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase';

const router = useRouter();

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    router.push('/admin/login');
  } else {
    console.error('Error logging out:', error.message);
  }
};
</script>