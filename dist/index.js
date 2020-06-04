"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Problem #1: Return the PLK menu
 * - Respond to `GET /menu` requests
 * - Return `./data/menu.json` on a `data` property
 */
const menu_json_1 = __importDefault(require("./data/menu.json"));
async function menuHandler() {
    return {
        body: JSON.stringify({
            data: menu_json_1.default
        }),
        statusCode: 200
    };
}
exports.menuHandler = menuHandler;
/**
 * Problem #2: Map PLU to `itemId` on the user's cart
 * - Respond to `GET /cart` requests
 *
 * - Add an `itemId` property on all items (`order.items[]`)
 *   and modifiers (`order.items[].modifiers[]`) in the cart defined
 *   by `./data/cart.json`
 *
 * - Use the PLU to Item ID mapping in `plus.json` to determine the correct
 *   item ID for a given PLU (eg the PLU `11` has an item ID of `0`).
 * - Return the enriched cart on a `data` property
 */
const plus_json_1 = __importDefault(require("./data/plus.json"));
const cart_json_1 = __importDefault(require("./data/cart.json"));
let mapPlu = {};
mapPlu = JSON.parse(plus_json_1.default.data.RestaurantPosData.plus);
// console.log('parsedPlus: ', mapPlu);
function enhanceCart() {
    let iniCartStr = JSON.stringify(cart_json_1.default);
    let enhanced = JSON.parse(iniCartStr);
    let items = enhanced.order.items;
    if (items) {
        items = items.map(item => {
            item.itemId = idByPlu(item.plunum);
            delete item.plunum;
            if (item.modifiers) {
                item.modifiers.forEach((modifier) => {
                    modifier.itemId = idByPlu(modifier.plunum);
                    delete modifier.plunum;
                });
            }
        });
    }
    return enhanced;
}
// just a helper function - shall be discussed case of absent PLU info that may be one of five: null, "", 0, undefined, err
const idByPlu = (plunum) => {
    let id = mapPlu['plu_' + plunum];
    return id ? id : null;
};
async function cartHandler() {
    let cart = enhanceCart();
    return {
        body: JSON.stringify({ data: cart }),
        statusCode: 200
    };
}
exports.cartHandler = cartHandler;
/**
 * Problem #3: Compute min & max calories for a 4PC chicken combo
 * - Respond to `GET /4pc-chicken/calories` requests
 * - Compute the min & max _possible_ calories for a 4 piece chicken combo,
 *   according to the nutritional information in `./data/4pc-chicken.json` (see "Combo Data Structure" below)
 * - Return the min & max calories on a `data` property
 *
 * # Combo Data Structure
 * - A combo is composed of multiple _combo items_ (`comboItems`).
 *
 * - For each item in the combo, the user must select a number of _options_ (`comboItemOptions`)
 *   equal to the amount required by the property `amountRequiredToSelect` on the combo item.
 *
 * - Each option for a combo item has a `minAmount` and `maxAmount`, which dictate the min & max amounts of items that may be selected.
 *   For example an item with a min amount of 1 and a max amount of 1 is guaranteed to be included once (and only once) in the combo,
 *   and an item with a min amount of 0 and a max amount of 2 may be included 0, 1, or 2 times in the combo
 *
 * - The min and max calories is a function of these restrictions on item selection within the combo
 *
 * Example response:
 * ```json
 * HTTP 200
 * {
 *   data: {
 *     maxCalories: 9001,
 *     minCalories: 8999,
 *   }
 * }
 * ```
 */
const _4pc_chicken_json_1 = __importDefault(require("./data/4pc-chicken.json"));
const caloriesCount = (combo) => {
    let caloriesCount = { minCalories: 0, maxCalories: 0 };
    if (combo.comboItems) {
        combo.comboItems.forEach((comboItem) => {
            let required = comboItem.amountRequiredToSelect;
            let calData = comboItem.comboItemOptions.map(Item => {
                return {
                    calories: Item.option.nutrition.calories,
                    minAmount: Item.minAmount,
                    maxAmount: Item.maxAmount,
                };
            });
            let calDataSortedAsc = calDataSorting(calData);
            let calDataSortedDesc = calDataSortedAsc.slice(0).reverse();
            caloriesCount.minCalories += calcAmount(required, calDataSortedAsc);
            caloriesCount.maxCalories += calcAmount(required, calDataSortedDesc);
        });
    }
    return caloriesCount;
};
const calDataSorting = (Data) => {
    Data.sort((item1, item2) => {
        if (item1.calories === item2.calories) {
            return 0;
        }
        if (item1.calories > item2.calories) {
            return 1;
        }
        return -1;
    });
    return Data;
};
const calcAmount = (required, calSorted) => {
    let calcCalories = 0;
    calSorted.forEach(nutriCalories => {
        var amount;
        var requiredAmount;
        // limits logic applied for each option
        if (required) {
            requiredAmount = (required < nutriCalories.minAmount) ? 0 : required;
            amount = Math.min(requiredAmount, nutriCalories.maxAmount);
            if (amount) {
                calcCalories += nutriCalories.calories * amount;
                required -= amount;
            }
        }
    });
    return calcCalories;
};
let possibleCalories = caloriesCount(_4pc_chicken_json_1.default);
async function calorieCounterHandler() {
    return {
        body: JSON.stringify({
            data: possibleCalories
        }),
        statusCode: 200
    };
}
exports.calorieCounterHandler = calorieCounterHandler;
//# sourceMappingURL=index.js.map