'use client';

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  Sheet,
  SheetContent,
  useSidebar,
} from '@/components/ui/sidebar';

import AppSidebar from '@/components/app-sidebar';
import Header from '@/components/header';
import { PanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ---------------- Mobile Sidebar ---------------- */

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
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AppSidebar />
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}

/* ---------------- Desktop Sidebar ---------------- */

function DesktopSidebar() {
  const { isOpen } = useSidebar();

  return (
    <motion.aside
      data-collapsed={!isOpen}
      className="fixed left-0 top-0 z-20 hidden h-screen w-[280px] border-r border-sidebar-border bg-sidebar/70 backdrop-blur-xl md:block"
      animate={{
        width: isOpen ? 280 : 70,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <AppSidebar />
      </div>
    </motion.aside>
  );
}

/* ---------------- Main Layout ---------------- */

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { isDesktop } = useSidebar();

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('/background-gradient.png')`,
      }}
    >
      {/* Background overlay fade */}
      <motion.div
        className="min-h-screen w-full bg-gradient-to-br from-background/80 via-background/60 to-background/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* SIDEBAR */}
        <AnimatePresence mode="wait">
          {isDesktop ? (
            <motion.div
              key="desktop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DesktopSidebar />

              <Header>
                <SidebarTrigger>
                  <PanelLeft />
                </SidebarTrigger>
              </Header>
            </motion.div>
          ) : (
            <motion.div
              key="mobile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MobileSidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT */}
        <SidebarInset>
          <motion.main
            className="p-6 lg:p-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.main>
        </SidebarInset>
      </motion.div>
    </div>
  );
}


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}