<template>
    <alert type="success" v-if="success">{{ success }}</alert>
    <alert type="danger" v-if="error">{{ error }}</alert>
    <form class="form_target">
        <div class="form-group">
            <label>Target:</label>
            <input class="form-control" v-model="target" placeholder="meastes" />
        </div>
    </form>
    <div class="table-responsive">
        <table class="table table-striped">
            <tr>
                <th></th>
                <th>Qty</th>
                <th>Name</th>
                <th>Rarity</th>
                <th class="hidden-sm hidden-xs">Description</th>
                <th></th>
            </tr>
            <tr v-for="item in items">
                <td>
                    <div class="tooltip-container">
                        <tooltip trigger="hover" placement="bottom" v-bind:content="item.Description">
                            <img class="img_item" v-bind:src="this.getImageUrl(item.Name)" />
                        </tooltip>
                    </div>
                </td>
                <td>{{ item.Quantity }}</td>
                <td>{{ item.Name }}</td>
                <td>{{ item.Rarity }}</td>
                <td class="hidden-sm hidden-xs">{{ item.Description }}</td>
                <td><button class="btn btn-primary" @click="this.useItem(item.Id)" v-bind:disabled="itemsDisabled"><span class="fa fa-hand-grab-o"></span></button></td>
            </tr>
        </table>
    </div>
</template>

<script>
import { alert, tooltip } from 'vue-strap';
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
                    this.updateItemsWithChangedItems(items);
                    setTimeout(() => this.updateItems(), 5000);
                })
                .catch(err => {
                    console.error(err); // eslint-disable-line no-console
                    this.error = JSON.stringify(err);
                    setTimeout(() => this.updateItems(), 5000);
                });
        },
        updateItemsWithChangedItems(items) {
            const oldItemMap = new Map();
            this.items.forEach(item => oldItemMap.set(item.Name, item));
            const newItemMap = this.getSquashedItemMap(items);
            const updatedItems = this.getUpdatedItems(oldItemMap, [...newItemMap.values()]);
            if (updatedItems.length) {
                // Update quantities in old items, and add missing items
                updatedItems.forEach(item => {
                    if (oldItemMap.has(item.Name)) {
                        oldItemMap.get(item.Name).Quantity = item.Quantity;
                    } else {
                        oldItemMap.set(item.Name, item);
                    }
                });
                // Sort the items by rarity and name
                this.items = [...oldItemMap.values()].sort((a, b) => {
                    const rarity = b.Rarity - a.Rarity;
                    if (rarity) return rarity;
                    return a.Name.toLowerCase().localeCompare(b.Name.toLowerCase());
                });
            }
        },
        getSquashedItemMap(items) {
            const itemMap = new Map();
            items.forEach(item => {
                if (itemMap.has(item.Name)) {
                    itemMap.get(item.Name).Quantity++;
                } else {
                    const itemToAdd = item;
                    itemToAdd.Quantity = 1;
                    itemMap.set(item.Name, itemToAdd);
                }
            });
            return itemMap;
        },
        getUpdatedItems(oldItemMap, newItems) {
            return newItems.filter(item => {
                const oldItem = oldItemMap.get(item.Name);
                return oldItem === undefined || oldItem.Quantity !== item.Quantity;
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
    components: {
        alert,
        tooltip,
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
.tooltip-container {
    position: relative;
}
td {
    font-size: 13px;
}
</style>
