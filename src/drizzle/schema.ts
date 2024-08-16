
import { pgTable, serial, text, boolean,numeric, pgEnum, varchar ,timestamp} from "drizzle-orm/pg-core";

//roleEnum
export const roleEnum = pgEnum("role", ['admin', 'user', 'disabled']);

//UserTable 
export const userTable = pgTable("userTable", {
        user_id: serial("user_id").primaryKey(),
        full_name: varchar("full_name"),
        email: varchar("email").notNull().unique().notNull(),
        password: varchar("password").notNull(),
        phone_number: varchar("phone_number"),
        address: varchar("address"),
        role: roleEnum('role').default('user'),
        isPremium: boolean('isPremium').default(false),
        created_at: timestamp("created_at").defaultNow(),
        updated_at: timestamp("updated_at").defaultNow(),
});

export const gdp = pgTable('gdp', {
        id: serial('id').primaryKey(),
        year: serial('year').notNull(),
        value: numeric('value').notNull(),
});

export const population = pgTable('population', {
        id: serial('id').primaryKey(),
        year: serial('year').notNull(),
        value: numeric('value').notNull(),
});

//gdp per capita
export const gdp_per_capita = pgTable('gdp_per_capita', {
        id: serial('id').primaryKey(),
        year: serial('year').notNull(),
        value: numeric('value').notNull(),
});

export const exchange_rate = pgTable('exchange_rate', {
        id: serial('id').primaryKey(),
        date: text('date').notNull(),
        value: numeric('value').notNull(),
});

export const share_prices = pgTable('share_prices', {
        id: serial('id').primaryKey(),
        date: text('date').notNull(),
        close: numeric('close').notNull(),
});

export const inflation_rate = pgTable('inflation_rate', {
        id: serial('id').primaryKey(),
        month: text('month').notNull(),
        value: numeric('value').notNull(),
});

export const safaricom_share_prices = pgTable('safaricom_share_prices', {
        id: serial('id').primaryKey(),
        date: text('date').notNull(),
        close: numeric('close').notNull(),
});


//infer types
export type TUserInsert = typeof userTable.$inferInsert;
export type TUserSelect = typeof userTable.$inferSelect;

export type TgdpInsert = typeof gdp.$inferInsert;
export type TgdpSelect = typeof gdp.$inferSelect;

export type TpopulationInsert = typeof population.$inferInsert;
export type TpopulationSelect = typeof population.$inferSelect;

export type TexchangeRateInsert = typeof exchange_rate.$inferInsert;
export type TexchangeRateSelect = typeof exchange_rate.$inferSelect;

export type TsharePricesInsert = typeof share_prices.$inferInsert;
export type TsharePricesSelect = typeof share_prices.$inferSelect;

export type Tgdp_per_capitaInsert = typeof gdp_per_capita.$inferInsert;
export type Tgdp_per_capitaSelect = typeof gdp_per_capita.$inferSelect;

export type TinflationRateInsert = typeof inflation_rate.$inferInsert;
export type TinflationRateSelect = typeof inflation_rate.$inferSelect;

export type TsafaricomSharePricesInsert = typeof safaricom_share_prices.$inferInsert;
export type TsafaricomSharePricesSelect = typeof safaricom_share_prices.$inferSelect;

//export all tables
