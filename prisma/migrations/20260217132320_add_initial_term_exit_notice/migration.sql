-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "exitNotice" TEXT NOT NULL DEFAULT '30 Days',
ADD COLUMN     "initialTerm" TEXT NOT NULL DEFAULT '3 Months';
