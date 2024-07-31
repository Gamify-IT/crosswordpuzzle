import { createStore } from 'vuex';

export default createStore({
    state: {
        score: 0,
        rewards: 0,
    },
    mutations: {
        setScore(state, score) {
            state.score = score;
        },
        setRewards(state, rewards) {
            state.rewards = rewards;
        },
    },
    actions: {
        updateScore({ commit }, score) {
            commit('setScore', score);
        },
        updateRewards({ commit }, rewards) {
            commit('setRewards', rewards);
        },
    },
    modules: {},
});
