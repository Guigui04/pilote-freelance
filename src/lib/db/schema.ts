import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  numeric,
  boolean,
  jsonb,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// ENUMS
// ---------------------------------------------------------------------------
export const companyStatusEnum = pgEnum("company_status", [
  "prospect",
  "actif",
  "pause",
  "termine",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "a_faire",
  "en_cours",
  "en_validation",
  "termine",
]);

export const taskTypeEnum = pgEnum("task_type", ["tache", "bug", "evolution"]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "basse",
  "moyenne",
  "haute",
  "urgente",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "a_faire",
  "en_cours",
  "en_validation",
  "termine",
]);

export const quoteStatusEnum = pgEnum("quote_status", [
  "brouillon",
  "envoye",
  "accepte",
  "refuse",
]);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "brouillon",
  "envoyee",
  "payee",
  "en_retard",
  "partiel",
]);

export const contentStatusEnum = pgEnum("content_status", [
  "idee",
  "en_cours",
  "a_valider",
  "programme",
  "publie",
]);

export const reportTypeEnum = pgEnum("report_type", [
  "cr_reunion",
  "point_hebdo",
  "bilan",
  "autre",
]);

export const documentTypeEnum = pgEnum("document_type", [
  "file",
  "notion",
  "drive",
  "sheet",
  "link",
]);

export const aiTypeEnum = pgEnum("ai_type", [
  "cr",
  "contenu",
  "resume",
  "reco",
  "autre",
]);

export const integrationProviderEnum = pgEnum("integration_provider", [
  "google",
  "notion",
  "gemini",
  "resend",
]);

