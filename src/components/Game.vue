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
                    <div class="form-group">
                        <label>
                            <input type="checkbox" v-model="cooldownEnabled" /> Cooldown Enabled
                        </label>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" v-model="autoBuff" /> Auto-Buff
                        </label>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" v-model="autoProtect" /> Auto-Protect
                        </label>
                    </div>
                </form>
            </div>
        </div>
        <div class="item-queue">
            <p>Item Queue</p>
            <div class="item-queue-items" v-if="itemQueue.length">
                <span class="tooltip-container" v-for="queueEntry in itemQueue">
                    <tooltip trigger="hover" placement="bottom" v-bind:content="`Target: ${queueEntry.target || 'meastes'}`">
                        <img class="img-item" v-bind:src="this.gameUtil.getImageUrl(queueEntry.item.Name)" />
                    </tooltip>
                </span>
            </div>
            <div v-if="!itemQueue.length">
                <small>No items currently queued.</small>
            </div>
        </div>
        <div class="item-cooldown-container" v-if="cooldownEnabled">
            <item-cooldown v-ref:cooldown></item-cooldown>
        </div>
    </div>
    <table class="table table-striped">
        <tr>
            <th></th>
            <th>Qty</th>
            <th>Name</th>
            <th>Rarity</th>
            <th class="hidden-sm hidden-xs">Description</th>
            <th></th>
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
                <button class="btn btn-primary" v-bind:data-item-id="item.Id" @click="this.useItem(item)"><span class="fa fa-hand-pointer-o"></span></button>
            </td>
            <td>
                <button class="btn btn-primary" @click="this.use100Items(item)">x100</button>
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
import PlayerService from '../services/player.service';
import GameUtil from '../util/game.util';

