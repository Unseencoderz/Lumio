import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { config } from '../config/config';
import { logger } from '../utils/logger';

// --- Firebase Admin Initialization ---
// This block runs once when the server starts.
// It checks if the necessary configuration exists and initializes the Firebase Admin app.
try {
  if (admin.apps.length === 0) {
    if (
      config.firebaseProjectId &&
      config.firebasePrivateKey &&
      config.firebaseClientEmail
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.firebaseProjectId,
          // A key detail: .env files store newlines as "\\n". We need to replace them with actual newlines.
          privateKey: config.firebasePrivateKey.replace(/\\n/g, '\n'),
          clientEmail: config.firebaseClientEmail,
        }),
        storageBucket: config.firebaseStorageBucket,
      });
      logger.info('Firebase Admin SDK initialized successfully.');
    } else {
      logger.warn(
        'Firebase Admin credentials are not fully configured. Firebase services will not be available.'
      );
    }
  }
} catch (error) {
  logger.error(error, 'Failed to initialize Firebase Admin SDK');
}

/**
 * Verifies a Firebase ID token.
 * Throws an error if the token is invalid.
 * @param idToken The Firebase ID token to verify.
 * @returns The decoded token containing user information.
 */
export const verifyFirebaseToken = async (idToken: string) => {
  if (admin.apps.length === 0) {
    throw new Error('Firebase Admin SDK is not initialized.');
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger.error({ tokenError: error }, 'Firebase ID token verification failed');
    throw error; // Re-throw the error to be caught by the auth middleware
  }
};

/**
 * Gets the default Firebase Storage bucket instance.
 * @returns The Firebase Storage Bucket object.
 */
export const getBucket = () => {
  if (admin.apps.length === 0 || !config.useFirebaseStorage) {
    throw new Error(
      'Firebase Storage is not initialized or is disabled in config.'
    );
  }
  return getStorage().bucket();
};
