export type LedgerAccountType = 'PLAYER_AVAILABLE' | 'PLAYER_LOCKED' | 'ESCROW' | 'PLATFORM_FEE' | 'EXTERNAL_CLEARING';

export type LedgerEntry = {
  accountId: string;
  amountMinor: bigint;
  direction: 'DEBIT' | 'CREDIT';
  referenceId: string;
  idempotencyKey: string;
};

export function assertBalanced(entries: readonly LedgerEntry[]): void {
  const net = entries.reduce((sum, entry) => {
    const signed = entry.direction === 'DEBIT' ? entry.amountMinor : -entry.amountMinor;
    return sum + signed;
  }, 0n);
  if (net !== 0n) throw new Error('Ledger transaction is not balanced');
}

export function settlementEntries(params: {
  escrowAccountId: string;
  winnerAccountId: string;
  platformFeeAccountId: string;
  prizeMinor: bigint;
  feeMinor: bigint;
  referenceId: string;
}): LedgerEntry[] {
  if (params.prizeMinor < 0n || params.feeMinor < 0n) throw new Error('Amounts cannot be negative');
  const total = params.prizeMinor + params.feeMinor;
  const entries: LedgerEntry[] = [
    { accountId: params.escrowAccountId, amountMinor: total, direction: 'DEBIT', referenceId: params.referenceId, idempotencyKey: `${params.referenceId}:escrow` },
    { accountId: params.winnerAccountId, amountMinor: params.prizeMinor, direction: 'CREDIT', referenceId: params.referenceId, idempotencyKey: `${params.referenceId}:winner` },
    { accountId: params.platformFeeAccountId, amountMinor: params.feeMinor, direction: 'CREDIT', referenceId: params.referenceId, idempotencyKey: `${params.referenceId}:fee` },
  ];
  assertBalanced(entries);
  return entries;
}