-- CreateTable
CREATE TABLE "public"."Bets" (
    "betId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "potentialWin" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Bets_pkey" PRIMARY KEY ("betId","eventId")
);

-- AddForeignKey
ALTER TABLE "public"."Bets" ADD CONSTRAINT "Bets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
