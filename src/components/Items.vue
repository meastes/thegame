<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
  <pre>
      {{ items | json }}
  </pre>
</template>

<script>
import ItemService from '../services/item.service';
export default {
    data() {
        return {
            // note: changing this line won't causes changes
            // with hot-reload because the reloaded component
            // preserves its current state and we are modifying
            // its initial state.
            msg: 'Hello World!',
            items: [],
        };
    },
    created() {
        new ItemService().getItems().then(items => { this.items = items; });
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
</style>
