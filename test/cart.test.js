import { beforeEach, describe, expect, it } from 'vitest';
import {
  addToCart,
  checkout,
  createCart,
  findProduct,
  getTotal,
  roundMoney,
} from '../src/cart.js';
import { createProducts } from '../src/products.js';

describe('Shopping cart', () => {
  let products;
  let cart;

  beforeEach(() => {
    // Fresh, independent copies for every test to avoid state leaking between tests.
    products = createProducts();
    cart = createCart();
  });

  describe('createProducts', () => {
    it('returns independent copies of the catalog', () => {
      const first = createProducts();
      const second = createProducts();
      first[0].quantityAvailable = 0;
      expect(second[0].quantityAvailable).toBe(10);
    });
  });

  describe('createCart', () => {
    it('starts empty', () => {
      expect(cart).toEqual([]);
    });
  });

  describe('findProduct', () => {
    it('returns the product for an existing id', () => {
      expect(findProduct(products, 1).name).toBe('Wireless Mouse');
    });

    it('returns null for a missing id', () => {
      expect(findProduct(products, 999)).toBeNull();
    });
  });

  describe('addToCart', () => {
    it('adds a product to the cart with correct total price', () => {
      addToCart(cart, products, 1, 2);

      expect(cart).toHaveLength(1);
      expect(cart[0]).toEqual({ productId: 1, quantity: 2, totalPrice: 39.98 });
    });

    it('adds distinct products as separate cart items', () => {
      addToCart(cart, products, 1, 1);
      addToCart(cart, products, 2, 1);

      expect(cart).toHaveLength(2);
      expect(cart.map((item) => item.productId)).toEqual([1, 2]);
    });

    it('merges repeated products by incrementing quantity and total price', () => {
      addToCart(cart, products, 1, 1);
      addToCart(cart, products, 1, 2);

      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(3);
      expect(cart[0].totalPrice).toBe(roundMoney(19.99 * 3));
    });

    it('throws when the product does not exist', () => {
      expect(() => addToCart(cart, products, 999, 1)).toThrow(
        /does not exist/,
      );
      expect(cart).toHaveLength(0);
    });

    it('throws for a non-positive or non-integer quantity', () => {
      expect(() => addToCart(cart, products, 1, 0)).toThrow(
        /positive whole number/,
      );
      expect(() => addToCart(cart, products, 1, -3)).toThrow(
        /positive whole number/,
      );
      expect(() => addToCart(cart, products, 1, 1.5)).toThrow(
        /positive whole number/,
      );
      expect(() => addToCart(cart, products, 1, Number.NaN)).toThrow(
        /positive whole number/,
      );
    });

    it('throws when the requested quantity exceeds available stock', () => {
      // Product 4 (Webcam 1080p) only has 3 units.
      expect(() => addToCart(cart, products, 4, 4)).toThrow(/Not enough stock/);
      expect(cart).toHaveLength(0);
    });

    it('throws when the cumulative quantity exceeds available stock', () => {
      addToCart(cart, products, 4, 2); // 3 available -> 1 left
      expect(() => addToCart(cart, products, 4, 2)).toThrow(/left/);
      expect(cart[0].quantity).toBe(2);
    });
  });

  describe('getTotal', () => {
    it('returns 0 for an empty cart', () => {
      expect(getTotal(cart)).toBe(0);
    });

    it('sums the total price of every item', () => {
      addToCart(cart, products, 1, 2); // 2 x 19.99 = 39.98
      addToCart(cart, products, 2, 1); // 1 x 79.50 = 79.50

      expect(getTotal(cart)).toBe(roundMoney(39.98 + 79.5));
    });

    it('handles fractional prices without floating point drift', () => {
      addToCart(cart, products, 1, 3); // 3 x 19.99 = 59.97
      expect(getTotal(cart)).toBe(59.97);
    });
  });

  describe('checkout', () => {
    it('throws when checking out an empty cart', () => {
      expect(() => checkout(cart, products)).toThrow(/empty cart/);
    });

    it('decreases stock and clears the cart', () => {
      const beforeMouse = findProduct(products, 1).quantityAvailable;
      const beforeKeyboard = findProduct(products, 2).quantityAvailable;

      addToCart(cart, products, 1, 2);
      addToCart(cart, products, 2, 1);
      checkout(cart, products);

      expect(findProduct(products, 1).quantityAvailable).toBe(beforeMouse - 2);
      expect(findProduct(products, 2).quantityAvailable).toBe(
        beforeKeyboard - 1,
      );
      expect(cart).toHaveLength(0);
    });

    it('returns the correct total for the checked-out items', () => {
      addToCart(cart, products, 3, 3); // 3 x 34.00 = 102.00

      const { total } = checkout(cart, products);

      expect(total).toBe(102);
    });

    it('returns a snapshot of the purchased items', () => {
      addToCart(cart, products, 3, 3);

      const { items } = checkout(cart, products);

      expect(items).toEqual([
        { productId: 3, quantity: 3, totalPrice: 102 },
      ]);
    });

    it('does not mutate stock when checkout fails', () => {
      addToCart(cart, products, 1, 1);

      // Simulate stock being sold out from under the cart.
      findProduct(products, 1).quantityAvailable = 0;

      expect(() => checkout(cart, products)).toThrow(/Not enough stock/);
      expect(findProduct(products, 1).quantityAvailable).toBe(0); // unchanged
      expect(cart).toHaveLength(1); // cart preserved
    });
  });
});
