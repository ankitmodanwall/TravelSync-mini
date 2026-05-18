'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDesktop: boolean;
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(
  undefined
);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isOpen, setIsOpen] = React.useState(true);

  React.useEffect(() => {
    setIsOpen(isDesktop);
  }, [isDesktop]);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, isDesktop }}>
      <TooltipProvider delayDuration={0}>
        {isDesktop ? (
          children
        ) : (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            {children}
          </Sheet>
        )}
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

export function Sidebar({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen, isDesktop } = useSidebar();

  if (isDesktop) {
    return (
      <aside
        data-collapsed={!isOpen}
        className={cn(
          'fixed left-0 top-0 z-20 hidden h-screen w-[280px] border-r border-sidebar-border bg-sidebar/70 backdrop-blur-xl transition-all duration-300 ease-in-out md:block',
          'data-[collapsed=true]:w-[70px]',
          className
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">{children}</div>
      </aside>
    );
  }

  return (
    <SheetContent
      side="left"
      className="w-[280px] p-0 border-r border-sidebar-border bg-sidebar/70 backdrop-blur-xl md:hidden"
    >
      <SheetTitle className="sr-only">Sidebar Menu</SheetTitle>
      {children}
    </SheetContent>
  );
}

export function SidebarInset({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen, isDesktop } = useSidebar();
  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out',
        isDesktop ? (isOpen ? 'md:pl-[280px]' : 'md:pl-[70px]') : 'pl-0',
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarTrigger({
  className,
  children,
  ...props
}: ButtonProps & { children: React.ReactNode }) {
  const { isOpen, setIsOpen, isDesktop } = useSidebar();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  
  const TriggerButton = (
      <Button
        variant="ghost"
        size="icon"
        className={cn('h-8 w-8 text-foreground', className)}
        onClick={handleClick}
        {...props}
      >
        {children}
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
  )

  if (isDesktop) {
    return TriggerButton;
  }
  
  return (
    <SheetTrigger asChild>
       {TriggerButton}
    </SheetTrigger>
  );
}

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isOpen } = useSidebar();
  return (
    <div
      ref={ref}
      className={cn(
        'flex h-16 items-center border-b border-sidebar-border px-4 transition-all duration-300 ease-in-out',
        !isOpen && 'justify-center px-0',
        className
      )}
      {...props}
    />
  );
});
SidebarHeader.displayName = 'SidebarHeader';

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
));
SidebarContent.displayName = 'SidebarContent';

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isOpen } = useSidebar();
  return (
    <div
      ref={ref}
      className={cn(
        'mt-auto border-t border-sidebar-border p-4 transition-all',
        !isOpen && 'p-2 justify-center',
        className
      )}
      {...props}
    />
  );
});
SidebarFooter.displayName = 'SidebarFooter';

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  const { isOpen } = useSidebar();
  return (
    <ul
      ref={ref}
      className={cn('flex flex-col gap-1 p-4', !isOpen && 'px-2', className)}
      {...props}
    />
  );
});
SidebarMenu.displayName = 'SidebarMenu';

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('relative', className)} {...props} />
));
SidebarMenuItem.displayName = 'SidebarMenuItem';

const sidebarMenuButtonVariants = cva(
  'group flex w-full items-center gap-3 rounded-md p-2 text-left text-sm font-medium text-sidebar-foreground/80 outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold',
  {
    variants: {
      size: {
        default: 'h-10 text-sm',
        sm: 'h-8 text-xs',
        lg: 'h-12 text-base',
        icon: 'h-9 w-9 items-center justify-center',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

interface SidebarMenuButtonProps
  extends Omit<ButtonProps, 'size'>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ReactNode;
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = 'ghost',
      size = 'default',
      tooltip,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isOpen } = useSidebar();
    const Comp = asChild ? Slot : 'button';

    const buttonContent = (
      <>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child) && index === 0) {
            return React.cloneElement(child, {
              className: cn('h-5 w-5 shrink-0'),
            } as React.HTMLAttributes<HTMLElement>);
          }
          if (typeof child === 'string' || React.isValidElement(child)) {
             if (size === 'icon') {
                 return null;
             }
            return (
              <span
                className={cn(
                  'flex-1 truncate transition-all',
                  !isOpen && 'sr-only opacity-0'
                )}
              >
                {child}
              </span>
            );
          }
          return child;
        })}
      </>
    );

    const button = (
      <Comp
        ref={ref}
        data-active={isActive}
        className={cn(
          sidebarMenuButtonVariants({ size }),
          !isOpen && 'justify-center',
          className
        )}
        {...props}
      >
        {size === 'icon' ? children : buttonContent}
      </Comp>
    );

    if (!isOpen && tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent
            side="right"
            align="center"
            className="bg-accent text-accent-foreground"
          >
            {tooltip}
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  }
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

export const SidebarSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn('my-2 border-t border-sidebar-border', className)}
    {...props}
  />
));
SidebarSeparator.displayName = 'SidebarSeparator';
export { Sheet, SheetTrigger, SheetContent, SheetTitle } from './sheet';
