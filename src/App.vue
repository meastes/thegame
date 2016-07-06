<template>
    <div id="app">
        <div class="header">
            <h1>The Game</h1>
        </div>
        <game></game>
        <leaderboard></leaderboard>
    </div>
</template>

<script>
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';

export default {
    components: {
        Game,
        Leaderboard,
    },
};
</script>

<style scoped>
.header {
    display: flex;
    justify-content: center;
}
</style>
