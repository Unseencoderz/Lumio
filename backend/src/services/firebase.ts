import { initializeApp, getApps, App } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
  writeBatch,
  onSnapshot,
  setDoc
} from 'firebase/firestore';
import { 
  getAuth, 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  UserCredential,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  getStorage, 
  Storage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  UploadResult,
  listAll
} from 'firebase/storage';

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Firebase configuration - should be loaded from environment variables
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || '',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || ''
};

// Validate Firebase configuration
const validateFirebaseConfig = (config: FirebaseConfig): void => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !config[field as keyof FirebaseConfig]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing Firebase configuration fields: ${missingFields.join(', ')}`);
  }
};

/**
 * Firebase Service Class
 * Provides a comprehensive interface for Firebase operations including
 * Firestore database, Authentication, and Storage services
 */
class FirebaseService {
  private app: App;
  private db: Firestore;
  private auth: Auth;
  private storage: Storage;
  private isInitialized: boolean = false;

  constructor() {
    this.initializeFirebase();
  }

  /**
   * Initialize Firebase services
   */
  private initializeFirebase(): void {
    try {
      // Validate configuration before initializing
      validateFirebaseConfig(firebaseConfig);

      // Initialize Firebase app if not already initialized
      if (!getApps().length) {
        this.app = initializeApp(firebaseConfig);
      } else {
        this.app = getApps()[0];
      }

      // Initialize Firebase services
      this.db = getFirestore(this.app);
      this.auth = getAuth(this.app);
      this.storage = getStorage(this.app);
      this.isInitialized = true;

      console.log('Firebase services initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      throw error;
    }
  }

  /**
   * Check if Firebase is properly initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  // ===================
  // FIRESTORE METHODS
  // ===================

  /**
   * Create a new document in a collection
   */
  async createDocument(collectionName: string, data: any): Promise<string> {
    try {
      const docRef = await addDoc(collection(this.db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Document created with ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  /**
   * Create a document with a specific ID
   */
  async createDocumentWithId(collectionName: string, docId: string, data: any): Promise<void> {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await setDoc(docRef, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Document created with ID: ${docId}`);
    } catch (error) {
      console.error('Error creating document with ID:', error);
      throw error;
    }
  }

  /**
   * Get a single document by ID
   */
  async getDocument(collectionName: string, docId: string): Promise<DocumentData | null> {
    try {
      const docRef = doc(this.db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log(`No document found with ID: ${docId}`);
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  /**
   * Update a document
   */
  async updateDocument(collectionName: string, docId: string, data: any): Promise<void> {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      console.log(`Document ${docId} updated successfully`);
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await deleteDoc(docRef);
      console.log(`Document ${docId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  /**
   * Get multiple documents with optional filtering, ordering, and limiting
   */
  async getDocuments(
    collectionName: string, 
    options?: {
      filters?: { field: string; operator: any; value: any }[];
      orderBy?: { field: string; direction: 'asc' | 'desc' };
      limit?: number;
    }
  ): Promise<DocumentData[]> {
    try {
      let queryRef: any = collection(this.db, collectionName);

      // Apply filters
      if (options?.filters && options.filters.length > 0) {
        options.filters.forEach(filter => {
          queryRef = query(queryRef, where(filter.field, filter.operator, filter.value));
        });
      }

      // Apply ordering
      if (options?.orderBy) {
        queryRef = query(queryRef, orderBy(options.orderBy.field, options.orderBy.direction));
      }

      // Apply limit
      if (options?.limit) {
        queryRef = query(queryRef, limit(options.limit));
      }

      const querySnapshot: QuerySnapshot = await getDocs(queryRef);
      const documents: DocumentData[] = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      console.log(`Retrieved ${documents.length} documents from ${collectionName}`);
      return documents;
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  /**
   * Perform batch operations (create, update, delete)
   */
  async batchWrite(operations: Array<{
    type: 'create' | 'update' | 'delete';
    collection: string;
    docId?: string;
    data?: any;
  }>): Promise<void> {
    try {
      const batch = writeBatch(this.db);

      operations.forEach(operation => {
        switch (operation.type) {
          case 'create':
            if (operation.data) {
              const docRef = operation.docId 
                ? doc(this.db, operation.collection, operation.docId)
                : doc(collection(this.db, operation.collection));
              batch.set(docRef, {
                ...operation.data,
                createdAt: new Date(),
                updatedAt: new Date()
              });
            }
            break;
          case 'update':
            if (operation.docId && operation.data) {
              const docRef = doc(this.db, operation.collection, operation.docId);
              batch.update(docRef, {
                ...operation.data,
                updatedAt: new Date()
              });
            }
            break;
          case 'delete':
            if (operation.docId) {
              const docRef = doc(this.db, operation.collection, operation.docId);
              batch.delete(docRef);
            }
            break;
        }
      });

      await batch.commit();
      console.log(`Batch operation completed with ${operations.length} operations`);
    } catch (error) {
      console.error('Error in batch write:', error);
      throw error;
    }
  }

  // ===================
  // AUTHENTICATION METHODS
  // ===================

  /**
   * Create a new user with email and password
   */
  async createUser(email: string, password: string, displayName?: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Update user profile if display name provided
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      console.log('User created successfully:', userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Sign in user with email and password
   */
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('User signed in successfully:', userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  async signOutUser(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Password reset email sent successfully');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  /**
   * Get the currently authenticated user
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const unsubscribe = onAuthStateChanged(this.auth, callback);
    return unsubscribe;
  }

  // ===================
  // STORAGE METHODS
  // ===================

  /**
   * Upload a file to Firebase Storage
   */
  async uploadFile(path: string, file: Buffer | Uint8Array | Blob, metadata?: any): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      const uploadResult: UploadResult = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      console.log(`File uploaded successfully to: ${path}`);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Delete a file from Firebase Storage
   */
  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, path);
      await deleteObject(storageRef);
      console.log(`File deleted successfully: ${path}`);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  /**
   * Get download URL for a file
   */
  async getFileDownloadURL(path: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }

  /**
   * List all files in a storage path
   */
  async listFiles(path: string): Promise<string[]> {
    try {
      const storageRef = ref(this.storage, path);
      const result = await listAll(storageRef);
      const fileNames = result.items.map(item => item.name);
      console.log(`Found ${fileNames.length} files in ${path}`);
      return fileNames;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  // ===================
  // REAL-TIME LISTENERS
  // ===================

  /**
   * Listen to changes in a specific document
   */
  onDocumentChange(
    collectionName: string, 
    docId: string, 
    callback: (data: DocumentData | null) => void
  ): () => void {
    const docRef = doc(this.db, collectionName, docId);
    
    const unsubscribe = onSnapshot(docRef, (doc: DocumentSnapshot) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error listening to document changes:', error);
    });

    return unsubscribe;
  }

  /**
   * Listen to changes in a collection
   */
  onCollectionChange(
    collectionName: string,
    callback: (data: DocumentData[]) => void,
    options?: {
      filters?: { field: string; operator: any; value: any }[];
      orderBy?: { field: string; direction: 'asc' | 'desc' };
      limit?: number;
    }
  ): () => void {
    let queryRef: any = collection(this.db, collectionName);

    // Apply filters if provided
    if (options?.filters && options.filters.length > 0) {
      options.filters.forEach(filter => {
        queryRef = query(queryRef, where(filter.field, filter.operator, filter.value));
      });
    }

    // Apply ordering
    if (options?.orderBy) {
      queryRef = query(queryRef, orderBy(options.orderBy.field, options.orderBy.direction));
    }

    // Apply limit
    if (options?.limit) {
      queryRef = query(queryRef, limit(options.limit));
    }

    const unsubscribe = onSnapshot(queryRef, (querySnapshot: QuerySnapshot) => {
      const documents: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      callback(documents);
    }, (error) => {
      console.error('Error listening to collection changes:', error);
    });

    return unsubscribe;
  }

  // ===================
  // UTILITY METHODS
  // ===================

  /**
   * Get Firestore instance
   */
  getFirestore(): Firestore {
    return this.db;
  }

  /**
   * Get Auth instance
   */
  getAuth(): Auth {
    return this.auth;
  }

  /**
   * Get Storage instance
   */
  getStorage(): Storage {
    return this.storage;
  }

  /**
   * Get Firebase App instance
   */
  getApp(): App {
    return this.app;
  }

  // ===================
  // ADVANCED OPERATIONS
  // ===================

  /**
   * Check if a document exists
   */
  async documentExists(collectionName: string, docId: string): Promise<boolean> {
    try {
      const docRef = doc(this.db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error('Error checking document existence:', error);
      throw error;
    }
  }

  /**
   * Get document count in a collection
   */
  async getDocumentCount(
    collectionName: string,
    filters?: { field: string; operator: any; value: any }[]
  ): Promise<number> {
    try {
      const documents = await this.getDocuments(collectionName, { filters });
      return documents.length;
    } catch (error) {
      console.error('Error getting document count:', error);
      throw error;
    }
  }

  /**
   * Search documents by text field (basic text search)
   */
  async searchDocuments(
    collectionName: string,
    searchField: string,
    searchTerm: string
  ): Promise<DocumentData[]> {
    try {
      // Note: This is a basic implementation. For advanced search, consider using Algolia or similar
      const documents = await this.getDocuments(collectionName);
      return documents.filter(doc => 
        doc[searchField] && 
        doc[searchField].toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching documents:', error);
      throw error;
    }
  }

  /**
   * Get paginated documents
   */
  async getPaginatedDocuments(
    collectionName: string,
    pageSize: number,
    lastDocId?: string,
    options?: {
      filters?: { field: string; operator: any; value: any }[];
      orderBy?: { field: string; direction: 'asc' | 'desc' };
    }
  ): Promise<{ documents: DocumentData[]; hasMore: boolean; lastDocId?: string }> {
    try {
      let queryRef: any = collection(this.db, collectionName);

      // Apply filters
      if (options?.filters && options.filters.length > 0) {
        options.filters.forEach(filter => {
          queryRef = query(queryRef, where(filter.field, filter.operator, filter.value));
        });
      }

      // Apply ordering
      if (options?.orderBy) {
        queryRef = query(queryRef, orderBy(options.orderBy.field, options.orderBy.direction));
      }

      // Apply pagination
      if (lastDocId) {
        const lastDocRef = doc(this.db, collectionName, lastDocId);
        const lastDocSnap = await getDoc(lastDocRef);
        if (lastDocSnap.exists()) {
          queryRef = query(queryRef, limit(pageSize + 1));
        }
      } else {
        queryRef = query(queryRef, limit(pageSize + 1));
      }

      const querySnapshot = await getDocs(queryRef);
      const documents: DocumentData[] = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      const hasMore = documents.length > pageSize;
      if (hasMore) {
        documents.pop(); // Remove the extra document
      }

      const newLastDocId = documents.length > 0 ? documents[documents.length - 1].id : undefined;

      return {
        documents,
        hasMore,
        lastDocId: newLastDocId
      };
    } catch (error) {
      console.error('Error getting paginated documents:', error);
      throw error;
    }
  }

  // ===================
  // ERROR HANDLING
  // ===================

  /**
   * Handle Firebase errors with user-friendly messages
   */
  handleFirebaseError(error: any): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No user found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Please try again later.';
      case 'permission-denied':
        return 'You do not have permission to perform this action.';
      case 'not-found':
        return 'The requested document was not found.';
      case 'already-exists':
        return 'The document already exists.';
      case 'resource-exhausted':
        return 'Quota exceeded. Please try again later.';
      case 'unauthenticated':
        return 'You must be authenticated to perform this action.';
      case 'unavailable':
        return 'Service is temporarily unavailable. Please try again later.';
      case 'deadline-exceeded':
        return 'Request timed out. Please try again.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }
}

// Create and export a singleton instance
const firebaseService = new FirebaseService();

export default firebaseService;
export { FirebaseService };
export type { FirebaseConfig };
