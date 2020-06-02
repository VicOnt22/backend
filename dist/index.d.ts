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
export declare function menuHandler(): Promise<{
    body: string;
    statusCode: number;
}>;
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
export declare function cartHandler(): Promise<{
    body: string;
    statusCode: number;
}>;
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
export declare function calorieCounterHandler(): Promise<{
    body: string;
    statusCode: number;
}>;
