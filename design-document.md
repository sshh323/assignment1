# Assignment 1 — Command Line Shopping Cart
## Solution Design Document

**Course:** BTH012 — Assignment 1, Part A (Solution Design)
**Author:** [Your name]

---

## Overview

This document describes the design of a text-based Command Line Shopping Cart
system built with Node.js. The business logic is separated from the command-line
interface so it can be unit tested in isolation. Tests are written with Vitest.

The two sections below cover the required deliverables:

1. **Test specs** — the planned test suites (`describe`) and test cases (`it`),
   described without setup code and without the value assertions.
2. **Program design** — the planned functions, their parameters, return values,
   and responsibilities.

---

## 1. Test Specifications

> These are the `describe` / `it` descriptions only; setup code and `expect`
> assertions are intentionally omitted.

### describe `createProducts`
- it returns independent copies of the catalog

### describe `createCart`
- it starts empty

### describe `findProduct`
- it returns the product for an existing id
- it returns null for a missing id

### describe `addToCart`
- it adds a product to the cart with correct total price
- it adds distinct products as separate cart items
- it merges repeated products by incrementing quantity and total price
- it throws when the product does not exist
- it throws for a non-positive or non-integer quantity
- it throws when the requested quantity exceeds available stock
- it throws when the cumulative quantity exceeds available stock

### describe `getTotal`
- it returns 0 for an empty cart
- it sums the total price of every item
- it handles fractional prices without floating point drift

### describe `checkout`
- it throws when checking out an empty cart
- it decreases stock and clears the cart
- it returns the correct total for the checked-out items
- it returns a snapshot of the purchased items
- it does not mutate stock when checkout fails

---

## 2. Program Design

### Data structures

**Product** (from the catalog):

| Property | Type | Description |
|---|---|---|
| `id` | number | Unique product identifier |
| `name` | string | Display name |
| `description` | string | Short description |
| `price` | number | Unit price |
| `quantityAvailable` | number | Current stock level |

**Cart item** (stored in the cart array):

| Property | Type | Description |
|---|---|---|
| `productId` | number | References a product `id` |
| `quantity` | number | Number of units of this product |
| `totalPrice` | number | `price * quantity` (rounded to 2 decimals) |

### Core functions (business logic — unit tested)

| Function | Parameters | Return value | Responsibility |
|---|---|---|---|
| `createProducts` | — | array of products | Return an independent deep copy of the catalog so each test/run starts with fresh stock. |
| `createCart` | — | array | Create and return a new, empty cart. |
| `findProduct` | `products`, `productId` | product object or `null` | Locate a product by id, or return `null` when it does not exist. |
| `roundMoney` | `value` | number | Round a monetary value to two decimals to avoid floating-point drift. |
| `addToCart` | `cart`, `products`, `productId`, `quantity` | the mutated `cart` array | Validate that the product exists, the quantity is a positive integer, and there is enough stock; then add a new cart item or merge the quantity into an existing one. |
| `getTotal` | `cart` | number | Sum the `totalPrice` of every item currently in the cart. |
| `checkout` | `cart`, `products` | `{ total, items }` | Validate a non-empty cart and re-check stock, decrease each product's `quantityAvailable`, clear the cart, and return the total together with a snapshot of the purchased items. |

### CLI functions (interaction layer — not unit tested)

| Function | Parameters | Return value | Responsibility |
|---|---|---|---|
| `formatMoney` | `value` | string | Format a number as a currency string for display. |
| `printProducts` | `products` | — (void) | Print the product catalog to the console. |
| `printCart` | `cart`, `products` | — (void) | Print the current cart contents and its total. |
| `main` | — | `Promise<void>` | Run the `readline` loop: show the menu, dispatch commands, catch errors, and continue until `quit` or `checkout`. |

---

## Assumptions

- Product ids are unique integers.
- `quantity` must be a positive integer; `quantityAvailable` is a non-negative integer.
- Adding a product that is already in the cart merges the quantities into a single cart item.
- `checkout` validates every item before mutating stock, so a failed checkout never partially deducts inventory.
- Monetary results are rounded to two decimals to keep floating-point arithmetic (e.g. `0.1 + 0.2`) from leaking into totals.
