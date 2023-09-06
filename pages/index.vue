<template>
  <div v-if="!isValidToken">
    LinkTijger's Hype Train staat nog in de remise! Even geduld...
  </div>
  <div v-else>
    <TwitchTrainStation></TwitchTrainStation>
  </div>

</template>

<script>
import { useTwitchStore } from '@/store/twitch';
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  data(){
    return {
      'isValidToken': false,
      'validToken': '',
    }
  },
  methods: {
      initiateOAuth() {
        const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${this.$config.public.twitchClientId}&redirect_uri=${this.$config.public.twitchRedirectUri}&scope=channel:read:hype_train&response_type=token`;
        navigateTo(authUrl, {external: true});
      },
      async isValid(accessToken){
        return await this.validateAccessToken(accessToken);
      },
      async validateAccessToken(token){
        const store = useTwitchStore();
        try {
            const response = await fetch('https://id.twitch.tv/oauth2/validate', {
              headers: {
                'Authorization': `Bearer ${token}`
              },
            });
            
            if (response.ok) {
              store.setAccessToken(token);
              const userId = await this.setUserId();
              this.validToken = token;
              this.isValidToken = true;
              
              return true;
            } else {
              this.isValidToken = false;
              store.setAccessToken(null);
              this.setUserId(null);
              return false;
            }
          } catch (error) {
            // Handle error (e.g., network error)
            console.error('Error validating access token:', error);
          }
      },
      async setUserId() {
        const store = useTwitchStore();
        try {
            const response = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Client-ID': `${this.$config.public.twitchClientId}`,
                'Authorization': `Bearer ${store.getAccessToken}`
            }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data from Twitch API');
            }

            const data = await response.json();

            // Check if the response contains user data
            if (data.data && data.data.length > 0) {
                // Assuming the first user in the list is the one you're interested in
                const userId = data.data[0].id;
                store.setUserId(userId);
            }
        } catch (error) {
            console.error('Error fetching user ID:', error);
            throw error;
        }
    },
  },
  async mounted(){
    if(this.$route.hash && this.$route.hash.indexOf('access_token') > -1){
      this.isValid(this.$route.hash.substring(1).split('&')[0].split('=')[1]);
    } else {
      this.initiateOAuth();
    }
  },
});
</script>