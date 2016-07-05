<template>
    <div>
        <div>{{ name }}</div>
        <div>{{ points }}</div>
        <ul>
            <li v-for="effect in effects">{{ effect }}</li>
        </ul>
    </div>
</template>

<script>
import PlayerService from '../services/player.service';

export default {
    methods: {
        getPlayerInfo() {
            this.playerService.getPlayerInfo().then(info => {
                this.name = info.Name;
                this.points = info.Points;
                this.effects = info.ActiveEffects;
            });
        },
    },
    data() {
        return {
            name: '',
            points: 0,
            effects: [],
            playerService: new PlayerService(),
        };
    },
    attached() {
        this.getPlayerInfo();
    },
};
</script>

<style scoped>
</style>
