# Migration `20201015090959-init`

This migration has been generated by Simon Knott at 10/15/2020, 11:09:59 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."User" (
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL ,
"email" text   NOT NULL ,
"emailIsVerified" boolean   NOT NULL DEFAULT false,
"hashedPassword" text   NOT NULL ,
"isActive" boolean   NOT NULL DEFAULT true,
"hasBeenWarnedAboutOverage" boolean   NOT NULL DEFAULT false,
"id" text   NOT NULL ,
"subscriptionId" text   ,
"subscriptionPaused" boolean   NOT NULL DEFAULT false,
"subscriptionUpdateURL" text   ,
"subscriptionCancelURL" text   ,
"freeInvocations" integer   NOT NULL DEFAULT 100,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Session" (
"id" SERIAL,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL ,
"expiresAt" timestamp(3)   ,
"handle" text   NOT NULL ,
"userId" text   ,
"hashedSessionToken" text   ,
"antiCSRFToken" text   ,
"publicData" text   ,
"privateData" text   ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Project" (
"slug" text   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"ownerId" text   NOT NULL ,
"isActive" boolean   NOT NULL DEFAULT true,
PRIMARY KEY ("ownerId","slug")
)

CREATE TABLE "public"."Token" (
"projectSlug" text   NOT NULL ,
"projectOwnerId" text   NOT NULL ,
"name" text   NOT NULL ,
"isActive" boolean   NOT NULL DEFAULT true,
PRIMARY KEY ("projectSlug","projectOwnerId","name")
)

CREATE TABLE "public"."UsageRecord" (
"tokenProjectOwnerId" text   NOT NULL ,
"tokenProjectSlug" text   NOT NULL ,
"tokenName" text   NOT NULL ,
"timestamp" timestamp(3)   NOT NULL ,
"invocations" integer   NOT NULL ,
PRIMARY KEY ("tokenProjectSlug","tokenName","timestamp","tokenProjectOwnerId")
)

CREATE UNIQUE INDEX "User.email_unique" ON "public"."User"("email")

CREATE UNIQUE INDEX "User.subscriptionId_unique" ON "public"."User"("subscriptionId")

CREATE UNIQUE INDEX "Session.handle_unique" ON "public"."Session"("handle")

ALTER TABLE "public"."Session" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Project" ADD FOREIGN KEY ("ownerId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Token" ADD FOREIGN KEY ("projectSlug", "projectOwnerId")REFERENCES "public"."Project"("slug","ownerId") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."UsageRecord" ADD FOREIGN KEY ("tokenProjectSlug", "tokenName", "tokenProjectOwnerId")REFERENCES "public"."Token"("projectSlug","name","projectOwnerId") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201015090959-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,86 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "postgres"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+// --------------------------------------
+
+model User {
+  createdAt       DateTime  @default(now())
+  updatedAt       DateTime  @updatedAt
+  email           String    @unique
+  emailIsVerified Boolean   @default(false)
+  hashedPassword  String
+  sessions        Session[]
+
+  isActive Boolean @default(true)
+
+  hasBeenWarnedAboutOverage Boolean @default(false)
+
+  id                    String  @id @default(uuid())
+  subscriptionId        String? @unique
+  subscriptionPaused    Boolean @default(false)
+  subscriptionUpdateURL String?
+  subscriptionCancelURL String?
+
+  freeInvocations Int @default(100)
+
+  projects Project[]
+}
+
+model Session {
+  id                 Int       @id @default(autoincrement())
+  createdAt          DateTime  @default(now())
+  updatedAt          DateTime  @updatedAt
+  expiresAt          DateTime?
+  handle             String    @unique
+  user               User?     @relation(fields: [userId], references: [id])
+  userId             String?
+  hashedSessionToken String?
+  antiCSRFToken      String?
+  publicData         String?
+  privateData        String?
+}
+
+model Project {
+  slug      String
+  createdAt DateTime @default(now())
+  owner     User     @relation(fields: [ownerId], references: [id])
+  ownerId   String
+  tokens    Token[]
+
+  isActive Boolean @default(true)
+
+  @@id([ownerId, slug])
+}
+
+model Token {
+  projectSlug    String
+  projectOwnerId String
+  project        Project @relation(fields: [projectSlug, projectOwnerId], references: [slug, ownerId])
+  name           String
+
+  isActive Boolean @default(true)
+
+  UsageRecord UsageRecord[]
+
+  @@id([projectSlug, projectOwnerId, name])
+}
+
+model UsageRecord {
+  token               Token    @relation(fields: [tokenProjectSlug, tokenName, tokenProjectOwnerId], references: [projectSlug, name, projectOwnerId])
+  tokenProjectOwnerId String
+  tokenProjectSlug    String
+  tokenName           String
+  timestamp           DateTime
+  invocations         Int
+
+  @@id([tokenProjectSlug, tokenName, timestamp, tokenProjectOwnerId])
+}
```