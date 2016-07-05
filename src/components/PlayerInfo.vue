<template>
    <div>
        <div>{{ name }}</div>
        <div>{{ points }}</div>
        <ul>
            <li v-for"effect in effects">{{ effect }}</li>
        </ul>
    </div>
</template>

<script>
 export default {
     data() {
         return {
             name: 'meastes',
             points: 123,
             effects: ['a', 'b', 'c'],
         };
     },
 };
</script>

<style scoped>
</style>
