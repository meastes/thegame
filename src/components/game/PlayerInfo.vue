<template>
    <div class="container">
        <div class="player-points">
            <div><h1>{{ points }}</h1></div>
            <div><h4>{{ name }}</h4></div>
        </div>
        <span class="effect text-warning" v-for="effect in effects">{{ effect }}</span>
    </div>
</template>

<script>
import PlayerService from '../../services/player.service';

export default {
    methods: {
        getPlayerInfo() {
            this.playerService.getPlayerInfo().then(info => {
                this.name = info.Name;
                this.points = info.Points;
                this.effects = info.ActiveEffects;
                setTimeout(() => this.getPlayerInfo(), 1000);
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
h4 {
    letter-spacing: 11px;
}
.player-points {
    display: inline-block;
}
.effect {
    margin: 0px 5px 0px 5px;
    padding: 8px;
    border: 1px solid #aaa;
}
</style>
