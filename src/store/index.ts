import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";
import { Question } from "@/types";

export interface State {
  questions: Array<Question>;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  mutations: {
    setQuestions(state, payload: Array<Question>) {
      state.questions = payload;
    },
  },
});
