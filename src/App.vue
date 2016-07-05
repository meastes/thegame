<template>
    <div id="app">
        <div class="header">
            <h1>The Game</h1>
        </div>
        <items></items>
        <leaderboard></leaderboard>
    </div>
</template>

<script>
import Items from './components/Items';
import Leaderboard from './components/Leaderboard';

export default {
    components: {
        Items,
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
