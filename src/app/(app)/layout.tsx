'use client';
import {
  SidebarProvider,
  SidebarTrigger,
  Sheet,
  SheetContent,
} from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import Header from '@/components/header';
import { PanelLeft } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

function MobileSidebar() {
  return (
    <Sheet>
      <Header>
        <SidebarTrigger>
          <PanelLeft />
        </SidebarTrigger>
      </Header>
      <SheetContent
        side="left"
        className="w-[280px] p-0 border-r border-sidebar-border bg-sidebar/70 backdrop-blur-xl md:hidden"
      >
        <AppSidebar />
      </SheetContent>
    </Sheet>
  );
}

function DesktopSidebar() {
  const { isOpen } = useSidebar();
  return (
    <aside
      data-collapsed={!isOpen}
      className="row-span-2 hidden h-screen w-[280px] border-r border-sidebar-border bg-sidebar/70 backdrop-blur-xl transition-all duration-300 ease-in-out data-[collapsed=true]:w-[70px] md:sticky md:top-0 md:block"
    >
      <div className="flex h-full flex-col overflow-hidden">
        <AppSidebar />
      </div>
    </aside>
  );
}

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { isDesktop, isOpen } = useSidebar();
  const gridColumns = isDesktop ? (isOpen ? '280px 1fr' : '70px 1fr') : '1fr';
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('/background-gradient.png')`,
      }}
    >
      <div className="min-h-screen w-full bg-gradient-to-br from-background/90 via-background/70 to-background/90 dark:from-background/95 dark:via-background/90 dark:to-background/95">
        <div
          className="min-h-screen w-full md:grid md:grid-rows-[auto,1fr]"
          style={{ gridTemplateColumns: gridColumns }}
        >
          {isDesktop ? (
            <>
              <DesktopSidebar />
              <div className="md:col-start-2 md:row-start-1">
                <Header>
                  <SidebarTrigger>
                    <PanelLeft />
                  </SidebarTrigger>
                </Header>
              </div>
            </>
          ) : (
            <MobileSidebar />
          )}

          <main className="px-4 py-6 md:col-start-2 md:row-start-2 md:px-8 md:py-8">
            {children}
          </main>
        </div>
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
