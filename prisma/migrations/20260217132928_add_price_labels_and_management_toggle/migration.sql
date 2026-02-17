-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "exitNoticeLabel" TEXT NOT NULL DEFAULT 'Exit Notice',
ADD COLUMN     "initialTermLabel" TEXT NOT NULL DEFAULT 'Initial Term',
ADD COLUMN     "priceSubtext" TEXT NOT NULL DEFAULT 'Billed monthly in advance',
ADD COLUMN     "showManagement" BOOLEAN NOT NULL DEFAULT true;
