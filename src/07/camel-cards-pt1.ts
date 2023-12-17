import { readFileSync } from 'fs';
import { resolve } from 'path';

enum HandType {
  HighCard = 1,
  OnePair = 2,
  TwoPairs = 3,
  ThreeOfAKind = 4,
  FullHouse = 5,
  FourOfAKind = 6,
  FiveOfAKind = 7,
}

type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'T' | 'J' | 'Q' | 'K' | 'A';

interface HandOfCards {
  bid: number;
  type: HandType;
  cards: [number, number, number, number, number];
}

function cardValueToNumber(value: CardValue): number {
  switch (value) {
    case 'T': return 10;
    case 'J': return 11;
    case 'Q': return 12;
    case 'K': return 13;
    case 'A': return 14;
    default: return +value;
  }
}

function parseLine(line: string): HandOfCards {
  const [cards, bid] = line.split(' ');
  const cardsMap = new Map<number, number>();
  const cardsArray = [];

  for (const card of cards.split('')) {
    const cardNum = cardValueToNumber(card as CardValue);
    cardsArray.push(cardNum);

    const count = cardsMap.get(cardNum) || 0;
    cardsMap.set(cardNum, count + 1);
  }

  let type = HandType.HighCard;
  if (cardsMap.size === 1) {
    type = HandType.FiveOfAKind;
  }

  if (cardsMap.size === 2) {
    const [first, second] = cardsMap.values();
    if (first === 4 || second === 4) {
      type = HandType.FourOfAKind;
    } else {
      type = HandType.FullHouse;
    }
  }

  if (cardsMap.size === 3) {
    const [first, second, third] = cardsMap.values();
    if (first === 3 || second === 3 || third === 3) {
      type = HandType.ThreeOfAKind;
    } else {
      type = HandType.TwoPairs;
    }
  }

  if (cardsMap.size === 4) {
    type = HandType.OnePair;
  }

  return {
    bid: +bid,
    type,
    cards: cardsArray as [number, number, number, number, number]
  };
}

function compareHands(a: HandOfCards, b: HandOfCards): number {
  if (a.type !== b.type) {
    return b.type - a.type;
  }

  if (a.cards[0] !== b.cards[0]) {
    return b.cards[0] - a.cards[0];
  }

  if (a.cards[1] !== b.cards[1]) {
    return b.cards[1] - a.cards[1];
  }

  if (a.cards[2] !== b.cards[2]) {
    return b.cards[2] - a.cards[2];
  }

  if (a.cards[3] !== b.cards[3]) {
    return b.cards[3] - a.cards[3];
  }

  if (a.cards[4] !== b.cards[4]) {
    return b.cards[4] - a.cards[4];
  }

  return 0;
}

const input = readFileSync(resolve(__dirname, 'camel-cards.txt'), 'utf-8').trim();
const lines = input.split('\n');

const hands = lines.map(parseLine);
const sortedHands = hands.sort(compareHands);

const sumOfBids = sortedHands.reduce((sum, hand, i) => sum + (hand.bid * (hands.length - i)), 0);
console.log(sumOfBids);
