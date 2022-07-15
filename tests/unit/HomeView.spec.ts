import { mount, VueWrapper } from "@vue/test-utils";
import HomeView from "@/views/HomeView.vue";
import router from "@/router/index";

describe("HomeView.vue", () => {
  let wrapper: VueWrapper;
  beforeEach(async () => {
    const configurationName = "default";
    router.push("/" + configurationName);
    await router.isReady();
    wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    });
  });
  it("renders correctly with default questions", () => {
    const startButton = wrapper.find("#start-button");
    expect(startButton.exists()).toBe(true);
    expect(startButton.text()).toBe("Start");
  });
});
