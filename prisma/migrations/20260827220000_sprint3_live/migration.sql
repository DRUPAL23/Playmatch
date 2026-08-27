-- Sprint 3 live operations
CREATE TYPE "DisputeStatus" AS ENUM ('OPEN','UNDER_REVIEW','RESOLVED_REJECTED','RESOLVED_REFUND','RESOLVED_CONFIRMED');

CREATE TABLE "MatchEvent" (
  "id" TEXT NOT NULL,
  "matchId" TEXT NOT NULL,
  "actorId" TEXT,
  "type" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MatchEvent_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "MatchDispute" (
  "id" TEXT NOT NULL,
  "matchId" TEXT NOT NULL,
  "openedBy" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "status" "DisputeStatus" NOT NULL DEFAULT 'OPEN',
  "resolution" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" TIMESTAMP(3),
  CONSTRAINT "MatchDispute_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "MatchEvent_matchId_createdAt_idx" ON "MatchEvent"("matchId","createdAt");
CREATE INDEX "MatchDispute_matchId_status_idx" ON "MatchDispute"("matchId","status");
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MatchDispute" ADD CONSTRAINT "MatchDispute_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MatchDispute" ADD CONSTRAINT "MatchDispute_openedBy_fkey" FOREIGN KEY ("openedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
