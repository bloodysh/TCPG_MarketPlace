import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { environment } from '@/environments/environment';
import { a1Cards, a1aCards, a2Cards, paCards, allCards } from './CardsDB';

// Initialize Firebase
const app = initializeApp(environment.firebase);
const db = getFirestore(app);

// Migration function using batched writes for better performance
async function migrateAllCardsToSingleCollection() {
  try {
    console.log("Starting migration to Firestore single collection...");

    // Combine all cards and migrate to a single collection
    const allCardsArray = [...a1Cards, ...a1aCards, ...a2Cards, ...paCards];

    // Migrate all cards to a single collection
    await migrateCardSet(allCardsArray, 'AllCards');

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Helper function to migrate cards using batch operations
async function migrateCardSet(cards: any[], collectionName: string) {
  try {
    console.log(`Migrating ${cards.length} cards to ${collectionName} collection`);

    // Track generated IDs to detect duplicates
    const usedDocIds = new Set();

    // Firestore can only process 500 operations in a batch
    const BATCH_SIZE = 450;
    let batchCount = 0;

    for (let i = 0; i < cards.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const batchCards = cards.slice(i, i + BATCH_SIZE);

      for (let index = 0; index < batchCards.length; index++) {
        const card = batchCards[index];
        const orderValue = i + index;
        card.order = orderValue;

        // Generate a unique document ID
        let docId;

        // Special handling for Promo-A cards
        if (card.expansion === 'P-A') {
          // Zero-pad the card's ID
          const paddedId = card.id.toString().padStart(4, '0');
          docId = `P-A-${paddedId}`;
        }
        // Regular handling for other cards
        else if (card.card_id && card.card_id.includes('-')) {
          // Extract the expansion prefix and numeric ID
          const parts = card.card_id.split('-');
          const prefix = parts[0]; // First part is expansion
          const id = parts[parts.length - 1]; // Last part is the ID number

          // Zero-pad the ID
          const paddedId = id.padStart(4, '0');
          docId = `${prefix}-${paddedId}`;
        } else {
          // Fallback
          docId = `${card.expansion || 'UNKNOWN'}-${orderValue.toString().padStart(4, '0')}`;
        }

        // Check for duplicates
        if (usedDocIds.has(docId)) {
          console.warn(`⚠️ Duplicate document ID detected: ${docId} for card:`, card);
          // Create an alternative ID by appending a timestamp and random number
          docId = `${docId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          console.log(`Generated alternative ID: ${docId}`);
        }

        // Remember this ID
        usedDocIds.add(docId);

        // Add to batch
        const docRef = doc(collection(db, collectionName), docId);
        batch.set(docRef, card);
      }

      // Commit this batch
      await batch.commit();
      batchCount++;
      console.log(`Committed batch ${batchCount}, ${i + batchCards.length}/${cards.length} cards`);
    }

    console.log(`Successfully migrated ${cards.length} cards to ${collectionName}`);
    console.log(`Generated ${usedDocIds.size} unique document IDs`);
  } catch (error) {
    console.error(`Error migrating to ${collectionName}:`, error);
    throw error;
  }
}

// Execute migration
migrateAllCardsToSingleCollection();
