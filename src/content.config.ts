import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const colorFamilies = ['light', 'golden', 'reddish', 'dark', 'exotic'] as const;
const woodTypes = ['hardwood', 'softwood'] as const;
const applications = [
  'furniture',
  'flooring',
  'joinery',
  'marine',
  'decking',
  'decorative',
  'doors',
  'stairs',
] as const;

const woods = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/woods' }),
  schema: z.object({
    nameAr: z.string().min(1),
    nameEn: z.string().min(1),
    scientificName: z.string().min(1),
    commercialNamesEn: z.array(z.string().min(1)).default([]),
    commercialNamesAr: z.array(z.string().min(1)).default([]),
    woodType: z.enum(woodTypes).optional(),
    colorFamily: z.enum(colorFamilies),
    hexColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    grades: z.array(z.string().min(1)).min(1).optional(),
    applications: z.array(z.enum(applications)).min(1),
    certifications: z.array(z.string().min(1)).default([]),
    moqBoardFeet: z.number().int().positive().optional(),
    leadTimeDays: z.number().int().positive().optional(),
    inStock: z.boolean(),
    images: z
      .object({
        stack: z.string().optional(),
        grain: z.string().optional(),
        inUse: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { woods };
export type ColorFamily = (typeof colorFamilies)[number];
export type Application = (typeof applications)[number];
export type WoodType = (typeof woodTypes)[number];
