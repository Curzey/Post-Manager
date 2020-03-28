
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import moment from 'moment'
import momentTZ from 'moment-timezone'
import english from '@/locale/en.json'
import danish from '@/locale/da.json'

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(momentTZ().tz('Europe/Copenhagen')).format('DD/MM/YYYY HH:mm')
  }
})

Vue.use(BootstrapVue)

Vue.config.productionTip = false

Vue.prototype.languages = {
  danish: danish,
  english: english
}

Vue.prototype.defaultPrefferedLanguage = Vue.prototype.languages.english

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
