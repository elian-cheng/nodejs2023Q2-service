-- AlterTable
ALTER TABLE "users" DROP COLUMN "password",
ADD COLUMN     "hash" TEXT NOT NULL,
ADD COLUMN     "hashedRt" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "hash",
ADD COLUMN     "password" TEXT NOT NULL;