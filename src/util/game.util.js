export default class GameUtil {
    getImageUrl(name) {
        return `//cloud.nerderylabs.com/rogueone/media/images/${this.getKabobName(name)}.png`;
    }
    getKabobName(name) {
        return name.toLowerCase().replace(/[':]/g, '').replace(/ /g, '-');
    }
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
    }
    getUpdatedItems(oldItemMap, newItems) {
        return newItems.filter(item => {
            const oldItem = oldItemMap.get(item.Name);
            return oldItem === undefined || oldItem.Quantity !== item.Quantity;
        });
    }
    escapeHtml(text) {
        return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}
