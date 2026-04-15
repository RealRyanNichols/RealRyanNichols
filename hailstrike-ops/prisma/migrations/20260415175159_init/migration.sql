-- CreateTable
CREATE TABLE "HailEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nwsAlertId" TEXT,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "city" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "hailSize" REAL NOT NULL,
    "source" TEXT NOT NULL,
    "sourceDetail" TEXT,
    "damage" TEXT NOT NULL,
    "windSpeed" REAL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "neighborhoods" TEXT NOT NULL DEFAULT '',
    "swathGeoJSON" TEXT,
    "avgHomeValue" REAL,
    "medianIncome" REAL,
    "population" INTEGER,
    "structures" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ownerName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "website" TEXT,
    "carsPerMonth" INTEGER,
    "hailExperience" TEXT,
    "status" TEXT NOT NULL DEFAULT 'prospect',
    "notes" TEXT,
    "outreachMethod" TEXT,
    "outreachSentAt" DATETIME,
    "industryMode" TEXT NOT NULL DEFAULT 'auto',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Business_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "HailEvent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IntelLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourcePhone" TEXT,
    "callerName" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "IntelLog_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "HailEvent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OutreachLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT,
    "method" TEXT NOT NULL,
    "recipientCount" INTEGER NOT NULL,
    "area" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OutreachLog_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "HailEvent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdCampaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "metaCampaignId" TEXT,
    "city" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "targeting" TEXT NOT NULL,
    "radiusMiles" REAL NOT NULL,
    "dailyBudget" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "autoApproved" BOOLEAN NOT NULL DEFAULT false,
    "leadsGenerated" INTEGER NOT NULL DEFAULT 0,
    "industryMode" TEXT NOT NULL DEFAULT 'auto',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AdCampaign_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "HailEvent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "HailEvent_nwsAlertId_key" ON "HailEvent"("nwsAlertId");
