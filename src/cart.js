/**
 * Core shopping-cart logic.
 *
 * Design notes / assumptions:
 *  - The cart is a plain array of items shaped `{ productId, quantity, totalPrice }`.
 *  - Functions here are intentionally decoupled from the command line so they
 *    can be unit tested directly. Invalid input throws a descriptive `Error`
 *    instead of printing, which makes both testing and CLI handling simple.
 *  - Monetary values are rounded to two decimals via `roundMoney` to keep
 *    floating point arithmetic (e.g. 0.1 + 0.2) from leaking into results.
 */

/** Creates a new, empty shopping cart. */
export function createCart() {
  return [];
}

/** Finds a product by id, or returns `null` when it does not exist. */
export function findProduct(products, productId) {
  return products.find((product) => product.id === productId) ?? null;
}

/** Rounds a monetary value to two decimals. */
export function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Adds `quantity` of the product identified by `productId` to `cart`.
 *
 * Validation:
 *  - The product must exist.
 *  - `quantity` must be a positive integer.
 *  - The requested (or cumulative) quantity must not exceed available stock.
 *
 * If the product is already in the cart its quantity and total price are
 * updated; otherwise a new cart item is pushed. Returns the mutated cart.
 */
export function addToCart(cart, products, productId, quantity) {
  const product = findProduct(products, productId);

  if (!product) {
    throw new Error(`Product with id "${productId}" does not exist.`);
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error('Quantity must be a positive whole number.');
  }

  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    const newQuantity = existing.quantity + quantity;
    if (newQuantity > product.quantityAvailable) {
      const remaining = product.quantityAvailable - existing.quantity;
      throw new Error(
        `Cannot add ${quantity} more: only ${remaining} of "${product.name}" left.`,
      );
    }
    existing.quantity = newQuantity;
    existing.totalPrice = roundMoney(product.price * newQuantity);
  } else {
    if (quantity > product.quantityAvailable) {
      throw new Error(
        `Not enough stock: only ${product.quantityAvailable} of "${product.name}" available.`,
      );
    }
    cart.push({
      productId,
      quantity,
      totalPrice: roundMoney(product.price * quantity),
    });
  }

  return cart;
}

/** Returns the total cost of every item currently in the cart. */
export function getTotal(cart) {
  return roundMoney(cart.reduce((sum, item) => sum + item.totalPrice, 0));
}

/**
 * Finalizes the purchase.
 *
 *  - Throws if the cart is empty.
 *  - Validates every item's stock once more (defensive: a product could have
 *    been removed or its stock reduced between add and checkout).
 *  - Decreases each product's `quantityAvailable`.
 *  - Returns `{ total, items }` where `items` is a snapshot of the purchased
 *    items, and clears the cart.
 */
export function checkout(cart, products) {
  if (cart.length === 0) {
    throw new Error('Cannot check out an empty cart.');
  }

  // Validate the whole cart up front so a partial failure cannot occur.
  for (const item of cart) {
    const product = findProduct(products, item.productId);
    if (!product) {
      throw new Error(`Product with id "${item.productId}" no longer exists.`);
    }
    if (item.quantity > product.quantityAvailable) {
      throw new Error(
        `Not enough stock for "${product.name}" during checkout.`,
      );
    }
  }

  const total = getTotal(cart);

  for (const item of cart) {
    const product = findProduct(products, item.productId);
    product.quantityAvailable -= item.quantity;
  }

  const items = cart.map((item) => ({ ...item }));
  cart.length = 0;

  return { total, items };
}
