import { z } from "zod";

export const SearchSchema = z.object({
  q: z.string().min(1, "You must enter a search term."),
});

export const NameSchema = z.string().min(1).max(100);
export const DescriptionSchema = z.string().max(1000).or(z.null());
export const LatSchema = z.coerce.number().min(-180).max(180);
export const LongSchema = z.coerce.number().min(-180).max(180);
