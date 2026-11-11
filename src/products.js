/**
 * Product catalog for the shopping cart system.
 *
 * Assumptions:
 *  - Every product has a unique numeric `id`.
 *  - `price` is expressed in the base currency unit (e.g. dollars) and may
 *    contain fractional cents (e.g. 19.99). The cart layer rounds monetary
 *    results to two decimals to avoid floating point drift.
 *  - `quantityAvailable` is a non-negative integer representing current stock.
 */
export const products = [
  {
    id: 1,
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with USB receiver.',
    price: 19.99,
    quantityAvailable: 10,
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with tactile switches.',
    price: 79.5,
    quantityAvailable: 5,
  },
  {
    id: 3,
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI and SD card reader.',
    price: 34.0,
    quantityAvailable: 8,
  },
  {
    id: 4,
    name: 'Webcam 1080p',
    description: 'Full HD webcam with built-in microphone.',
    price: 49.99,
    quantityAvailable: 3,
  },
];

/**
 * Returns an independent (deep) copy of the product catalog.
 *
 * This lets the CLI and the tests start from a known stock level and mutate
 * `quantityAvailable` without ever touching the shared `products` definition.
 */
export function createProducts() {
  return products.map((product) => ({ ...product }));
}
