export const MATCH_STATES = [
  'OPEN',
  'CHALLENGED',
  'ACCEPTED',
  'STAKE_PENDING',
  'ESCROWED',
  'READY',
  'LIVE',
  'RESULT_PENDING',
  'RESULT_CONFIRMED',
  'SETTLED',
  'CANCELLED',
  'DISPUTED',
  'SUSPENDED',
  'REFUNDED',
] as const;

export type MatchState = (typeof MATCH_STATES)[number];

const transitions: Record<MatchState, readonly MatchState[]> = {
  OPEN: ['CHALLENGED', 'CANCELLED'],
  CHALLENGED: ['ACCEPTED', 'OPEN', 'CANCELLED'],
  ACCEPTED: ['STAKE_PENDING', 'CANCELLED'],
  STAKE_PENDING: ['ESCROWED', 'CANCELLED'],
  ESCROWED: ['READY', 'REFUNDED', 'CANCELLED'],
  READY: ['LIVE', 'CANCELLED'],
  LIVE: ['RESULT_PENDING', 'SUSPENDED'],
  RESULT_PENDING: ['RESULT_CONFIRMED', 'DISPUTED', 'SUSPENDED'],
  RESULT_CONFIRMED: ['SETTLED', 'DISPUTED'],
  SETTLED: [],
  CANCELLED: [],
  DISPUTED: ['RESULT_CONFIRMED', 'REFUNDED', 'SUSPENDED'],
  SUSPENDED: ['DISPUTED', 'REFUNDED'],
  REFUNDED: [],
};

export function canTransition(from: MatchState, to: MatchState): boolean {
  return transitions[from].includes(to);
}

export function transition(from: MatchState, to: MatchState): MatchState {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid match transition: ${from} -> ${to}`);
  }
  return to;
}

export type MatchParticipant = {
  playerId: string;
  stakeMinor: bigint;
  role: 'CHALLENGER' | 'OPPONENT';
};