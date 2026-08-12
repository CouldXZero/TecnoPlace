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
import { Product, Order, Customer } from '../types';
import { MOCK_PRODUCTS, MOCK_ORDERS } from '../data/mockProducts';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-101',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@gmail.com',
    phone: '+593 99 123 4567',
    cedulaOrRuc: '1723456789',
    address: 'Av. Amazonas N24-102 y Orellana',
    city: 'Quito',
    password: 'password123',
    createdAt: '2026-07-15T10:30:00Z',
    status: 'active',
    totalOrders: 3
  },
  {
    id: 'cust-102',
    name: 'María Fernanda Gómez',
    email: 'maria.gomez@hotmail.com',
    phone: '+593 98 765 4321',
    cedulaOrRuc: '0912345678',
    address: 'Calle 9 de Octubre 412 y Chile',
    city: 'Guayaquil',
    password: 'password123',
    createdAt: '2026-07-28T14:20:00Z',
    status: 'active',
    totalOrders: 1
  }
];

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

// Subscribe to Customers collection with automatic initial seeding
export function subscribeToCustomers(onCustomersUpdated: (customers: Customer[]) => void) {
  const customersRef = collection(db, 'customers');

  return onSnapshot(
    customersRef,
    async (snapshot) => {
      if (snapshot.empty) {
        console.log('Seeding initial customers into Firestore database...');
        try {
          const batch = writeBatch(db);
          MOCK_CUSTOMERS.forEach((cust) => {
            const docRef = doc(db, 'customers', cust.id);
            batch.set(docRef, cust);
          });
          await batch.commit();
        } catch (err) {
          console.error('Error seeding customers to Firestore:', err);
          onCustomersUpdated(MOCK_CUSTOMERS);
        }
      } else {
        const loadedCustomers: Customer[] = [];
        snapshot.forEach((doc) => {
          loadedCustomers.push(doc.data() as Customer);
        });
        onCustomersUpdated(loadedCustomers);
      }
    },
    (error) => {
      console.error('Firestore customers subscription error:', error);
      onCustomersUpdated(MOCK_CUSTOMERS);
    }
  );
}

// Save or Update Customer in Firestore
export async function saveCustomerToFirestore(customer: Customer): Promise<void> {
  try {
    const docRef = doc(db, 'customers', customer.id);
    await setDoc(docRef, customer, { merge: true });
  } catch (err) {
    console.error('Error saving customer to Firestore:', err);
    throw err;
  }
}

// Delete Customer from Firestore
export async function deleteCustomerFromFirestore(customerId: string): Promise<void> {
  try {
    const docRef = doc(db, 'customers', customerId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting customer from Firestore:', err);
    throw err;
  }
}
