import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Order } from '../types';
import { MOCK_PRODUCTS, MOCK_ORDERS } from '../data/mockProducts';

// Subscribe to Products collection with automatic initial seeding
export function subscribeToProducts(onProductsUpdated: (products: Product[]) => void) {
  const productsRef = collection(db, 'products');

  return onSnapshot(
    productsRef,
    async (snapshot) => {
      if (snapshot.empty) {
        console.log('Seeding initial products into Firestore database...');
        try {
          const batch = writeBatch(db);
          MOCK_PRODUCTS.forEach((prod) => {
            const docRef = doc(db, 'products', prod.id);
            batch.set(docRef, prod);
          });
          await batch.commit();
        } catch (err) {
          console.error('Error seeding products to Firestore:', err);
          onProductsUpdated(MOCK_PRODUCTS);
        }
      } else {
        const loadedProducts: Product[] = [];
        snapshot.forEach((doc) => {
          loadedProducts.push(doc.data() as Product);
        });
        onProductsUpdated(loadedProducts);
      }
    },
    (error) => {
      console.error('Firestore products subscription error:', error);
      onProductsUpdated(MOCK_PRODUCTS);
    }
  );
}

// Subscribe to Orders collection with automatic initial seeding
export function subscribeToOrders(onOrdersUpdated: (orders: Order[]) => void) {
  const ordersRef = collection(db, 'orders');

  return onSnapshot(
    ordersRef,
    async (snapshot) => {
      if (snapshot.empty) {
        console.log('Seeding initial orders into Firestore database...');
        try {
          const batch = writeBatch(db);
          MOCK_ORDERS.forEach((order) => {
            const docRef = doc(db, 'orders', order.id);
            batch.set(docRef, order);
          });
          await batch.commit();
        } catch (err) {
          console.error('Error seeding orders to Firestore:', err);
          onOrdersUpdated(MOCK_ORDERS);
        }
      } else {
        const loadedOrders: Order[] = [];
        snapshot.forEach((doc) => {
          loadedOrders.push(doc.data() as Order);
        });
        // Sort orders by ID / newest
        onOrdersUpdated(loadedOrders);
      }
    },
    (error) => {
      console.error('Firestore orders subscription error:', error);
      onOrdersUpdated(MOCK_ORDERS);
    }
  );
}

// Save or Update Product in Firestore
export async function saveProductToFirestore(product: Product): Promise<void> {
  try {
    const docRef = doc(db, 'products', product.id);
    await setDoc(docRef, product, { merge: true });
  } catch (err) {
    console.error('Error saving product to Firestore:', err);
    throw err;
  }
}

// Delete Product from Firestore
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting product from Firestore:', err);
    throw err;
  }
}

// Save new Order to Firestore
export async function saveOrderToFirestore(order: Order): Promise<void> {
  try {
    const docRef = doc(db, 'orders', order.id);
    await setDoc(docRef, order);
  } catch (err) {
    console.error('Error saving order to Firestore:', err);
    throw err;
  }
}

// Update Order Status in Firestore
export async function updateOrderStatusInFirestore(orderId: string, status: Order['status']): Promise<void> {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, { status });
  } catch (err) {
    console.error('Error updating order status in Firestore:', err);
    throw err;
  }
}
