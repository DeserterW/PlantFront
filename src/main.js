import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import installElementPlus from './plugins/element'
import './assets/css/icon.css'
import _ from 'lodash'
import { reactive } from 'vue'
import dayjs from 'dayjs'

const app = createApp(App)
installElementPlus(app)
app
    .use(store)
    .use(router)
    .mount('#app')

