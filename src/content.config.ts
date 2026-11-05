import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    title: z.string().min(1), description: z.string().min(1),
    pubDate: z.coerce.date(), updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false), tags: z.array(z.string()).default([]),
    heroImage: image().optional(), heroAlt: z.string().optional(),
  }).refine(data => !data.heroImage || Boolean(data.heroAlt?.trim()), {
    message: '使用封面图片时请填写 heroAlt', path: ['heroAlt'],
  }),
});
export const collections = { blog };
