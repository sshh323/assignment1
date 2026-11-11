/**
 * Main entry point for the Command Line Shopping Cart application.
 *
 * Run with:  npm start   (or:  node src/index.js)
 *
 * The CLI loop lives here and delegates all business rules to `cart.js`
 * (and the catalog to `products.js`) so the logic can be unit tested
 * without a terminal.
 */
import { askQuestion, noMoreQuestions } from './askQuestion.js';
import { createProducts } from './products.js';
import {
  addToCart,
  checkout,
  createCart,
  findProduct,
  getTotal,
} from './cart.js';

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function printProducts(products) {
  console.log('\nAvailable products:');
  console.log('  ID | Name               | Price  | Stock | Description');
  console.log('  ---|--------------------|--------|-------|-----------------------------');
  for (const product of products) {
    const name = product.name.padEnd(18);
    const price = formatMoney(product.price).padStart(6);
    const stock = String(product.quantityAvailable).padStart(5);
    console.log(
      `  ${String(product.id).padStart(2)} | ${name} | ${price} | ${stock} | ${product.description}`,
    );
  }
}

function printCart(cart, products) {
  if (cart.length === 0) {
    console.log('\nYour cart is empty.');
    return;
  }
  console.log('\nYour cart:');
  for (const item of cart) {
    const product = findProduct(products, item.productId);
    console.log(
      `  - ${product.name} x ${item.quantity} = ${formatMoney(item.totalPrice)}`,
    );
  }
  console.log(`  Total: ${formatMoney(getTotal(cart))}`);
}

async function run() {
  const products = createProducts();
  const cart = createCart();

  console.log('Welcome to the Command Line Shopping Cart!\n');

  while (true) {
    printProducts(products);
    printCart(cart, products);

    console.log('\nCommands:');
    console.log('  add <productId> <quantity>');
    console.log('  cart');
    console.log('  total');
    console.log('  checkout');
    console.log('  quit');

    const answer = (await askQuestion('\n> ')).trim();
    const [command, ...args] = answer.split(/\s+/);

    try {
      switch (command.toLowerCase()) {
        case 'add': {
          if (args.length < 2) {
            console.log('Usage: add <productId> <quantity>');
            break;
          }
          const productId = Number(args[0]);
          const quantity = Number(args[1]);
          addToCart(cart, products, productId, quantity);
          console.log(
            `Added ${quantity} x "${findProduct(products, productId).name}" to the cart.`,
          );
          break;
        }

        case 'cart': {
          printCart(cart, products);
          break;
        }

        case 'total': {
          console.log(`Current total: ${formatMoney(getTotal(cart))}`);
          break;
        }

        case 'checkout': {
          const { total, items } = checkout(cart, products);
          console.log('\n===== Receipt =====');
          for (const item of items) {
            const product = findProduct(products, item.productId);
            console.log(
              `  ${product.name} x ${item.quantity} @ ${formatMoney(product.price)} = ${formatMoney(item.totalPrice)}`,
            );
          }
          console.log('-------------------');
          console.log(`  TOTAL: ${formatMoney(total)}`);
          console.log('Thank you for shopping!\n');
          noMoreQuestions();
          return;
        }

        case 'quit':
        case 'exit': {
          console.log('Goodbye!');
          noMoreQuestions();
          return;
        }

        case '': {
          break;
        }

        default: {
          console.log(`Unknown command "${command}".`);
          break;
        }
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }
}

run();
