import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { BootstrapVue3 } from "bootstrap-vue-3";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { store } from "@/store";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(router);
app.use(store);
app.use(BootstrapVue3);
app.use(Toast);

app.mount("#app");
