import { ProductStore } from "./src/services/product-store";

const store = new ProductStore();

function measure(name: string, fn: () => void) {
  const start = performance.now();

  fn();

  const end = performance.now();

  console.log(
    `${name}: ${(end - start).toFixed(3)} ms`
  );
}

// Datos de prueba
for (let i = 0; i < 1000; i++) {
  store.create({
    name: `Producto ${i}`,
    sku: `SKU-${i}`,
    price: i * 10,
    stock: 100,
    category: "General",
  });
}

const product = store.list()[0];

// Pruebas
measure("getById", () => {
  for (let i = 0; i < 1000; i++) {
    store.getById(product.id);
  }
});

measure("getBySku", () => {
  for (let i = 0; i < 1000; i++) {
    store.getBySku(product.sku);
  }
});

measure("list", () => {
  for (let i = 0; i < 100; i++) {
    store.list();
  }
});

measure("update", () => {
  for (let i = 0; i < 1000; i++) {
    store.update(product.id, {
      price: 100,
    });
  }
});

measure("adjustStock", () => {
  for (let i = 0; i < 1000; i++) {
    store.adjustStock(product.id, 1);
  }
});

measure("remove", () => {
  const temp = store.create({
    name: "Temporal",
    sku: "TEMP-001",
    price: 10,
    stock: 1,
  });

  store.remove(temp.id);
});

measure("create", () => {
  for (let i = 0; i < 1000; i++) {
    store.create({
      name: `Nuevo ${i}`,
      sku: `NEW-${i + 10000}`,
      price: 100,
      stock: 10,
    });
  }
});