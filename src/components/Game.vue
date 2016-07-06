<template>
    <alert type="success" v-if="success">{{ success }}</alert>
    <alert type="danger" v-if="error">{{ error }}</alert>
    <div class="container header">
        <div class="row">
            <div class="col-md-10">
                <player-info></player-info>
            </div>
            <div class="col-md-2">
                <form class="form-target">
                    <div class="form-group">
                        <label>Target:</label>
                        <input class="form-control" v-model="target" placeholder="meastes" />
                    </div>
                </form>
            </div>
        </div>
        <item-cooldown v-bind:cooldown="itemCDProgress"></item-cooldown>
    </div>
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
                    <tooltip trigger="hover" placement="right" v-bind:content="item.Description">
                        <img class="img_item" v-bind:src="this.gameUtil.getImageUrl(item.Name)" />
                    </tooltip>
                </div>
            </td>
            <td>{{ item.Quantity }}</td>
            <td>{{ item.Name }}</td>
            <td>{{ item.Rarity }}</td>
            <td class="hidden-sm hidden-xs">{{ item.Description }}</td>
            <td><button class="btn btn-primary" @click="this.useItem(item.Id)" v-bind:disabled="itemsDisabled"><span class="fa fa-hand-pointer-o"></span></button></td>
        </tr>
    </table>
</template>

<script>
import { alert, tooltip } from 'vue-strap';
import ItemCooldown from './game/ItemCooldown';
import PlayerInfo from './game/PlayerInfo';
import ItemService from '../services/item.service';
import GameUtil from '../util/game.util';

export default {
    components: {
        alert,
        tooltip,
        ItemCooldown,
        PlayerInfo,
    },
    data() {
        return {
            items: [],
            target: '',
            itemCDProgress: 0,
            success: '',
            error: '',
            itemsDisabled: false,
            itemService: new ItemService(),
            gameUtil: new GameUtil(),
        };
    },
    attached() {
        this.updateItems();
    },
    methods: {
        updateItems() {
            this.itemService.getItems()
                .then(items => {
                    this.updateItemsWithChangedItems(items);
                    setTimeout(() => this.updateItems(), 5000);
                })
                .catch(err => {
                    console.error(err); // eslint-disable-line no-console
                    this.error = JSON.stringify(err);
                    setTimeout(() => {
                        this.updateItems();
                        this.error = '';
                    }, 5000);
                });
        },
        updateItemsWithChangedItems(items) {
            const oldItemMap = new Map();
            this.items.forEach(item => oldItemMap.set(item.Name, item));
            const newItemMap = this.gameUtil.getSquashedItemMap(items);
            const updatedItems =
                this.gameUtil.getUpdatedItems(oldItemMap, [...newItemMap.values()]);
            if (updatedItems.length) {
                // Update quantities in old items, and add missing items
                const updatedItemMap = this.getUpdatedItemMap(oldItemMap, updatedItems);
                // Sort the items by rarity and name
                this.items = [...updatedItemMap.values()].sort((a, b) => {
                    const rarity = b.Rarity - a.Rarity;
                    if (rarity) return rarity;
                    return a.Name.toLowerCase().localeCompare(b.Name.toLowerCase());
                });
            }
        },
        getUpdatedItemMap(oldItemMap, updatedItems) {
            const updatedItemMap = oldItemMap;
            updatedItems.forEach(item => {
                if (updatedItemMap.has(item.Name)) {
                    updatedItemMap.get(item.Name).Id = item.Id;
                    updatedItemMap.get(item.Name).Quantity = item.Quantity;
                } else {
                    updatedItemMap.set(item.Name, item);
                }
            });
            return updatedItemMap;
        },
        useItem(id) {
            window.scrollTo(0, 0);
            this.itemsDisabled = true;
            const target = this.target !== '' ? this.target : undefined;
            this.itemService.useItem(id, target)
                .then(data => {
                    const json = JSON.parse(data);
                    this.success = json.result.Messages[0];
                    this.error = '';
                    // Dismiss message after 5 seconds
                    setTimeout(() => { this.success = ''; }, 5000);
                    this.updateItemCooldownProgress();
                })
                .catch(err => {
                    const json = JSON.parse(err.data);
                    this.error = json.error.error;
                    this.success = '';
                    // Dismiss message after 5 seconds
                    setTimeout(() => { this.error = ''; }, 5000);
                    this.itemsDisabled = false;
                });
        },
        updateItemCooldownProgress() {
            if (this.itemCDProgress > 59) {
                this.itemCDProgress = 0;
                this.itemsDisabled = false;
            } else {
                this.itemCDProgress++;
                setTimeout(() => this.updateItemCooldownProgress(), 1000);
            }
        },
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
.header {
    padding-bottom: 10px;
}
.form-target {
    padding-top: 15px;
}
.tooltip-container {
    position: relative;
}
td {
    font-size: 13px;
}
</style>
