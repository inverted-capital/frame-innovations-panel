# innovations-panel

This widget demonstrates how to display innovations stored in `innovations.json` inside an Artifact frame. If the file is missing a default set is written automatically.

## Development

```bash
npm run dev
```

## Building

```bash
npm run build
```

Load `dist/index.html` in an `ArtifactFrameHolder` to embed the widget inside another application.

### Data shape

The innovation data is defined in `src/types/innovation.ts`:

```ts
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
```
