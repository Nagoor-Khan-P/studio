import type { Trade } from './types';

// In-memory store for demonstration purposes.
// In a real application, you would use a database.
let trades: Trade[] = [
    { id: '1', date: new Date('2024-07-15'), amount: 150.75, notes: 'Good start to the week.' },
    { id: '2', date: new Date('2024-07-16'), amount: -50.25, notes: 'Small loss, followed my plan.' },
    { id: '3', date: new Date('2024-07-17'), amount: 250.00, notes: 'Big win on a breakout.' },
    { id: '4', date: new Date('2024-07-18'), amount: -75.50, notes: 'Choppy market.' },
    { id: '5', date: new Date('2024-07-19'), amount: 120.00, notes: 'Consistent profits.' },
    { id: '6', date: new Date('2024-07-20'), amount: 30.50, notes: 'Scalping.' },
    { id: '7', date: new Date('2024-07-21'), amount: -90.00, notes: 'Revenge trading, need to stop.' },
];

// Sort trades by date descending
trades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export async function getTrades(): Promise<Trade[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return trades;
}

export async function addTrade(trade: Omit<Trade, 'id' | 'date'> & {date: Date}): Promise<Trade> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const newTrade = { ...trade, id: (trades.length + 1).toString() };
  trades = [newTrade, ...trades];
  trades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return newTrade;
}
