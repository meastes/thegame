<template>
    <vue-toastr v-ref:toastr></vue-toastr>
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
        <div class="item-queue">
            <p>Item Queue</p>
            <span class="tooltip-container" v-for="queueEntry in itemQueue">
                <tooltip trigger="hover" placement="bottom" v-bind:content="queueEntry.item.Description">
                    <img class="img-item" v-bind:src="this.gameUtil.getImageUrl(queueEntry.item.Name)" />
                </tooltip>
            </span>
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
                        <img class="img-item" v-bind:src="this.gameUtil.getImageUrl(item.Name)" />
                    </tooltip>
                </div>
            </td>
            <td>{{ item.Quantity }}</td>
            <td>{{ item.Name }}</td>
            <td>{{ item.Rarity }}</td>
            <td class="hidden-sm hidden-xs">{{ item.Description }}</td>
            <td>
                <button class="btn btn-primary" @click="this.useItem(item)"><span class="fa fa-hand-pointer-o"></span></button>
            </td>
        </tr>
    </table>
</template>

<script>
import { tooltip } from 'vue-strap';
import vueToastr from 'vue-toastr';
import 'vue-toastr/dist/vue-toastr.min.css';
import ItemCooldown from './game/ItemCooldown';
import PlayerInfo from './game/PlayerInfo';
import ItemService from '../services/item.service';
import GameUtil from '../util/game.util';

export default {
    components: {
        tooltip,
        vueToastr,
        ItemCooldown,
        PlayerInfo,
    },
    data() {
        return {
            items: [],
            target: '',
            // Item state
            itemCDProgress: 0,
            itemQueue: [],
            // Internal use
            itemService: new ItemService(),
            gameUtil: new GameUtil(),
        };
    },
    attached() {
        this.toast = this.$refs.toastr;
        this.updateItems();
        this.processItemQueue();
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
                    this.toast.e(JSON.stringify(err), 'Error');
                    setTimeout(() => this.updateItems(), 5000);
                });
        },
        updateItemsWithChangedItems(items) {
            const oldItemMap = this.getItemMap();
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
        getItemMap() {
            const itemMap = new Map();
            this.items.forEach(item => itemMap.set(item.Name, item));
            return itemMap;
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
        useItem(item) {
            const target = this.target !== '' ? this.target : undefined;
            this.itemQueue.push({ item, target });
            this.toast.i(`Added item (${item.Name}) with target ` +
                `(${target || 'meastes'}) to the queue`, 'Item Queued');
        },
        processItemQueue() {
            if (this.itemQueue.length) {
                const { item, target } = this.itemQueue.shift();
                const id = this.getItemMap().get(item.Name).Id; // Get the most recent ID
                this.itemService.useItem(id, target)
                    .then(data => {
                        const json = JSON.parse(data);
                        this.toast.s(
                            this.gameUtil.escapeHtml(json.result.Messages[0]), 'Item used');
                        this.itemCDProgress = 0;
                        this.updateItemCooldownProgress();
                        setTimeout(() => this.processItemQueue(), 61000);
                    })
                    .catch(err => {
                        const json = JSON.parse(err.data);
                        this.toast.e(json.error.error, 'Error');
                        this.processItemQueue();
                    });
            } else {
                setTimeout(() => this.processItemQueue(), 1000);
            }
        },
        updateItemCooldownProgress() {
            if (this.itemCDProgress > 239) {
                this.itemCDProgress = 0;
            } else {
                this.itemCDProgress++;
                setTimeout(() => this.updateItemCooldownProgress(), 250);
            }
        },
    },
};
</script>

<style scoped>
.alert {
    margin: 10px;
}
.img-item {
    width: 32px;
}
.img-item-small {
    width: 16px;
}
.header {
    padding-bottom: 10px;
}
.form-target {
    padding-top: 15px;
}
.item-queue {
    height: 64px;
}
.tooltip-container {
    position: relative;
}
td {
    font-size: 13px;
}
</style>