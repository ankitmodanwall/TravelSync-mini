import { 
  Button, 
  Card, CardHeader, CardTitle, CardDescription, CardContent, 
  Input, 
  Badge, 
  Avatar, AvatarFallback,
  StatCard, 
  SectionHeader,
  Separator,
  Typography
} from "@/components/ui"
import { 
  Search, 
  Mail, 
  Plus, 
  Plane, 
  Calendar, 
  Users, 
  Globe 
} from "lucide-react"

export default function DesignSystemPage() {
  return (
    <div className="container mx-auto py-10 px-4 space-y-16">
      <SectionHeader 
        title="TravelSync UI Design System" 
        subtitle="Standardized components and tokens for consistent UI/UX"
        size="lg"
        action={<Badge variant="success">v1.1.0</Badge>}
      />

      {/* Typography */}
      <section className="space-y-6">
        <SectionHeader title="Typography" subtitle="Standardized font styles and weights" size="sm" />
        <Card>
          <CardContent className="pt-6 space-y-8">
            <div className="space-y-4">
              <Typography variant="h1">Heading 1 (Noto Serif)</Typography>
              <Typography variant="h2">Heading 2 (Noto Serif)</Typography>
              <Typography variant="h3">Heading 3 (Noto Serif)</Typography>
              <Typography variant="h4">Heading 4 (Noto Serif)</Typography>
              <Typography variant="large">Large Text (Plus Jakarta Sans)</Typography>
              <Typography variant="p">
                This is a paragraph of body text using <strong>Plus Jakarta Sans</strong>. It is designed for readability and clarity in all TravelSync interfaces. Standardized typography ensures that information is easy to consume and visually balanced.
              </Typography>
              <Typography variant="lead">
                This is a lead paragraph for highlighting important introductory content.
              </Typography>
              <Typography variant="muted">
                This is muted text for secondary information or metadata.
              </Typography>
              <Typography variant="small">
                This is small text for fine print or compact displays.
              </Typography>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Buttons */}
      <section className="space-y-6">
        <SectionHeader title="Buttons" subtitle="Interactive elements for actions" size="sm" />
        <Card>
          <CardContent className="pt-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="gradient">Gradient</Button>
                <Button variant="glass">Glass</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">States & Icons</h3>
              <div className="flex flex-wrap gap-4">
                <Button loading>Loading</Button>
                <Button variant="gradient" size="lg">
                  <Plane className="mr-2 h-4 w-4" /> Plan Trip
                </Button>
                <Button variant="secondary" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon-sm">
                  <Search className="h-4 w-4" />
                </Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cards */}
      <section className="space-y-6">
        <SectionHeader title="Cards" subtitle="Content containers for various purposes" size="sm" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>The standard card component.</CardDescription>
            </CardHeader>
            <CardContent>Basic content goes here.</CardContent>
          </Card>
          
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>Hover for subtle lift.</CardDescription>
            </CardHeader>
            <CardContent>Great for interactive items.</CardContent>
          </Card>

          <Card variant="premium">
            <CardHeader>
              <CardTitle>Premium Card</CardTitle>
              <CardDescription>Gradient background & glow.</CardDescription>
            </CardHeader>
            <CardContent>Use for featured content.</CardContent>
          </Card>

          <div className="p-4 bg-slate-900 rounded-xl">
             <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-white">Glass Card</CardTitle>
                <CardDescription className="text-white/70">Backdrop blur & frost.</CardDescription>
              </CardHeader>
              <CardContent className="text-white/80">Best on dark backgrounds.</CardContent>
            </Card>
          </div>

          <Card variant="ghost">
            <CardHeader>
              <CardTitle>Ghost Card</CardTitle>
              <CardDescription>No borders or shadows.</CardDescription>
            </CardHeader>
            <CardContent>Subtle grouping element.</CardContent>
          </Card>
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-6">
        <SectionHeader title="Inputs" subtitle="Data entry components" size="sm" />
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Input</label>
                <Input placeholder="Enter destination..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Filled Input</label>
                <Input variant="filled" placeholder="Enter destination..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">With Icons</label>
                <Input startIcon={<Search />} placeholder="Search trips..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">With End Icon</label>
                <Input endIcon={<Mail />} placeholder="Email address" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-destructive">Error State</label>
                <Input error placeholder="Invalid input" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Small Size</label>
                <Input size="sm" placeholder="Small input" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Badges */}
      <section className="space-y-6">
        <SectionHeader title="Badges" subtitle="Status indicators and labels" size="sm" />
        <Card>
          <CardContent className="pt-6 space-y-8">
            <div className="flex flex-wrap gap-4 items-center">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="glass">Glass</Badge>
            </div>
            
            <Separator />
            
            <div className="flex flex-wrap gap-4 items-center">
              <Badge variant="success" dot>Confirmed</Badge>
              <Badge variant="warning" dot>Pending</Badge>
              <Badge variant="destructive" dot>Cancelled</Badge>
              <Badge variant="info" dot>Draft</Badge>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-4 items-center">
              <Badge size="sm">Small</Badge>
              <Badge size="default">Default</Badge>
              <Badge size="lg">Large Badge</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Avatars */}
      <section className="space-y-6">
        <SectionHeader title="Avatars" subtitle="User profile representations" size="sm" />
        <Card>
          <CardContent className="pt-6 space-y-8">
            <div className="flex flex-wrap items-end gap-8">
              <div className="flex flex-col items-center gap-2">
                <Avatar size="xs">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="text-[10px] text-muted-foreground uppercase">XS</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="text-[10px] text-muted-foreground uppercase">SM</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar size="default">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="text-[10px] text-muted-foreground uppercase">Default</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar size="lg">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="text-[10px] text-muted-foreground uppercase">LG</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar size="xl">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="text-[10px] text-muted-foreground uppercase">XL</span>
              </div>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-8">
              <Avatar shape="square" size="lg">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar shape="round" size="lg">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-8">
              <Avatar status="online" size="lg">
                <AvatarFallback>ON</AvatarFallback>
              </Avatar>
              <Avatar status="busy" size="lg">
                <AvatarFallback>BS</AvatarFallback>
              </Avatar>
              <Avatar status="away" size="lg">
                <AvatarFallback>AW</AvatarFallback>
              </Avatar>
              <Avatar status="offline" size="lg">
                <AvatarFallback>OFF</AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Stat Cards */}
      <section className="space-y-6">
        <SectionHeader title="Stat Cards" subtitle="Metric indicators for dashboards" size="sm" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Trips" 
            value="24" 
            icon={Plane} 
            trend="up" 
            subtext="+3 since last month" 
          />
          <StatCard 
            label="Expenses" 
            value="$4,250" 
            icon={Globe} 
            trend="down" 
            subtext="-12% vs last year" 
          />
          <StatCard 
            label="Next Trip" 
            value="12 Days" 
            icon={Calendar} 
            subtext="Bali, Indonesia" 
          />
          <StatCard 
            label="Active Users" 
            value="1.2k" 
            icon={Users} 
            trend="up" 
            variant="gradient"
            subtext="Live now" 
          />
        </div>
      </section>
    </div>
  )
}
