'use client';
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import Header from '@/components/header';
import { PanelLeft } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';



function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { isDesktop } = useSidebar();
  
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('/background-gradient.png')`,
      }}
    >
      <div className="min-h-screen w-full bg-gradient-to-br from-background/90 via-background/70 to-background/90 dark:from-background/95 dark:via-background/90 dark:to-background/95">
        <Sidebar className="border-r border-sidebar-border bg-sidebar/70 backdrop-blur-xl">
           <AppSidebar />
        </Sidebar>
        
        <SidebarInset>
          <Header>
            <SidebarTrigger>
              <PanelLeft />
            </SidebarTrigger>
          </Header>
          <main className="px-4 py-6 md:px-8 md:py-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
