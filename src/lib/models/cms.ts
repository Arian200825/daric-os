import type { Industry } from "./enums";

/**
 * CMS FOUNDATION (architecture only — no editors yet).
 *
 * This registry is the scalable content model that future CMS editors will be
 * generated from. Each industry declares its content collections; each
 * collection declares typed fields. Adding a new industry = add an entry here;
 * the OS surfaces it automatically, and editors can later be rendered from the
 * field definitions without bespoke code per industry.
 */

export type CmsFieldType =
  | "text"
  | "richtext"
  | "image"
  | "number"
  | "price"
  | "boolean"
  | "list";

export interface CmsField {
  key: string;
  label: string;
  type: CmsFieldType;
  /** Field can hold per-locale values (i18n). */
  localized?: boolean;
}

export interface CmsCollection {
  key: string;
  label: string;
  description: string;
  /** Single record (e.g. site settings) vs. a repeatable list. */
  singleton?: boolean;
  fields: CmsField[];
}

export interface IndustryCms {
  industry: Industry;
  label: string;
  description: string;
  collections: CmsCollection[];
}

const settings: CmsCollection = {
  key: "settings",
  label: "Site Settings",
  description: "Brand, theme colors, contact details, hours, and section order.",
  singleton: true,
  fields: [
    { key: "brandName", label: "Brand name", type: "text" },
    { key: "tagline", label: "Tagline", type: "text", localized: true },
    { key: "themeColors", label: "Theme colors", type: "list" },
    { key: "logo", label: "Logo", type: "image" },
  ],
};

export const CMS_REGISTRY: IndustryCms[] = [
  {
    industry: "restaurant",
    label: "Restaurant",
    description: "Content model for the luxury restaurant template.",
    collections: [
      settings,
      {
        key: "menu",
        label: "Menu",
        description: "Categories and dishes with prices and dietary tags.",
        fields: [
          { key: "category", label: "Category", type: "text", localized: true },
          { key: "name", label: "Dish name", type: "text", localized: true },
          { key: "description", label: "Description", type: "text", localized: true },
          { key: "price", label: "Price", type: "price" },
          { key: "tags", label: "Dietary tags", type: "list" },
        ],
      },
      { key: "signatureDishes", label: "Signature Dishes", description: "Featured hero dishes.", fields: [
        { key: "name", label: "Name", type: "text", localized: true },
        { key: "image", label: "Image", type: "image" },
        { key: "price", label: "Price", type: "price" },
      ] },
      { key: "gallery", label: "Gallery", description: "Interior and plating photography.", fields: [
        { key: "image", label: "Image", type: "image" },
        { key: "alt", label: "Alt text", type: "text", localized: true },
      ] },
      { key: "events", label: "Events", description: "Wine dinners and tasting evenings.", fields: [
        { key: "title", label: "Title", type: "text", localized: true },
        { key: "date", label: "Date", type: "text", localized: true },
      ] },
    ],
  },
  {
    industry: "hotel",
    label: "Hotel & Resort",
    description: "Content model for the luxury hotel template.",
    collections: [
      settings,
      { key: "rooms", label: "Rooms & Suites", description: "Room types with rates and amenities.", fields: [
        { key: "name", label: "Name", type: "text", localized: true },
        { key: "pricePerNight", label: "Price / night", type: "price" },
        { key: "capacity", label: "Capacity", type: "number" },
        { key: "amenities", label: "Amenities", type: "list", localized: true },
        { key: "image", label: "Image", type: "image" },
      ] },
      { key: "dining", label: "Dining", description: "On-site restaurants and bars.", fields: [
        { key: "name", label: "Name", type: "text", localized: true },
        { key: "cuisine", label: "Cuisine", type: "text", localized: true },
      ] },
      { key: "spa", label: "Spa & Wellness", description: "Treatments menu.", fields: [
        { key: "treatment", label: "Treatment", type: "text", localized: true },
        { key: "price", label: "Price", type: "price" },
      ] },
      { key: "experiences", label: "Experiences", description: "Curated activities.", fields: [
        { key: "title", label: "Title", type: "text", localized: true },
        { key: "image", label: "Image", type: "image" },
      ] },
    ],
  },
  {
    industry: "medical",
    label: "Dental / Medical",
    description: "Content model for the dental & medical template.",
    collections: [
      settings,
      { key: "doctors", label: "Doctors", description: "Practitioner profiles.", fields: [
        { key: "name", label: "Name", type: "text" },
        { key: "role", label: "Role", type: "text", localized: true },
        { key: "credentials", label: "Credentials", type: "text" },
        { key: "bio", label: "Bio", type: "richtext", localized: true },
        { key: "image", label: "Photo", type: "image" },
      ] },
      { key: "treatments", label: "Treatments", description: "Services offered.", fields: [
        { key: "name", label: "Name", type: "text", localized: true },
        { key: "description", label: "Description", type: "text", localized: true },
        { key: "icon", label: "Icon", type: "text" },
      ] },
      { key: "beforeAfter", label: "Before & After", description: "Result galleries.", fields: [
        { key: "label", label: "Label", type: "text", localized: true },
        { key: "before", label: "Before image", type: "image" },
        { key: "after", label: "After image", type: "image" },
      ] },
      { key: "insurance", label: "Insurance", description: "Accepted providers.", fields: [
        { key: "provider", label: "Provider", type: "text" },
      ] },
    ],
  },
];
