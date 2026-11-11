# Command Line Shopping Cart System 🛒

BTH012 — Assignment 1. A text-based shopping cart built with Node.js, with unit
tests written in Vitest. The business logic is separated from the command-line
interface so it can be unit tested in isolation.

## Requirements covered

- Product listing: an array of products with `id`, `name`, `description`,
  `price` and `quantityAvailable`.
- User interaction via Node's `readline` module.
- Shopping cart represented as an array of `{ productId, quantity, totalPrice }`.
- Checkout that calculates the total and decreases `quantityAvailable`.
- Total calculation.
- Looping back to product selection after each action (until `quit` or `checkout`).
- Comprehensive Vitest unit tests (19 tests) including error and edge cases.

## Project layout

```
shopping-cart/
├── Dockerfile          # runs the app in a container (clones this repo)
├── eslint.config.js    # ESLint flat config (matches course template)
├── vitest.config.js    # Vitest config
├── package.json
├── README.md
├── src/
│   ├── index.js        # CLI entry point (the readline loop)
│   ├── askQuestion.js  # promise wrapper around readline.question
│   ├── products.js     # product catalog + createProducts() factory
│   └── cart.js         # business logic (addToCart, getTotal, checkout, ...)
└── test/
    └── cart.test.js    # Vitest unit tests
```

## Setup

```bash
npm install
```

## Run the app

```bash
npm start
# or
npm run start
# or
node src/index.js
```

Commands:

- `add <productId> <quantity>` — add a product to the cart
- `cart` — show cart contents
- `total` — show current total
- `checkout` — finalize purchase and exit
- `quit` / `exit` — leave without checking out

## Run the tests

```bash
npm test          # run once
npm run tests     # run once (alias)
npm run test:watch
```

## Run with Docker

1. Edit `Dockerfile` and replace the `git clone` URL with your public GitHub repo URL.
2. Build and run:

```bash
docker build --no-cache -t assignment1 . && docker run --rm -it assignment1
```

## Assumptions

- Product ids are unique integers.
- `price` may include cents; monetary results are rounded to two decimals to
  avoid floating-point drift.
- `quantity` must be a positive integer; `quantityAvailable` is a non-negative integer.
- Adding a product already in the cart merges the quantities into one item.
- Checkout validates all items before mutating stock, so a failed checkout
  never partially deducts inventory.

