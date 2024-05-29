-- CreateTable
CREATE TABLE "Proof" (
    "id" TEXT NOT NULL,
    "customerPublicKey" TEXT NOT NULL,
    "proofValue" TEXT NOT NULL,

    CONSTRAINT "Proof_pkey" PRIMARY KEY ("id")
);
