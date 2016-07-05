<template>
    <div id="app">
        <div class="header">
            <h1>The Game</h1>
        </div>
        <player-info></player-info>
        <items></items>
    </div>
</template>

<script>
import Items from './components/Items';
import PlayerInfo from './components/PlayerInfo';

export default {
    components: {
        Items,
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
