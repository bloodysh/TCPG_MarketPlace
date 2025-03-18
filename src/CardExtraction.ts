import type { Card } from './types/Card'
import type { Expansion } from './types/Expansion'
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { environment } from './environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Initialize Firebase
const app = initializeApp(environment.firebase);
const db = getFirestore(app);

// Create BehaviorSubjects to track card data
// BehaviorSubject retains the current value and emits it to new subscribers
export const a1Cards$ = new BehaviorSubject<Card[]>([]);
export const a1aCards$ = new BehaviorSubject<Card[]>([]);
export const a2Cards$ = new BehaviorSubject<Card[]>([]);
export const paCards$ = new BehaviorSubject<Card[]>([]);
export const allCards$ = new BehaviorSubject<Card[]>([]);
export const expansions$ = new BehaviorSubject<Expansion[]>([]);

// Process card data
const update = (cards: Card[], expansionName: string) => {
  for (const card of cards) {
    card.expansion = expansionName;
    // @ts-ignore
    card.card_id = card.linkedCardID || `${expansionName}-${card.id}`;
  }
  return cards;
}

// Set up real-time listeners for each collection
export function setupRealtimeListeners() {
  // A1 collection
  const a1Query = query(collection(db, 'A1'), orderBy('order', 'asc'));
  onSnapshot(a1Query, snapshot => {
    const cards = snapshot.docs.map(doc => doc.data() as Card);
    const updatedCards = update(cards, 'A1');
    a1Cards$.next(updatedCards);
    updateAllCards();
  }, error => {
    console.error('Error listening to A1 collection:', error);
  });

  // A1a collection
  const a1aQuery = query(collection(db, 'A1a'), orderBy('order', 'asc'));
  onSnapshot(a1aQuery, snapshot => {
    const cards = snapshot.docs.map(doc => doc.data() as Card);
    const updatedCards = update(cards, 'A1a');
    a1aCards$.next(updatedCards);
    updateAllCards();
  }, error => {
    console.error('Error listening to A1a collection:', error);
  });

  // A2 collection
  const a2Query = query(collection(db, 'A2'), orderBy('order', 'asc'));
  onSnapshot(a2Query, snapshot => {
    const cards = snapshot.docs.map(doc => doc.data() as Card);
    const updatedCards = update(cards, 'A2');
    a2Cards$.next(updatedCards);
    updateAllCards();
  }, error => {
    console.error('Error listening to A2 collection:', error);
  });

  // P-A collection
  const paQuery = query(collection(db, 'P-A'), orderBy('order', 'asc'));
  onSnapshot(paQuery, snapshot => {
    const cards = snapshot.docs.map(doc => doc.data() as Card);
    const updatedCards = update(cards, 'P-A');
    paCards$.next(updatedCards);
    updateAllCards();
  }, error => {
    console.error('Error listening to P-A collection:', error);
  });
}

// Update the allCards BehaviorSubject whenever any individual card set changes
function updateAllCards() {
  const all = [
    ...a1Cards$.getValue(),
    ...a1aCards$.getValue(),
    ...a2Cards$.getValue(),
    ...paCards$.getValue()
  ];
  allCards$.next(all);
  updateExpansions();
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
    
    // Fetch all collections in parallel
    const [a1Cards, a1aCards, a2Cards, paCards] = await Promise.all([
      fetchCollection('A1'),
      fetchCollection('A1a'),
      fetchCollection('A2'),
      fetchCollection('P-A')
    ]);
    
    // Update BehaviorSubjects
    a1Cards$.next(a1Cards);
    a1aCards$.next(a1aCards);
    a2Cards$.next(a2Cards);
    paCards$.next(paCards);
    
    // Update the combined card list
    updateAllCards();
    
    return {
      a1: a1Cards,
      a1a: a1aCards,
      a2: a2Cards,
      pa: paCards,
      all: [...a1Cards, ...a1aCards, ...a2Cards, ...paCards]
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

// Helper function to fetch a specific collection
async function fetchCollection(collectionName: string): Promise<Card[]> {
  try {
    const q = query(collection(db, collectionName), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log(`No documents found in ${collectionName}`);
      return [];
    }
    
    const cards = snapshot.docs.map(doc => doc.data() as Card);
    return update(cards, collectionName);
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
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

// Export card arrays as a fallback for code that expects arrays directly
// These will be updated from the BehaviorSubjects
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