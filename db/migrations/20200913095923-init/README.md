# Migration `20200913095923-init`

This migration has been generated by Simon Knott at 9/13/2020, 11:59:23 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."User" (
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL ,
"email" text   NOT NULL ,
"hashedPassword" text   ,
"id" text   NOT NULL ,
"subscriptionId" text   ,
"defaultPaymentMethodId" text   ,
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
"id" text   NOT NULL ,
"slug" text   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"ownerId" text   NOT NULL ,
PRIMARY KEY ("id","slug")
)

CREATE TABLE "public"."Token" (
"projectId" text   NOT NULL ,
"name" text   NOT NULL ,
PRIMARY KEY ("projectId","name")
)

CREATE UNIQUE INDEX "User.email_unique" ON "public"."User"("email")

CREATE UNIQUE INDEX "User.id_unique" ON "public"."User"("id")

CREATE UNIQUE INDEX "User.subscriptionId_unique" ON "public"."User"("subscriptionId")

CREATE UNIQUE INDEX "User.defaultPaymentMethodId_unique" ON "public"."User"("defaultPaymentMethodId")

CREATE UNIQUE INDEX "Session.handle_unique" ON "public"."Session"("handle")

CREATE UNIQUE INDEX "Project.id_unique" ON "public"."Project"("id")

ALTER TABLE "public"."Session" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Project" ADD FOREIGN KEY ("ownerId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Token" ADD FOREIGN KEY ("projectId")REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200913095923-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,60 @@
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
+  createdAt      DateTime  @default(now())
+  updatedAt      DateTime  @updatedAt
+  email          String    @unique
+  hashedPassword String?
+  sessions       Session[]
+
+  id                     String  @unique @id
+  subscriptionId         String? @unique
+  defaultPaymentMethodId String? @unique
+
+  projects Project[]
+}
+
+model Session {
+  id                 Int       @default(autoincrement()) @id
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
+  id        String   @unique
+  slug      String
+  createdAt DateTime @default(now())
+  owner     User     @relation(fields: [ownerId], references: [id])
+  ownerId   String
+  tokens    Token[]
+
+  @@id([id, slug])
+}
+
+model Token {
+  projectId String
+  project   Project @relation(fields: [projectId], references: [id])
+  name      String
+
+  @@id([projectId, name])
+}
```

