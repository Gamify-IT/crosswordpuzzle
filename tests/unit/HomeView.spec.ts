import { mount, VueWrapper, flushPromises } from "@vue/test-utils";
import mockAxios from "jest-mock-axios";
import router from "@/router/index";
import HomeView from "@/views/HomeView.vue";

jest.mock("axios");

describe("HomeView.vue", () => {
  let wrapper: VueWrapper;
  const configurationName = "topic";

  beforeEach(async () => {
    router.push(`/${configurationName}`);
    await router.isReady();
    wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    });
  });
  test("Request data", async () => {
    const response = {
      data: [
        {
          id: 1,
          internalId: 1,
          question: "What is the main animal of the lecture PSE?",
          answer: "Hamster",
        },
        {
          id: 2,
          internalId: 1,
          question: "What is this question about?",
          answer: "I do not know",
        },
      ],
    };
    mockAxios.get.mockResolvedValueOnce(response);

    expect(router.currentRoute.value.fullPath).toBe(`/${configurationName}`);

    await flushPromises();

    // To be continued...
  });
});
