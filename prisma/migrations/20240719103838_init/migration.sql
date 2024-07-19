-- CreateTable
CREATE TABLE "CustomerVerifier" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "certificate" TEXT NOT NULL,

    CONSTRAINT "CustomerVerifier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerVerifier_publicKey_key" ON "CustomerVerifier"("publicKey");
