import type { Card } from './types/Card'
import type { Expansion } from './types/Expansion'
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  where,
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { environment } from './environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { log } from 'console';

// Initialize Firebase
const app = initializeApp(environment.firebase);
const db = getFirestore(app);

// Collection name where all cards are stored
const ALL_CARDS_COLLECTION = 'AllCards';

// Create BehaviorSubjects to track card data
export const a1Cards$ = new BehaviorSubject<Card[]>([]);
export const a1aCards$ = new BehaviorSubject<Card[]>([]);
export const a2Cards$ = new BehaviorSubject<Card[]>([]);
export const paCards$ = new BehaviorSubject<Card[]>([]);
export const allCards$ = new BehaviorSubject<Card[]>([]);
export const expansions$ = new BehaviorSubject<Expansion[]>([]);

// Process card data if needed (mostly for backward compatibility)
const update = (cards: Card[], expansionName: string) => {
  for (const card of cards) {
    // Ensure expansion field is set
    card.expansion = expansionName;
    
    // Ensure card_id is set
    // @ts-ignore
    if (!card.card_id) {
      // @ts-ignore
      card.card_id = card.linkedCardID || `${expansionName}-${card.id}`;
    }
  }
  return cards;
}

// Set up real-time listener for the single collection
export function setupRealtimeListeners() {
  // Listen to all cards with ordering by expansion and order fields
  const allCardsQuery = query(
    collection(db, ALL_CARDS_COLLECTION), 
    orderBy('expansion', 'asc'),
    orderBy('order', 'asc')
  );
  
  onSnapshot(allCardsQuery, snapshot => {
    console.log(`Received ${snapshot.docs.length} cards from AllCards collection`);
    
    // Process all cards at once
    const cards = snapshot.docs.map(doc => doc.data() as Card);
    
    // Filter cards by expansion and update the corresponding BehaviorSubjects
    const a1 = cards.filter(card => card.expansion === 'A1');
    const a1a = cards.filter(card => card.expansion === 'A1a');
    const a2 = cards.filter(card => card.expansion === 'A2');
    const pa = cards.filter(card => card.expansion === 'P-A');
    
    // Update BehaviorSubjects
    a1Cards$.next(update(a1, 'A1'));
    a1aCards$.next(update(a1a, 'A1a'));
    a2Cards$.next(update(a2, 'A2'));
    paCards$.next(update(pa, 'P-A'));
    allCards$.next(cards);
    
    // Update expansions
    updateExpansions();
  }, error => {
    console.error('Error listening to AllCards collection:', error);
  });
}

// Update expansions whenever cards change
function updateExpansions() {
  const exps: Expansion[] = [
    {
      name: 'Genetic Apex',
      id: 'A1',
      cards: a1Cards$.getValue(),
      packs: [
        { name: 'Mewtwo pack', color: '#986C88' },
        { name: 'Charizard pack', color: '#E2711B' },
        { name: 'Pikachu pack', color: '#EDC12A' },
        { name: 'Every pack', color: '#CCCCCC' },
      ],
      tradeable: true,
    },
    {
      name: 'Mythical Island',
      id: 'A1a',
      cards: a1aCards$.getValue(),
      packs: [{ name: 'Mew pack', color: '#FFC1EA' }],
      tradeable: true,
    },
    {
      name: 'Space-Time Smackdown',
      id: 'A2',
      cards: a2Cards$.getValue(),
      packs: [
        { name: 'Dialga pack', color: '#A0C5E8' },
        { name: 'Palkia pack', color: '#D5A6BD' },
        { name: 'Every pack', color: '#CCCCCC' },
      ],
      tradeable: false,
    },
    {
      name: 'Promo-A',
      id: 'P-A',
      cards: paCards$.getValue(),
      packs: [{ name: 'Every pack', color: '#CCCCCC' }],
      tradeable: false,
      promo: true,
    },
  ];
  
  expansions$.next(exps);
}

// Manual fetch method as an alternative to the realtime listeners
export async function fetchAllCards() {
  try {
    console.log("Manually fetching all cards from Firestore...");
    
    // Fetch all cards in a single query
    const cards = await fetchAllCardsFromCollection();
    
    // Filter by expansion
    const a1Cards = cards.filter(card => card.expansion === 'A1');
    const a1aCards = cards.filter(card => card.expansion === 'A1a');
    const a2Cards = cards.filter(card => card.expansion === 'A2');
    const paCards = cards.filter(card => card.expansion === 'P-A');
    
    // Update BehaviorSubjects
    a1Cards$.next(a1Cards);
    a1aCards$.next(a1aCards);
    a2Cards$.next(a2Cards);
    paCards$.next(paCards);
    allCards$.next(cards);
    
    // Update expansions
    updateExpansions();
    
    return {
      a1: a1Cards,
      a1a: a1aCards,
      a2: a2Cards,
      pa: paCards,
      all: cards
    };
  } catch (error) {
    console.error("Error fetching cards:", error);
    return {
      a1: [],
      a1a: [],
      a2: [],
      pa: [],
      all: []
    };
  }
}

// Helper function to fetch all cards from the single collection
async function fetchAllCardsFromCollection(): Promise<Card[]> {
  try {
    // Order by expansion and then by order field
    const q = query(
      collection(db, ALL_CARDS_COLLECTION)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log(`No documents found in ${ALL_CARDS_COLLECTION}`);
      return [];
    }
    
    const cards = snapshot.docs.map(doc => doc.data() as Card);
    console.log(`Retrieved ${cards.length} cards from ${ALL_CARDS_COLLECTION}`);
    return cards;
  } catch (error) {
    console.error(`Error fetching cards from ${ALL_CARDS_COLLECTION}:`, error);
    return [];
  }
}

// Helper function to fetch cards from a specific expansion
// (Maintains backward compatibility with code that expects to fetch by collection)
async function fetchCardsForExpansion(expansionName: string): Promise<Card[]> {
  try {
    const q = query(
      collection(db, ALL_CARDS_COLLECTION),
      where('expansion', '==', expansionName)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log(`No documents found for expansion ${expansionName}`);
      return [];
    }
    
    const cards = snapshot.docs.map(doc => doc.data() as Card);
    return update(cards, expansionName);
  } catch (error) {
    console.error(`Error fetching cards for expansion ${expansionName}:`, error);
    return [];
  }
}



// Get a specific card by ID
export function getCardById(cardId: string): Observable<Card | undefined> {
  return allCards$.pipe(
    map(cards => cards.find(card => card.card_id === cardId))
  );
}

// Start listening to changes
setupRealtimeListeners();

export let a1Cards1 = fetchCardsForExpansion('A1');
export let a1aCards1 = fetchCardsForExpansion('A1a');
export let a2Cards1 = fetchCardsForExpansion('A2');
export let paCards1 = fetchCardsForExpansion('P-A');

// Export card arrays as a fallback for code that expects arrays directly
export let a1Cards: Card[] = [];
export let a1aCards: Card[] = [];
export let a2Cards: Card[] = [];
export let paCards: Card[] = [];
export let allCards: Card[] = [];
export let expansions: Expansion[] = [];

// Subscribe to BehaviorSubjects to keep arrays updated
a1Cards$.subscribe(cards => a1Cards = cards);
a1aCards$.subscribe(cards => a1aCards = cards);
a2Cards$.subscribe(cards => a2Cards = cards);
paCards$.subscribe(cards => paCards = cards);
allCards$.subscribe(cards => allCards = cards);
expansions$.subscribe(exps => expansions = exps);