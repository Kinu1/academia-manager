CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260508205512_InitialPostgres') THEN
    CREATE TABLE "Plans" (
        "Id" uuid NOT NULL,
        "Name" character varying(100) NOT NULL,
        "PriceAmount" numeric(12,2) NOT NULL,
        "PriceCurrency" character varying(3) NOT NULL,
        "DurationInDays" integer NOT NULL,
        "IsActive" boolean NOT NULL,
        "CreatedAtUtc" timestamp with time zone NOT NULL,
        "UpdatedAtUtc" timestamp with time zone,
        CONSTRAINT "PK_Plans" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260508205512_InitialPostgres') THEN
    CREATE TABLE "Users" (
        "Id" uuid NOT NULL,
        "Name" character varying(100) NOT NULL,
        "Email" character varying(200) NOT NULL,
        "PasswordHash" text NOT NULL,
        "Role" character varying(30) NOT NULL,
        "CreatedAtUtc" timestamp with time zone NOT NULL,
        "UpdatedAtUtc" timestamp with time zone,
        CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260508205512_InitialPostgres') THEN
    CREATE TABLE "Students" (
        "Id" uuid NOT NULL,
        "Name" character varying(100) NOT NULL,
        "Email" character varying(200) NOT NULL,
        "Phone" character varying(30),
        "Status" character varying(30) NOT NULL,
        "PlanId" uuid,
        "CreatedAtUtc" timestamp with time zone NOT NULL,
        "UpdatedAtUtc" timestamp with time zone,
        CONSTRAINT "PK_Students" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Students_Plans_PlanId" FOREIGN KEY ("PlanId") REFERENCES "Plans" ("Id") ON DELETE SET NULL
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260508205512_InitialPostgres') THEN
    CREATE TABLE "RefreshTokens" (
        "Id" uuid NOT NULL,
        "UserId" uuid NOT NULL,
        "TokenHash" text NOT NULL,
        "ExpiresAtUtc" timestamp with time zone NOT NULL,
        "RevokedAtUtc" timestamp with time zone,
        "CreatedAtUtc" timestamp with time zone NOT NULL,
        "UpdatedAtUtc" timestamp with time zone,
        CONSTRAINT "PK_RefreshTokens" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_RefreshTokens_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260508205512_InitialPostgres') THEN
    CREATE TABLE "Payments" (
        "Id" uuid NOT NULL,
        "StudentId" uuid NOT NULL,
        "Amount" numeric(12,2) NOT NULL,
        "Currency" character varying(3) NOT NULL,
        "DueDateUtc" timestamp with time zone NOT NULL,
        "PaidAtUtc" timestamp with time zone,
        "Status" character varying(30) NOT NULL,
        "CreatedAtUtc" timestamp with time zone NOT NULL,
        "UpdatedAtUtc" timestamp with time zone,
        CONSTRAINT "PK_Payments" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Payments_Students_StudentId" FOREIGN KEY ("StudentId") REFERENCES "Students" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260508205512_InitialPostgres') THEN
    CREATE TABLE "Trainings" (
        "Id" uuid NOT NULL,
        "StudentId" uuid NOT NULL,
        "Title" character varying(120) NOT NULL,
        "Description" character varying(2000) NOT NULL,
        "ScheduledForUtc" timestamp with time zone NOT NULL,
        "CreatedAtUtc" timestamp with time zone NOT NULL,
        "UpdatedAtUtc" timestamp with time zone,
        CONSTRAINT "PK_Trainings" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Trainings_Students_StudentId" FOREIGN KEY ("StudentId") REFERENCES "Students" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260508205512_InitialPostgres') THEN
    CREATE INDEX "IX_Payments_DueDateUtc" ON "Payments" ("DueDateUtc");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260508205512_InitialPostgres') THEN
    CREATE INDEX "IX_Payments_StudentId" ON "Payments" ("StudentId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260508205512_InitialPostgres') THEN
    CREATE UNIQUE INDEX "IX_Plans_Name" ON "Plans" ("Name");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260508205512_InitialPostgres') THEN
    CREATE UNIQUE INDEX "IX_RefreshTokens_TokenHash" ON "RefreshTokens" ("TokenHash");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260508205512_InitialPostgres') THEN
    CREATE INDEX "IX_RefreshTokens_UserId" ON "RefreshTokens" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260508205512_InitialPostgres') THEN
    CREATE UNIQUE INDEX "IX_Students_Email" ON "Students" ("Email");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260508205512_InitialPostgres') THEN
    CREATE INDEX "IX_Students_PlanId" ON "Students" ("PlanId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260508205512_InitialPostgres') THEN
    CREATE INDEX "IX_Trainings_ScheduledForUtc" ON "Trainings" ("ScheduledForUtc");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260508205512_InitialPostgres') THEN
    CREATE INDEX "IX_Trainings_StudentId" ON "Trainings" ("StudentId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260508205512_InitialPostgres') THEN
    CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260508205512_InitialPostgres') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260508205512_InitialPostgres', '9.0.0');
    END IF;
END $EF$;
COMMIT;

