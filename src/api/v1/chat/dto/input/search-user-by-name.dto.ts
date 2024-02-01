import { z } from 'zod';

export const SearchUserByNameSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  name: z.string().optional(),
});
export type SearchUserByNameDTO = z.infer<typeof SearchUserByNameSchema>;
