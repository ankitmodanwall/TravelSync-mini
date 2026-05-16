# TravelSync UI Design System API Reference

This document outlines the standardized UI components and design tokens built for the TravelSync platform.

## Design Tokens (`src/lib/design-tokens.ts`)

Access tokens using the `tokens` object:

```ts
import { tokens } from "@/lib/design-tokens"

// Colors
tokens.color.primary // hsl(var(--primary))
tokens.color.background // hsl(var(--background))

// Spacing (4px grid)
tokens.spacing[4] // 1rem

// Radius
tokens.radius.lg // var(--radius)
```

## Components

All components are exported from `@/components/ui`.

### Button

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `default`, `secondary`, `outline`, `ghost`, `destructive`, `gradient`, `glass`, `link` | Visual style of the button |
| `size` | `xs`, `sm`, `default`, `lg`, `xl`, `icon`, `icon-sm` | Size of the button |
| `loading` | `boolean` | Displays a spinner and disables the button |
| `asChild` | `boolean` | Uses the child component (from Radix Slot) |

### Card

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `default`, `elevated`, `glass`, `premium`, `ghost` | Visual style of the card |

### Input

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `default`, `filled`, `ghost` | Visual style of the input |
| `size` | `sm`, `default`, `lg` | Size of the input |
| `startIcon` | `ReactNode` | Icon displayed at the start of the input |
| `endIcon` | `ReactNode` | Icon displayed at the end of the input |
| `error` | `boolean` | Displays the input in a destructive state |

### Badge

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `default`, `secondary`, `destructive`, `outline`, `success`, `warning`, `info`, `glass` | Visual style of the badge |
| `size` | `sm`, `default`, `lg` | Size of the badge |
| `dot` | `boolean` | Displays a status dot before the content |

### Avatar

| Prop | Type | Description |
|------|------|-------------|
| `size` | `xs`, `sm`, `default`, `lg`, `xl` | Size of the avatar |
| `shape` | `round`, `square` | Shape of the avatar |
| `status` | `online`, `offline`, `busy`, `away` | Displays a status indicator dot |

### StatCard

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Label for the metric |
| `value` | `string \| number` | The main metric value |
| `subtext` | `string` | Optional supporting text |
| `icon` | `ElementType` | Lucide icon component |
| `trend` | `up`, `down`, `neutral` | Displays a trend indicator |
| `variant` | `default`, `gradient` | Visual style of the card |

### SectionHeader

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Main title text |
| `subtitle` | `string` | Supporting description text |
| `action` | `ReactNode` | Element (usually a button) displayed in the action slot |
| `size` | `sm`, `default`, `lg` | Spacing and font sizing |

### Typography

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `h1`, `h2`, `h3`, `h4`, `p`, `blockquote`, `ul`, `inlineCode`, `lead`, `large`, `small`, `muted` | Visual style variation |
| `as` | `h1` \| `h2` \| `h3` \| `h4` \| `p` \| `blockquote` \| `ul` \| `code` \| `span` \| `div` | HTML element to render |

## Usage Examples

### Standard Typography

```tsx
<Typography variant="h1">Adventure Awaits</Typography>
<Typography variant="p">Start planning your next trip today.</Typography>
<Typography variant="muted">Last updated 2 days ago</Typography>
```

### Page Heading with Action

```tsx
<SectionHeader 
  title="Upcoming Trips" 
  subtitle="Manage your next adventures"
  action={<Button variant="gradient"><Plus className="mr-2 h-4 w-4" /> New Trip</Button>}
/>
```

### Dashboard Metric

```tsx
<StatCard 
  label="Total Spending" 
  value="$1,240" 
  icon={DollarSign} 
  trend="up" 
  subtext="+15% from last month"
/>
```
