import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { environment } from './environments/environment';
import { a1Cards, a1aCards, a2Cards, paCards } from './CardsDB';

// Initialize Firebase
const app = initializeApp(environment.firebase);
const db = getFirestore(app);

// Migration function using batched writes for better performance
async function migrateCardsToFirestore() {
  try {
    console.log("Starting migration to Firestore...");
    
    // Migrate each card set
    await migrateCardSet(a1Cards, 'A1');
    await migrateCardSet(a1aCards, 'A1a');
    await migrateCardSet(a2Cards, 'A2');
    await migrateCardSet(paCards, 'P-A');
    
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Helper function to migrate a set of cards using batch operations
async function migrateCardSet(cards: any[], collectionName: string) {
  try {
    console.log(`Migrating ${cards.length} cards to ${collectionName} collection...`);
    
    // Firestore can only process 500 operations in a batch
    const BATCH_SIZE = 450;
    let batchCount = 0;
    
    for (let i = 0; i < cards.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const batchCards = cards.slice(i, i + BATCH_SIZE);
      
      batchCards.forEach((card, index) => {
        // Add order field for consistent sorting
        card.order = i + index;
        
        // Create document reference with padded ID for better sorting
        const paddedIndex = String(i + index).padStart(4, '0');
        const docRef = doc(collection(db, collectionName), `${collectionName}-${paddedIndex}`);
        
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
    console.error(`Error migrating ${collectionName}:`, error);
    throw error;
  }
}

// Execute migration
migrateCardsToFirestore();