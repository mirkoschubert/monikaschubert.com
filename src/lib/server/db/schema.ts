import {
	pgTable,
	serial,
	text,
	integer,
	boolean,
	jsonb,
	timestamp,
	index
} from 'drizzle-orm/pg-core';

export type LocalizedString = { en: string; de: string };

export const artwork = pgTable(
	'artwork',
	{
		id: serial('id').primaryKey(),
		title: jsonb('title').notNull().$type<LocalizedString>(),
		description: jsonb('description').$type<LocalizedString>(),
		year: integer('year'),
		medium: text('medium'),
		dimensions: text('dimensions'),
		imageUrl: text('image_url').notNull(),
		slug: text('slug').notNull().unique(),
		category: text('category').notNull().default('other'),
		published: boolean('published').notNull().default(false),
		sortOrder: integer('sort_order').notNull().default(0),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow()
	},
	(table) => [
		index('artwork_slug_idx').on(table.slug),
		index('artwork_published_idx').on(table.published)
	]
);

export const exhibition = pgTable(
	'exhibition',
	{
		id: serial('id').primaryKey(),
		title: jsonb('title').notNull().$type<LocalizedString>(),
		description: jsonb('description').$type<LocalizedString>(),
		location: text('location').notNull(),
		dateFrom: timestamp('date_from').notNull(),
		dateTo: timestamp('date_to'),
		imageUrl: text('image_url'),
		published: boolean('published').notNull().default(false),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow()
	},
	(table) => [index('exhibition_date_idx').on(table.dateFrom)]
);

export * from './auth.schema';
