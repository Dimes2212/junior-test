-- CreateTable
CREATE TABLE "public"."Events" (
    "id" TEXT NOT NULL,
    "coefficient" DOUBLE PRECISION NOT NULL,
    "deadline" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);
