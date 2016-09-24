import Vue from 'vue';
import App from './app';

new Vue({ // eslint-disable-line
  el: '#app',
  <% if (!vueVersion) { %>components: { App }<% } else { %>render: h => h(App)<% } %>
});
