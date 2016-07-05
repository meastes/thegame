<template>
    <div id="app">
        <div class="header">
            <h1>The Game</h1>
        </div>
        <player-info></player-info>
        <items></items>
        <leaderboard></leaderboard>
    </div>
</template>

<script>
import Items from './components/Items';
import Leaderboard from './components/Leaderboard';
import PlayerInfo from './components/PlayerInfo';

export default {
    components: {
        Items,
        Leaderboard,
        PlayerInfo,
    },
};
</script>

<style scoped>
.header {
    display: flex;
    justify-content: center;
}
</style>