const MOOGLE = 'Moogle';
const WARTHOG = 'Warthog';
const SEVENS = '7777';
const RUSH_THE_DOG = 'Rush the Dog';
const STAR = 'Star';
const GOLD_RING = 'Gold Ring';
const MORGER_BEARD = 'Morger Beard';
const TANOOKI_SUIT = 'Tanooki Suit';

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
            cooldownEnabled: true,
            autoBuff: false,
            autoProtect: false,
            // Item state
            itemCDProgress: 0,
            itemQueue: [],
            // Timeouts
            itemUpdateTimeout: null,
            itemQueueTimeout: null,
            applyBuffsTimeout: null,
            // Internal use
            itemService: new ItemService(),
            playerService: new PlayerService(),
            gameUtil: new GameUtil(),
        };
    },
    attached() {
        this.toast = this.$refs.toastr;
        this.updateItems();
        this.processItemQueue();
        this.applyBuffs();
    },
    methods: {
        updateItems() {
            return this.itemService.getItems()
                .then(items => this.updateItemsWithChangedItems(items))
                .catch(err => {
                    console.error(err); // eslint-disable-line no-console
                    this.toast.e(JSON.stringify(err), 'Error');
                })
                .finally(() => {
                    clearTimeout(this.itemUpdateTimeout);
                    this.itemUpdateTimeout = setTimeout(() => this.updateItems(), 5000);
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
        use100Items(item) {
            for (let i = 0; i < 100; i++) {
                this.useItem(item);
            }
        },
        useItem(item) {
            const target = this.target !== '' ? this.target : undefined;
            const toQueue = { item, target };
            this.itemQueue.push(toQueue);
            this.toast.i(`Added item [${item.Name}] with target ` +
                `[${target || 'meastes'}] to the queue`, 'Item Queued');
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
                        let itemDelay = 300;
                        if (this.cooldownEnabled) {
                            this.$refs.cooldown.start();
                            clearTimeout(this.itemQueueTimeout);
                            itemDelay = 15000;
                        }
                        this.itemQueueTimeout =
                            setTimeout(() => this.processItemQueue(), itemDelay);
                    })
                    .catch(err => {
                        const json = JSON.parse(err.data);
                        this.toast.e(json.error.error, 'Error');
                        const toQueue = { item, target };
                        if (item.Quantity > 1) {
                            this.itemQueue.unshift(toQueue);
                        }
                        clearTimeout(this.updateTimeTimeout);
                        this.updateItems().then(() => this.processItemQueue());
                    });
            } else {
                clearTimeout(this.itemQueueTimeout);
                this.itemQueueTimeout = setTimeout(() => this.processItemQueue(), 1000);
            }
        },
        applyBuffs() {
            if (this.autoBuff) {
                this.playerService.getPlayerInfo()
                    .then(info => {
                        if (info.ActiveEffects) {
                            if (info.ActiveEffects.indexOf(MOOGLE) === -1 &&
                                this.itemQueue.filter(
                                    ({ item }) => item.Name === MOOGLE
                                ).length === 0) {
                                this.useItem({ Name: MOOGLE });
                            }
                            if (info.ActiveEffects.indexOf(WARTHOG) === -1 &&
                                this.itemQueue.filter(
                                    ({ item }) => item.Name === WARTHOG
                                ).length === 0) {
                                this.useItem({ Name: WARTHOG });
                            }
                            if (info.ActiveEffects.indexOf(SEVENS) === -1 &&
                                this.itemQueue.filter(
                                    ({ item }) => item.Name === SEVENS
                                ).length === 0) {
                                this.useItem({ Name: SEVENS });
                            }
                            if (info.ActiveEffects.indexOf(RUSH_THE_DOG) === -1 &&
                                this.itemQueue.filter(
                                    ({ item }) => item.Name === RUSH_THE_DOG
                                ).length === 0) {
                                this.useItem({ Name: RUSH_THE_DOG });
                            }
                        }
                    })
                    .finally(() => {
                        clearTimeout(this.applyBuffsTimeout);
                        this.applyBuffsTimeout = setTimeout(() => this.applyBuffs(), 1000);
                    });
            }
            if (this.autoProtect) {
                this.playerService.getPlayerInfo()
                    .then(info => {
                        if (info.ActiveEffects) {
                            if (info.ActiveEffects.indexOf(GOLD_RING) === -1 &&
                                this.itemQueue.filter(
                                    ({ item }) => item.Name === GOLD_RING
                                ).length === 0) {
                                this.useItem({ Name: GOLD_RING });
                            }
                            if (info.ActiveEffects.indexOf(STAR) === -1 &&
                                this.itemQueue.filter(
                                    ({ item }) => item.Name === STAR
                                ).length === 0) {
                                this.useItem({ Name: STAR });
                            }
                            if (info.ActiveEffects.indexOf(TANOOKI_SUIT) === -1 &&
                                this.itemQueue.filter(
                                    ({ item }) => item.Name === TANOOKI_SUIT
                                ).length === 0) {
                                this.useItem({ Name: TANOOKI_SUIT });
                            }
                            if (info.ActiveEffects.indexOf(MORGER_BEARD) === -1 &&
                                this.itemQueue.filter(
                                    ({ item }) => item.Name === MORGER_BEARD
                                ).length === 0) {
                                this.useItem({ Name: MORGER_BEARD });
                            }
                        }
                    })
                    .finally(() => {
                        clearTimeout(this.applyBuffsTimeout);
                        this.applyBuffsTimeout = setTimeout(() => this.applyBuffs(), 1000);
                    });
            }
            if (!this.autoBuff && !this.autoProtect) {
                clearTimeout(this.applyBuffsTimeout);
                this.applyBuffsTimeout = setTimeout(() => this.applyBuffs(), 1000);
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
    padding-bottom: 30px;
}
.form-target {
    padding-top: 15px;
}
.item-queue {
    height: 64px;
}
.item-queue-items {
    background-color: #444;
    border-radius: 5px;
    padding: 5px;
}
.item-cooldown-container {
    height: 64px;
}
.tooltip-container {
    position: relative;
}
td {
    font-size: 13px;
}
</style>
