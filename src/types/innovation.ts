import { z } from 'zod'

export const innovationSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  repository: z.string(),
  status: z.string(),
  priority: z.string().optional(),
  type: z.enum(['problem', 'solution']),
  relatedItems: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional()
})

export const innovationsSchema = z.array(innovationSchema)

export type Innovation = z.infer<typeof innovationSchema>