// ---------------------------------------------------------------------------
// SOCIÉTÉS
// ---------------------------------------------------------------------------
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  sector: text("sector"),
  siret: text("siret"),
  address: text("address"),
  status: companyStatusEnum("status").notNull().default("prospect"),
  color: text("color").default("#6366f1"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// CONTACTS
// ---------------------------------------------------------------------------
export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  role: text("role"),
  email: text("email"),
  phone: text("phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// PROJETS
// ---------------------------------------------------------------------------
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  description: text("description"),
  status: projectStatusEnum("status").notNull().default("a_faire"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  budget: numeric("budget", { precision: 12, scale: 2 }),
  hourlyRate: numeric("hourly_rate", { precision: 8, scale: 2 }),
  dailyRate: numeric("daily_rate", { precision: 10, scale: 2 }),
  color: text("color").default("#6366f1"),
  tags: text("tags").array(),
  progress: integer("progress").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// JALONS (roadmap)
// ---------------------------------------------------------------------------
export const milestones = pgTable("milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  dueDate: date("due_date"),
  status: text("status").default("a_faire"),
  position: integer("position").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// TÂCHES
// ---------------------------------------------------------------------------
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
  parentTaskId: uuid("parent_task_id"),
  title: text("title").notNull(),
  description: text("description"),
  type: taskTypeEnum("type").notNull().default("tache"),
  priority: taskPriorityEnum("priority").notNull().default("moyenne"),
  status: taskStatusEnum("status").notNull().default("a_faire"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  estimatedMinutes: integer("estimated_minutes"),
  isRecurring: boolean("is_recurring").default(false),
  recurrenceRule: text("recurrence_rule"),
  tags: text("tags").array(),
  position: integer("position").default(0),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// ÉVÉNEMENTS AGENDA
// ---------------------------------------------------------------------------
export const calendarEvents = pgTable("calendar_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description"),
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true }).notNull(),
  allDay: boolean("all_day").default(false),
  location: text("location"),
  color: text("color").default("#6366f1"),
  googleEventId: text("google_event_id"),
  reminderMinutes: integer("reminder_minutes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// SUIVI DU TEMPS
// ---------------------------------------------------------------------------
export const timeEntries = pgTable("time_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  taskId: uuid("task_id").references(() => tasks.id, { onDelete: "set null" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
  description: text("description"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  durationMinutes: integer("duration_minutes"),
  billable: boolean("billable").default(true),
  hourlyRate: numeric("hourly_rate", { precision: 8, scale: 2 }),
  dailyRate: numeric("daily_rate", { precision: 10, scale: 2 }),
  invoiced: boolean("invoiced").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// DEVIS
// ---------------------------------------------------------------------------
export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  number: text("number").notNull(),
  status: quoteStatusEnum("status").notNull().default("brouillon"),
  issueDate: date("issue_date").notNull(),
  validUntil: date("valid_until"),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
  vatAmount: numeric("vat_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
  notes: text("notes"),
  terms: text("terms"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const quoteItems = pgTable("quote_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  quoteId: uuid("quote_id").notNull().references(() => quotes.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull().default("1"),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull().default("0"),
  vatRate: numeric("vat_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  position: integer("position").default(0),
});

// ---------------------------------------------------------------------------
// FACTURES
// ---------------------------------------------------------------------------
export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  quoteId: uuid("quote_id").references(() => quotes.id, { onDelete: "set null" }),
  number: text("number").notNull(),
  status: invoiceStatusEnum("status").notNull().default("brouillon"),
  issueDate: date("issue_date").notNull(),
  dueDate: date("due_date"),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
  vatAmount: numeric("vat_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
  paidAmount: numeric("paid_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  legalMentions: text("legal_mentions"),
  notes: text("notes"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const invoiceItems = pgTable("invoice_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull().default("1"),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull().default("0"),
  vatRate: numeric("vat_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  position: integer("position").default(0),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  invoiceId: uuid("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  paidAt: date("paid_at").notNull(),
  method: text("method"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// CONTENUS (calendrier éditorial)
// ---------------------------------------------------------------------------
export const contentItems = pgTable("content_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  platform: text("platform"),
  format: text("format"),
  status: contentStatusEnum("status").notNull().default("idee"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  brief: text("brief"),
  body: text("body"),
  assetsLinks: text("assets_links").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// COMPTES RENDUS
// ---------------------------------------------------------------------------
export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  type: reportTypeEnum("type").notNull().default("cr_reunion"),
  content: text("content"),
  sourceNotes: text("source_notes"),
  aiGenerated: boolean("ai_generated").default(false),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// DOCUMENTS & RESSOURCES
// ---------------------------------------------------------------------------
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  type: documentTypeEnum("type").notNull().default("link"),
  url: text("url"),
  storagePath: text("storage_path"),
  category: text("category"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// HISTORIQUE IA
// ---------------------------------------------------------------------------
export const aiGenerations = pgTable("ai_generations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  type: aiTypeEnum("type").notNull().default("autre"),
  prompt: text("prompt"),
  output: text("output"),
  contextRef: text("context_ref"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// AUTOMATISATIONS
// ---------------------------------------------------------------------------
export const automations = pgTable("automations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  triggerType: text("trigger_type").notNull(),
  conditions: jsonb("conditions"),
  action: jsonb("action"),
  isActive: boolean("is_active").default(true),
  lastRunAt: timestamp("last_run_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// INTÉGRATIONS
// ---------------------------------------------------------------------------
export const integrations = pgTable("integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  provider: integrationProviderEnum("provider").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  scopes: text("scopes"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// PARAMÈTRES
// ---------------------------------------------------------------------------
export const settings = pgTable("settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique(),
  currency: text("currency").default("EUR"),
  defaultHourlyRate: numeric("default_hourly_rate", { precision: 8, scale: 2 }).default("0"),
  defaultDailyRate: numeric("default_daily_rate", { precision: 10, scale: 2 }),
  hoursPerDay: numeric("hours_per_day", { precision: 4, scale: 2 }).default("7"),
  fiscalRegime: text("fiscal_regime").default("auto_entrepreneur"),
  vatApplicable: boolean("vat_applicable").default(false),
  vatRate: numeric("vat_rate", { precision: 5, scale: 2 }).default("0"),
  legalMentions: text("legal_mentions").default(
    "TVA non applicable, art. 293 B du CGI"
  ),
  logoUrl: text("logo_url"),
  companyInfo: jsonb("company_info"),
  invoicePrefix: text("invoice_prefix").default("F"),
  quotePrefix: text("quote_prefix").default("D"),
  nextInvoiceNumber: integer("next_invoice_number").default(1),
  nextQuoteNumber: integer("next_quote_number").default(1),
  urssafRate: numeric("urssaf_rate", { precision: 5, scale: 2 }).default("22"),
  timezone: text("timezone").default("Europe/Paris"),
  theme: text("theme").default("system"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// RELATIONS
// ---------------------------------------------------------------------------
export const companiesRelations = relations(companies, ({ many }) => ({
  contacts: many(contacts),
  projects: many(projects),
  invoices: many(invoices),
}));

export const contactsRelations = relations(contacts, ({ one }) => ({
  company: one(companies, {
    fields: [contacts.companyId],
    references: [companies.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  company: one(companies, {
    fields: [projects.companyId],
    references: [companies.id],
  }),
  tasks: many(tasks),
  milestones: many(milestones),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  company: one(companies, {
    fields: [tasks.companyId],
    references: [companies.id],
  }),
}));

export const milestonesRelations = relations(milestones, ({ one }) => ({
  project: one(projects, {
    fields: [milestones.projectId],
    references: [projects.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  company: one(companies, {
    fields: [invoices.companyId],
    references: [companies.id],
  }),
  items: many(invoiceItems),
  payments: many(payments),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
}));

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  company: one(companies, {
    fields: [quotes.companyId],
    references: [companies.id],
  }),
  items: many(quoteItems),
}));

export const quoteItemsRelations = relations(quoteItems, ({ one }) => ({
  quote: one(quotes, {
    fields: [quoteItems.quoteId],
    references: [quotes.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  invoice: one(invoices, {
    fields: [payments.invoiceId],
    references: [invoices.id],
  }),
}));

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  task: one(tasks, { fields: [timeEntries.taskId], references: [tasks.id] }),
  project: one(projects, {
    fields: [timeEntries.projectId],
    references: [projects.id],
  }),
}));
