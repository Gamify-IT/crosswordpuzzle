import { mount, VueWrapper } from "@vue/test-utils";
import CrosswordpuzzleView from "@/views/CrosswordpuzzleView.vue";
import router from "@/router/index";
import { store } from "@/store/index";
import questionsJson from "@/assets/questions.json";

describe("GameView.vue", () => {
  let wrapper: VueWrapper;
  let questions: { question: string; answer: string }[];
  beforeEach(async () => {
    questions = questionsJson;
    store.commit("setQuestions", questions);
    const configurationName = "default";
    router.push("/" + configurationName + "/crosswordpuzzle");
    await router.isReady();
    wrapper = mount(CrosswordpuzzleView, {
      global: {
        plugins: [router, store],
      },
    });
  });
  it("Renders GameView with default questions", async () => {
    const startButton = wrapper.find("#evaluate-button");
    expect(startButton.exists()).toBe(true);
    expect(startButton.text()).toBe("Evaluate");

    for (const question of questions) {
      expect(wrapper.html()).toContain(question.question);
    }
  });
});
