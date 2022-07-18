import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { store, key } from "@/store";

const app = createApp(App);

app.use(router);
app.use(store, key);

app.mount("#app");
