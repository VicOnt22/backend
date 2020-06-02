"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const popeyesMenu = require("./data/menu.json");
const rawCart = require("./data/cart.json");
const plus = require("./data/plus.json");
const calories = require("./data/4pc-chicken.json");
let pluMapping = {};
try {
    pluMapping = JSON.parse(plus.data.RestaurantPosData.plus);
}
catch (e) {
    console.error('PLU mapping not in JSON format:', e);
}
let calorieCount = calculateCalorieOptions();
function mapCart() {
    let cart = JSON.parse(JSON.stringify(rawCart));
    if (cart.order && cart.order.items) {
        cart.order.items.forEach((item) => {
            item.itemId = mapPlu2ItemId(item.plunum);
            delete item.plunum;
            if (item.modifiers) {
                item.modifiers.forEach((modifier) => {
                    modifier.itemId = mapPlu2ItemId(modifier.plunum);
                    delete modifier.plunum;
                });
            }
        });
    }
    return cart;
}
// The idea is to sort the options by calory count and start from either end, maximizing count intake 
// given the provided parameters. Since the items are in sorted order, on one end you will be consuming
// least calorie rich items, on the other end, most calorie rich items.
// This problem might not have a proper solution, given menu configuration. For example, in case
// we are required to select 5 items, but all choices have a minimum of 10, such requirements 
// cannot be satisfied.
// I left the console.log statements in to demonstrate what is being selected for both min and
// max strategies
function calculateCalorieOptions() {
    let calorieCount = { minCalories: 0, maxCalories: 0 };
    //console.log("---")
    if (calories.comboItems) {
        calories.comboItems.forEach((comboItem) => {
            let amountRequiredToSelect = comboItem.amountRequiredToSelect;
            let cals = comboItem.comboItemOptions.map(comboItemOption => { return { calories: comboItemOption.option.nutrition.calories, minAmount: comboItemOption.minAmount, maxAmount: comboItemOption.maxAmount, name: comboItemOption.option.name.en }; });
            cals.sort((item1, item2) => {
                if (item1.calories == item2.calories) {
                    return 0;
                }
                if (item1.calories > item2.calories) {
                    return 1;
                }
                return -1;
            });
            //console.log("Selecting:", comboItem.name.en)
            // To find min, find the lowest calory item, take max possible number out of amountRequiredToSelect, continue to the next
            // least caloric item
            cals.forEach(cal => {
                if (amountRequiredToSelect > 0) {
                    // Find the maximum possible number of items to count against given the constraints
                    // We need to accomodate a total of amountRequiredToSelect, but can only choose between minAmount and maxAmount
                    // If amountRequiredToSelect is below minAmount, we skip this option
                    // If amountRequiredToSelect is not 0, and exceeds maxAmount, we trim it to the upper boundary
                    let amount = Math.min(amountRequiredToSelect < cal.minAmount ? 0 : amountRequiredToSelect, cal.maxAmount);
                    if (amount > 0) {
                        calorieCount.minCalories += cal.calories * amount;
                        amountRequiredToSelect -= amount;
                        //console.log("Min:", cal.name, ", Calories: "+cal.calories , "Count: " +maxItems)
                    }
                }
            });
            // Handle max calories the same, just from the opposite end
            cals = cals.slice(0).reverse();
            amountRequiredToSelect = comboItem.amountRequiredToSelect;
            cals.forEach(cal => {
                if (amountRequiredToSelect > 0) {
                    let amount = Math.min(amountRequiredToSelect < cal.minAmount ? 0 : amountRequiredToSelect, cal.maxAmount);
                    if (amount > 0) {
                        calorieCount.maxCalories += cal.calories * amount;
                        amountRequiredToSelect -= amount;
                        //console.log("Max:", cal.name, ", Calories: "+cal.calories , "Count: " +maxItems)
                    }
                }
            });
        });
    }
    return calorieCount;
}
function mapPlu2ItemId(plu) {
    var itemId = pluMapping['plu_' + plu];
    return itemId ? itemId : 0;
}
/**
 * Problem #1: Return the PLK menu
 * - Respond to `GET /menu` requests
 * - Return `./data/menu.json` on a `data` property
 *
 * Example response:
 * ```json
 * HTTP 200
 * { data: $menu }
 * ```
 */
async function menuHandler() {
    return {
        body: JSON.stringify({
            data: popeyesMenu
        }),
        statusCode: 200
    };
}
exports.menuHandler = menuHandler;
/**
 * Problem #2: Map PLU to `itemId` on the user's cart
 * - Respond to `GET /cart` requests
 * - Add an `itemId` property on all items (`order.items[]`)
 *   and modifiers (`order.items[].modifiers[]`) in the cart defined
 *   by `./data/cart.json`
 * - Use the PLU to Item ID mapping in `plus.json` to determine the correct
 *   item ID for a given PLU (eg the PLU `11` has an item ID of `0`).
 * - Return the enriched cart on a `data` property
 *
 * Example response:
 * ```json
 * HTTP 200
 * {
 *   data: $enrichedCart
 * }
 * ```
 */
async function cartHandler() {
    // Assuming the cart is dynamic, unlike the menu
    let cart = mapCart();
    return {
        body: JSON.stringify({
            data: cart
        }),
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
 * - For each item in the combo, the user must select a number of _options_ (`comboItemOptions`) equal to the amount required by the property `amountRequiredToSelect` on the combo item.
 * - Each option for a combo item has a `minAmount` and `maxAmount`, which dictate the min & max amounts of items that may be selected. For example an item with a min amount of 1 and a max amount of 1 is guaranteed to be included once (and only once) in the combo, and an item with a min amount of 0 and a max amount of 2 may be included 0, 1, or 2 times in the combo
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
async function calorieCounterHandler() {
    return {
        body: JSON.stringify({
            data: calorieCount
        }),
        statusCode: 200
    };
}
exports.calorieCounterHandler = calorieCounterHandler;
//# sourceMappingURL=index.js.map