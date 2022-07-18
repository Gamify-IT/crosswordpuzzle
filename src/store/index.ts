import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import { Question } from "@/types";
import questionsJson from "@/assets/questions.json";

export interface State {
  count: string;
  questions: Array<Question>;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    count: "Hello",
    questions: questionsJson,
  },
  mutations: {
    setQuestions(state, payload: Array<Question>) {
      state.questions = payload;
    },
  },
});

// define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}
