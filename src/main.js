import './assets/main.css'
// we import the necessary modules from Vue and Pinia, as well as the main App component and the router configuration. We then create a Vue application instance, register Pinia and the router, and mount the app to the DOM element with the id 'app'.
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// we create a Vue application instance using the createApp function, passing in the main App component. We then use the createPinia function to set up state management with Pinia, and register the router for handling navigation. Finally, we mount the app to the DOM element with the id 'app'.
const app = createApp(App)

app.use(createPinia())
app.use(router)
// we mount the Vue application to the DOM element with the id 'app', which is typically defined in the index.html file of the project. This allows the Vue app to take control of that part of the DOM and render its components.
app.mount('#app')
