import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  index
} from 'drizzle-orm/pg-core'

export type LocalizedString = { en: string; de: string }

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
)

export const exhibition = pgTable(
  'exhibition',
  {
    id: serial('id').primaryKey(),
    title: jsonb('title').notNull().$type<LocalizedString>(),
    description: jsonb('description').$type<LocalizedString>(),
    type: text('type').notNull().default('exhibition'),
    location: jsonb('location').notNull().$type<LocalizedString>(),
    dateFrom: timestamp('date_from').notNull(),
    dateTo: timestamp('date_to'),
    status: text('status').notNull().default('draft'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
  },
  (table) => [
    index('exhibition_date_idx').on(table.dateFrom),
    index('exhibition_status_idx').on(table.status)
  ]
)

export const exhibitionPage = pgTable('exhibition_page', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url')
})

export const page = pgTable(
  'page',
  {
    id: serial('id').primaryKey(),
    title: jsonb('title').notNull().$type<LocalizedString>(),
    slug: text('slug').notNull().unique(),
    content: jsonb('content').$type<LocalizedString>(),
    heroImage: text('hero_image'),
    seoTitle: jsonb('seo_title').$type<LocalizedString>(),
    seoDescription: jsonb('seo_description').$type<LocalizedString>(),
    status: text('status').notNull().default('draft'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
  },
  (table) => [
    index('page_slug_idx').on(table.slug),
    index('page_status_idx').on(table.status)
  ]
)

export const role = pgTable('role', {
  id: text('id').primaryKey(), // 'admin' | 'editor'
  label: text('label').notNull()
})

export const rolePermission = pgTable(
  'role_permission',
  {
    id: serial('id').primaryKey(),
    roleId: text('role_id')
      .notNull()
      .references(() => role.id, { onDelete: 'cascade' }),
    resource: text('resource').notNull(),
    action: text('action').notNull(),
    allowed: boolean('allowed').notNull().default(false)
  },
  (table) => [
    index('role_permission_role_idx').on(table.roleId),
    index('role_permission_resource_idx').on(table.resource),
    index('role_permission_role_resource_action_idx').on(
      table.roleId,
      table.resource,
      table.action
    )
  ]
)

export * from './auth.schema'
