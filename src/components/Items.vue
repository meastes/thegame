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
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th></th>
        </tr>
        <tr v-for="item in items">
            <td><img class="img_item" v-bind:src="this.getImageUrl(item.Fields[0].Name)" /></td>
            <td>{{ item.Fields[0].Id }}</td>
            <td>{{ item.Fields[0].Name }}</td>
            <td>{{ item.Fields[0].Description }}</td>
            <td><button class="btn btn-primary" @click="this.useItem(item.Fields[0].Id)">Use Item</button></td>
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
            this.itemService.useItem(id, target)
                .then(json => {
                    this.updateItems();
                    this.sucess = json.result.Messages[0];
                })
                .catch(err => {
                    const json = JSON.parse(err.data);
                    this.error = json.error.error;
                });
        },
    },
    data() {
        return {
            items: [],
            target: '',
            success: '',
            error: '',
            itemService: new ItemService(),
        };
    },
    attached() {
        this.updateItems();
        setInterval(() => this.updateItems(), 5000);
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
