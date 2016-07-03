<template>
    <h1>Items</h1>
    <!-- <pre>
        {{ items | json }}
    </pre> -->
    <label>Target:</label><input v-model="target" />
    <ul>
        <li v-for="item in items">
            <div><img v-bind:src="this.getImageUrl(item.Fields[0].Name)" /></div>
            <div>Id: {{ item.Fields[0].Id }}
            <div>Name: {{ item.Fields[0].Name }}</div>
            <div>Description: {{ item.Fields[0].Description }}</div>
            <div><button @click="this.useItem(item.Fields[0].Id)">Use Item</button></div>
        </li>
    </ul>
</template>

<script>
import ItemService from '../services/item.service';

export default {
    methods: {
        getImageUrl(name) {
            return `//cloud.nerderylabs.com/rogueone/media/images/${this.getKabobName(name)}.png`;
        },
        getKabobName(name) {
            return name.toLowerCase().replace(/'/g, '').replace(/ /g, '-');
        },
        updateItems() {
            this.itemService.getItems().then(items => { this.items = items; });
        },
        useItem(id) {
            let target;
            if (this.target !== '') {
                target = this.target;
            }
            this.itemService.useItem(id, target).then(() => this.updateItems());
        },
    },
    data() {
        return {
            items: [],
            target: '',
            itemService: new ItemService(),
        };
    },
    created() {
        this.updateItems();
        setInterval(() => this.updateItems(), 5000);
    },
};
</script>
