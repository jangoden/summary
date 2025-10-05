import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";

// 1. Import QuillEditor dan CSS-nya
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

// 2. Buat instance aplikasi
const app = createApp(App);

// 3. Daftarkan komponen QuillEditor secara global
app.component("QuillEditor", QuillEditor);

// 4. Gunakan plugin (seperti router)
app.use(router);

// 5. Mount aplikasi ke DOM di langkah terakhir
app.mount("#app");
