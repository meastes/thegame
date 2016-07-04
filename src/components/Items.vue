<template>
    <!-- <pre>
        {{ items | json }}
    </pre> -->
    <div class="alert alert-success" v-if="success">{{ success }}</div>
    <div class="alert alert-danger" v-if="error">{{ error }}</div>
    <form class="form_target">
        <div class="form-group">
            <label>Target:</label>
            <input class="form-control" v-model="target" placeholder="meastes" />
        </div>
    </form>
    <table class="table table-striped">
        <tr>
            <th></th>
            <th>Qty</th>
            <th>Name</th>
            <th>Rarity</th>
            <th>Description</th>
            <th></th>
        </tr>
        <tr v-for="item in items">
            <td><img class="img_item" v-bind:src="this.getImageUrl(item.Name)" /></td>
            <td>{{ item.Quantity }}</td>
            <td>{{ item.Name }}</td>
            <td>{{ item.Rarity }}</td>
            <td>{{ item.Description }}</td>
            <td><button class="btn btn-primary" @click="this.useItem(item.Id)" v-bind:disabled="itemsDisabled">Use Item</button></td>
        </tr>
    </table>
</template>

<script>
import ItemService from '../services/item.service';

export default {
    methods: {
        getImageUrl(name) {
            return `//cloud.nerderylabs.com/rogueone/media/images/${this.getKabobName(name)}.png`;
        },
        getKabobName(name) {
            return name.toLowerCase().replace(/[':]/g, '').replace(/ /g, '-');
        },
        updateItems() {
            this.itemService.getItems()
                .then(items => {
                    this.items = this.getFilteredItems(items);
                    setTimeout(() => this.updateItems(), 5000);
                })
                .catch(err => {
                    this.error = JSON.stringify(err);
                    setTimeout(() => this.updateItems(), 5000);
                });
        },
        getFilteredItems(items) {
            const itemList = new Map();
            items.forEach(item => {
                if (itemList.has(item.Name)) {
                    itemList.get(item.Name).Quantity++;
                } else {
                    const itemToAdd = item;
                    itemToAdd.Quantity = 1;
                    itemList.set(item.Name, itemToAdd);
                }
            });
            return [...itemList.values()]
            .sort((a, b) => {
                const rarity = b.Rarity - a.Rarity;
                if (rarity) return rarity;
                return a.Name.toLowerCase().localeCompare(b.Name.toLowerCase());
            });
        },
        useItem(id) {
            window.scrollTo(0, 0);
            this.itemsDisabled = true;
            let target;
            if (this.target !== '') {
                target = this.target;
            }
            this.itemService.useItem(id, target)
                .then(data => {
                    const json = JSON.parse(data);
                    this.success = json.result.Messages[0];
                    this.error = '';
                    setTimeout(() => { this.itemsDisabled = false; }, 60000);
                })
                .catch(err => {
                    const json = JSON.parse(err.data);
                    this.error = json.error.error;
                    this.success = '';
                    this.itemsDisabled = false;
                });
        },
    },
    data() {
        return {
            items: [],
            target: '',
            success: '',
            error: '',
            itemsDisabled: false,
            itemService: new ItemService(),
        };
    },
    attached() {
        this.updateItems();
    },
};
</script>

<style scoped>
.alert {
    margin: 10px;
}
.img_item {
    width: 32px;
}
.form_target {
    margin: 20px;
    display: flex;
    justify-content: center;
}
</style>
