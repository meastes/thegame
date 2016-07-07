<template>
    <div class="progress-cooldown">
        <p>Item Cooldown</p>
        <div class="progress">
            <progressbar :now="(cooldown / 240) * 100" type="info"></progressbar>
        </div>
    </div>
</template>

<script>
import { progressbar } from 'vue-strap';

export default {
    props: ['cooldown'],
    components: {
        progressbar,
    },
};
</script>

<style scoped>
.progress-cooldown {
    margin: 15px 0px 15px 0px;
}
</style>
