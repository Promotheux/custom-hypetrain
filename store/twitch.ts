import { defineStore } from 'pinia';

interface TwitchState {
  accessToken: string | null;
  userId: number | null;
}

export const useTwitchStore = defineStore('twitch', {
  state: (): TwitchState => ({
    accessToken: null,
    userId: null,
  }),
  actions: {
    setAccessToken(token: string | null) {
      this.accessToken = token;
    },
    setUserId(id: number | null){
      this.userId = id;
    }
  },
  getters: {
    getAccessToken(state){
      return state.accessToken;
    },
    getUserId(state){
      return state.userId;
    }
  }
});