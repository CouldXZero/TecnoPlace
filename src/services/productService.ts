import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

/**
  * Subscribe to real-time products from Firestore.
  * If Firestore is empty, seed it with initial mock products.
  */
export function subscribeProducts(onProductsUpdated: (products: Product[]) => void): () => void {
  const productsCollection = collection(db, 'products');

  const unsubscribe = onSnapshot(
    productsCollection,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed database with mock products if collection is completely empty
        try {
          for (const prod of MOCK_PRODUCTS) {
            await setDoc(doc(db, 'products', prod.id), prod);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'products');
        }
        return;
      }

      const firebaseProducts: Product[] = snapshot.docs.map((d) => d.data() as Product);
      // Sort by newest or fallback order
      onProductsUpdated(firebaseProducts);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    }
  );

  return unsubscribe;
}

/**
  * Save or Update a product in Firestore database
  */
export async function saveProductToFirestore(product: Product): Promise<void> {
  try {
    const productRef = doc(db, 'products', product.id);
    await setDoc(productRef, product, { merge: true });

    // Optional admin log
    const logRef = doc(collection(db, 'admin_logs'));
    await setDoc(logRef, {
      timestamp: new Date().toISOString(),
      action: 'SAVE_PRODUCT',
      productId: product.id,
      productName: product.name,
      price: product.price
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `products/${product.id}`);
    throw error;
  }
}

/**
  * Delete a product from Firestore database
  */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);

    // Optional admin log
    const logRef = doc(collection(db, 'admin_logs'));
    await setDoc(logRef, {
      timestamp: new Date().toISOString(),
      action: 'DELETE_PRODUCT',
      productId
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
    throw error;
  }
}
