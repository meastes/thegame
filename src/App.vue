<template>
    <div id="app">
        <div class="header">
            <div>
                <h1>The Game</h1>
                <small class="site-link"><a href="http://thegame.nerderylabs.com">Official Site</a></small>
            </div>
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
.header, .site-link {
    display: flex;
    justify-content: center;
}
</style>
