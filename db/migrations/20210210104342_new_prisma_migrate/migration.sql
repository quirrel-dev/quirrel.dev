-- CreateTable
CREATE TABLE "User" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "emailIsVerified" BOOLEAN NOT NULL DEFAULT false,
    "hashedPassword" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "hasBeenWarnedAboutOverage" BOOLEAN NOT NULL DEFAULT false,
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "subscriptionPaused" BOOLEAN NOT NULL DEFAULT false,
    "subscriptionUpdateURL" TEXT,
    "subscriptionCancelURL" TEXT,
    "freeInvocations" INTEGER NOT NULL DEFAULT 100,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "handle" TEXT NOT NULL,
    "userId" TEXT,
    "hashedSessionToken" TEXT,
    "antiCSRFToken" TEXT,
    "publicData" TEXT,
    "privateData" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY ("ownerId","slug")
);

-- CreateTable
CREATE TABLE "Token" (
    "projectSlug" TEXT NOT NULL,
    "projectOwnerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY ("projectSlug","projectOwnerId","name")
);

-- CreateTable
CREATE TABLE "Incident" (
    "tokenProjectOwnerId" TEXT NOT NULL,
    "tokenProjectSlug" TEXT NOT NULL,
    "tokenName" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "jobData" TEXT NOT NULL,
    "incident" TEXT NOT NULL,

    PRIMARY KEY ("tokenProjectSlug","tokenName","tokenProjectOwnerId","id")
);

-- CreateTable
CREATE TABLE "UsageRecord" (
    "tokenProjectOwnerId" TEXT NOT NULL,
    "tokenProjectSlug" TEXT NOT NULL,
    "tokenName" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "invocations" INTEGER NOT NULL,

    PRIMARY KEY ("tokenProjectSlug","tokenName","timestamp","tokenProjectOwnerId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.subscriptionId_unique" ON "User"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Session.handle_unique" ON "Session"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Incident.id_unique" ON "Incident"("id");

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD FOREIGN KEY ("projectSlug", "projectOwnerId") REFERENCES "Project"("slug", "ownerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD FOREIGN KEY ("tokenProjectOwnerId", "tokenProjectSlug", "tokenName") REFERENCES "Token"("projectSlug", "name", "projectOwnerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageRecord" ADD FOREIGN KEY ("tokenProjectOwnerId", "tokenProjectSlug", "tokenName") REFERENCES "Token"("projectSlug", "name", "projectOwnerId") ON DELETE CASCADE ON UPDATE CASCADE;
