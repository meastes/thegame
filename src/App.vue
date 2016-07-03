<template>
    <div id="app">
        <div class="header">
            <h1>The Game</h1>
        </div>
        <items></items>
    </div>
</template>

<script>
import Items from './components/Items';

export default {
    components: {
        Items,
    },
};
</script>

<style scoped>
.header {
    display: flex;
    justify-content: center;
}
</style>
