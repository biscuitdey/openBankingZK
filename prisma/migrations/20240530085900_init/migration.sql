/*
  Warnings:

  - A unique constraint covering the columns `[publicKey]` on the table `CustomerVerifier` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CustomerVerifier_publicKey_key" ON "CustomerVerifier"("publicKey");
