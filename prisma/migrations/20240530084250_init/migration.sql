-- CreateTable
CREATE TABLE "CustomerVerifier" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "proof" TEXT NOT NULL,

    CONSTRAINT "CustomerVerifier_pkey" PRIMARY KEY ("id")
);
