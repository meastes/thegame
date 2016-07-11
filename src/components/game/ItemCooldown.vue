<template>
    <div class="progress-cooldown">
        <p>Item Cooldown</p>
        <div class="progress">
            <progressbar :now="(progress / 240) * 100" type="info"></progressbar>
        </div>
    </div>
</template>

<script>
import { progressbar } from 'vue-strap';

export default {
    components: {
        progressbar,
    },
    data() {
        return {
            progress: 0,
            progressTimeout: null,
        };
    },
    methods: {
        start() {
            this.progress = 0;
            clearTimeout(this.progressTracker);
            this.updateProgress();
        },
        updateProgress() {
            if (this.progress > 239) {
                this.progress = 0;
            } else {
                this.progress++;
                clearTimeout(this.progressTracker);
                this.progressTimeout = setTimeout(() => this.updateProgress(), 250);
            }
        },
    },
};
</script>

<style scoped>
.progress-cooldown {
    margin: 15px 0px 15px 0px;
}
</style>
