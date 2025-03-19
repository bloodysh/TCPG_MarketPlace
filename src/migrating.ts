import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { environment } from './environments/environment';
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
    
    // Firestore can only process 500 operations in a batch
    const BATCH_SIZE = 450;
    let batchCount = 0;
    
    for (let i = 0; i < cards.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const batchCards = cards.slice(i, i + BATCH_SIZE);
      
      batchCards.forEach((card, index) => {
        // Add order field for consistent sorting
        const orderValue = i + index;
        card.order = orderValue;
        
        // Get the card ID parts
        let docId;
        if (card.card_id && card.card_id.includes('-')) {
          const [prefix, id] = card.card_id.split('-');
          // Create zero-padded ID
          const paddedId = id.padStart(4, '0'); // e.g., "1" becomes "0001"
          docId = `${prefix}-${paddedId}`;
        } else {
          // Fallback if card_id doesn't have expected format
          docId = `${card.expansion || 'UNKNOWN'}-${orderValue.toString().padStart(4, '0')}`;
        }
        
        const docRef = doc(collection(db, collectionName), docId);
        
        // Add to batch
        batch.set(docRef, card);
      });
      
      // Commit this batch
      await batch.commit();
      batchCount++;
      console.log(`Committed batch ${batchCount}, ${i + batchCards.length}/${cards.length} cards`);
    }
    
    console.log(`Successfully migrated ${cards.length} cards to ${collectionName}`);
  } catch (error) {
    console.error(`Error migrating to ${collectionName}:`, error);
    throw error;
  }
}

// Execute migration
migrateAllCardsToSingleCollection();