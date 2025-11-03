import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  FolderTree,
  Percent,
  FileText,
  Truck,
  Gift,
  Award,
  X,
  Ruler,
  Palette,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  {
    icon: ShoppingBag,
    label: 'Products',
    path: null,
    children: [
      { icon: ShoppingBag, label: 'Product List', path: '/products' },
      { icon: Palette, label: 'Variations', path: '/variations' }
    ]
  },
  { icon: ShoppingCart, label: 'Orders', path: '/orders' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: FolderTree, label: 'Categories', path: '/categories' },
  { icon: Percent, label: 'Discounts', path: '/discounts' },
  { icon: FileText, label: 'Blogs', path: '/blogs' },
  // { icon: Ruler, label: 'Size Chart', path: '/size-chart' },
  { icon: Truck, label: 'Logistics', path: '/logistics' },
  { icon: Gift, label: 'Gift Cards', path: '/gift-cards' },
  { icon: Award, label: 'Loyalty Program', path: '/loyalty' },
];

export function Sidebar({ isOpen, onClose }) {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-40 transition-transform duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">EA</span>
            </div>
            <span className="font-semibold">E-Admin</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  {/* Main menu item with submenu */}
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={cn(
                      "flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg transition-colors",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      openMenus[item.label]
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 transition-transform",
                        openMenus[item.label] && "rotate-180"
                      )}
                    />
                  </button>
                  {/* Submenu items */}
                  {openMenus[item.label] && (
                    <div className="ml-8 space-y-1 mt-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={() => window.innerWidth < 1024 && onClose()}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm",
                              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              isActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                : "text-sidebar-foreground"
                            )
                          }
                        >
                          <child.icon className="h-4 w-4" />
                          <span>{child.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Regular menu item */
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground"
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}