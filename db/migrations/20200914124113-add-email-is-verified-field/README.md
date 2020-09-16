# Migration `20200914124113-add-email-is-verified-field`

This migration has been generated by Simon Knott at 9/14/2020, 2:41:13 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."User" ADD COLUMN "emailIsVerified" boolean   NOT NULL DEFAULT false
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200914124000-make-hashed-password-required..20200914124113-add-email-is-verified-field
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgres"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -12,15 +12,16 @@
 // --------------------------------------
 model User {
-  createdAt      DateTime  @default(now())
-  updatedAt      DateTime  @updatedAt
-  email          String    @unique
-  hashedPassword String
-  sessions       Session[]
+  createdAt       DateTime  @default(now())
+  updatedAt       DateTime  @updatedAt
+  email           String    @unique
+  emailIsVerified Boolean   @default(false)
+  hashedPassword  String
+  sessions        Session[]
-  isActive       Boolean @default(true)
+  isActive Boolean @default(true)
   id                     String  @unique @id
   subscriptionId         String? @unique
   defaultPaymentMethodId String? @unique
@@ -48,9 +49,9 @@
   owner     User     @relation(fields: [ownerId], references: [id])
   ownerId   String
   tokens    Token[]
-  isActive  Boolean @default(true)
+  isActive Boolean @default(true)
   @@id([ownerId, slug])
 }
@@ -59,9 +60,9 @@
   projectOwnerId String
   project        Project @relation(fields: [projectSlug, projectOwnerId], references: [slug, ownerId])
   name           String
-  isActive       Boolean @default(true)
+  isActive Boolean @default(true)
   UsageRecord UsageRecord[]
   @@id([projectSlug, projectOwnerId, name])
```

