// import './assets/main.css'

// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')
import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// ១. បន្ថែម Toastification
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// ២. ប្រើប្រាស់ Toast ក្នុង App
app.use(Toast) 
app.use(router)

app.mount('#app')