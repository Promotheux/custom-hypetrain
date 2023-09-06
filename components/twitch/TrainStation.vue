<template>
    <div v-if="devMode == 'development'"> Check if there is a train incomming</div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useTwitchStore } from '@/store/twitch';

export default defineComponent({
    data(){
        return {
            'trainCooldown': null,
            'trainStartedAt': null,
            'trainExpiresAt': null,
            'currentLevel': 0,
            'devMode':  process.env.NODE_ENV,
        }
    },
    computed: {
        token() {
            return useTwitchStore().getAccessToken;
        },
        userId() {
            return useTwitchStore().getUserId;
        }
    },
    methods: {
        async initiateHypetrain(){
            try {
                const response = await fetch(`https://api.twitch.tv/helix/hypetrain/events?broadcaster_id=${this.userId}`, {
                    headers: {
                        'Client-ID': `${this.$config.public.twitchClientId}`,
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                if(!response.ok){
                    throw new Error('Failed to fetch the train from Twitch API');
                }

                const data = await response.json();
                if(data.data && data.data.length > 0){
                    this.trainStartedAt = data.data[0].event_data['started_at'];
                    this.trainExpiresAt = data.data[0].event_data['expires_at'];
                    this.trainCooldown = data.data[0].event_data['cooldown_end_time'];
                    this.currentLevel = data.data[0].event_data['level'];
                }
            } catch(error) {
                console.error('Error fetching Train info', error);
            }
        }
    },
    mounted(){
        this.initiateHypetrain();
    }
});
</script>