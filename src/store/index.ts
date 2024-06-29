import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";
import { Question } from "@/types";

export interface State {
  questions: Array<Question>;
  rewards: number | null;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({

  state: {
    questions: [],
    rewards: null,
  },

  mutations: {
    setQuestions(state, payload: Array<Question>) {
      state.questions = payload;
    },
    setRewards(state, rewards: number) {
      state.rewards = rewards;
    },
  },

  actions: {
    updateRewards({ commit }, rewards: number) {
      commit('setRewards', rewards);
    },
  },

  getters: {
    getRewards(state) {
      return state.rewards;
    },
  },
});
