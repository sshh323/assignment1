# Video Walkthrough Script (Assignment 1, Part B)

Target length: **10–20 minutes**. Record in Canvas Studio while screen-sharing
Visual Studio Code. Start the recording *after* the project is already open.

> Tip: speak slowly and show the relevant file while you talk about it. The
> structure below maps directly to the rubric (understanding of code, problem
> solving, test coverage, error handling).

---

## 0. Opening (skip in recording)
- Open the `shopping-cart` folder in VS Code.
- Run `npm install` once, then `npm test` (or `npm run tests`) to confirm tests pass.

---

## 1. Introduction — what the project is (≈ 1 min)
- "This is my Command Line Shopping Cart, built with Node.js for Assignment 1."
- Point at the project tree and name the key files:
  - `src/index.js` — the command-line entry point.
  - `src/askQuestion.js` — promise wrapper around `readline`.
  - `src/products.js` — the product catalog.
  - `src/cart.js` — the business logic.
  - `test/cart.test.js` — the unit tests.
- One sentence on the key design idea: **business logic is separated from the
  CLI** so it can be tested without a terminal.

## 2. Tests walkthrough (≈ 6 min)

Open `test/cart.test.js`.

### 2.1 Test setup (≈ 1 min)
- Explain `beforeEach`: every test gets a **fresh** catalog and cart via
  `createProducts()` and `createCart()`.
- Why: tests stay independent — no state leaks between tests.

### 2.2 `createProducts` / `createCart` / `findProduct` (≈ 1 min)
- Explain the `createProducts` test proving the catalog copy is independent
  (mutating one copy does not affect another).
- Explain `findProduct` returns the product, or `null` when missing.

### 2.3 `addToCart` — the most important tests (≈ 2 min)
Walk through, pointing at each `it`:
- **Happy path:** adding a product produces `{ productId, quantity, totalPrice }`.
- **Distinct products** become separate cart items.
- **Merging:** adding the same product twice increments quantity and recalculates total.
- **Error — product does not exist:** throws a descriptive error.
- **Error — invalid quantity:** throws for `0`, negative, or fractional quantity.
- **Error — stock limit:** throws when quantity (or cumulative quantity) exceeds stock.

### 2.4 `getTotal` (≈ 1 min)
- Empty cart → `0`.
- Sums all `totalPrice`.
- Floating-point handling (`59.97` for `3 × 19.99`).

### 2.5 `checkout` — the most important tests (≈ 1 min)
- Throws on an **empty cart**.
- **Decreases stock** and **clears the cart**.
- Returns correct total + a snapshot of purchased items.
- **No mutation on failure**: if stock is insufficient at checkout time, the
  cart is kept and stock is unchanged.

## 3. Application code walkthrough (≈ 6 min)

### 3.1 `src/products.js` (≈ 1 min)
- Show the product objects and the required fields.
- Explain `createProducts()` returns an independent copy (so stock resets).

### 3.2 `src/cart.js` — the core (≈ 3 min)
Go function by function:
- `createCart` — starts an empty array.
- `findProduct` — look up by id, return `null` if missing.
- `roundMoney` — why we round to 2 decimals (floating point).
- `addToCart` — validation (exists / positive integer / stock), then either push a new item or merge into an existing one.
- `getTotal` — reduce over `totalPrice`.
- `checkout` — validate the whole cart first, then deduct stock, snapshot items, clear the cart.
- **Explain the design choice:** functions throw descriptive `Error`s rather
  than printing, which makes them easy to assert in tests and easy to catch in
  the CLI.

### 3.3 `src/askQuestion.js` (≈ 1 min)
- Explain wrapping `rl.question` in a Promise so it can be `await`ed.
- Explain `noMoreQuestions()` closes the interface so the process exits.

### 3.4 `src/index.js` — the CLI loop (≈ 1 min)
- Explain `run()`: creates products + cart, then an infinite loop.
- Show the menu, the `add` / `cart` / `total` / `checkout` / `quit` commands.
- Show the `try/catch` that prints `Error: ...` and keeps looping.
- Show `checkout`/`quit` call `noMoreQuestions()` and `return`.

## 4. Why I made these choices (≈ 2 min)
- **Separation of concerns:** `cart.js` has no I/O, so it is fully unit-testable.
- **Error-first design:** throw descriptive errors → simple assertions + friendly CLI messages.
- **Factory for products:** `createProducts()` gives each test clean state.
- **Defensive checkout:** validate everything before mutating stock, so no partial deductions.

## 5. Live demo (optional, ≈ 2 min)
- Run `npm start`, add a couple of items, show `total`, then `checkout`.
- Show the receipt and stock decrease.

---

## Checklist before uploading
- [ ] Video is 10–20 minutes.
- [ ] I explained both the tests AND the code.
- [ ] I explained the "why" behind the main design choices.
- [ ] The code shown is the final, pushed version.
