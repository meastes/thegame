<template>
    <div class="leaderboard-container">
        <iframe v-bind:src="url"></iframe>
    </div>
</template>

<script>
export default {
    data() {
        return {
            url: 'http://thegameleaderboard.azurewebsites.net/#meastes',
        };
    },
};
</script>

<style scoped>
.leaderboard-container {
    width: 100%;
    overflow-x: hidden;
}
iframe {
    border: 0;
    width: 100%;
    height: 1400px;
}
</style>
