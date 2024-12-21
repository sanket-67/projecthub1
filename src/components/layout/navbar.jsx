import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { LayoutDashboard, FolderPlus, Settings, LogOut, ShieldCheck, Hexagon, Search, Plus } from 'lucide-react'

export function Navbar({ isAdmin, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleAdminClick = (e) => {
    e.preventDefault()
    if (isAdmin) {
      navigate('/admin')
    } else {
      alert('You do not have admin access')
    }
  }

  const navItems = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard"
    },
    {
      to: "/projects/create",
      icon: FolderPlus,
      label: "Create Project"
    },
    ...(isAdmin ? [{
      to: "/admin",
      icon: ShieldCheck,
      label: "Admin Panel",
      onClick: handleAdminClick
    }] : [])
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 group"
              >
                <div className="relative flex items-center">
                  <Hexagon className="h-8 w-8 text-primary absolute transform rotate-90 text-blue-100 transition-transform duration-300 group-hover:scale-110" />
                  <Hexagon className="h-8 w-8 text-primary absolute transform -rotate-90 text-blue-200 transition-transform duration-300 group-hover:scale-110" />
                  <Hexagon className="h-8 w-8 text-primary relative text-blue-600 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  ProjectHub
                </span>
              </Link>

              {/* Main Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={item.onClick}
                    className={`
                      flex items-center px-4 py-2 rounded-md text-sm font-medium
                      transition-all duration-200
                      ${location.pathname === item.to
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <item.icon className={`
                      h-4 w-4 mr-2
                      ${location.pathname === item.to
                        ? 'text-blue-600'
                        : 'text-gray-400'
                      }
                    `} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center max-w-xs w-full bg-gray-50 rounded-md border border-gray-200">
                <Search className="h-4 w-4 text-gray-400 ml-3" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="w-full px-3 py-2 bg-transparent text-sm focus:outline-none"
                />
              </div>

              {/* Create Button */}
              <Button
                onClick={() => navigate('/projects/create')}
                className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4" />
                Create
              </Button>

              {/* Settings and Logout */}
              <div className="flex items-center gap-2">
                <Link
                  to="/settings"
                  className={`
                    p-2 rounded-md transition-colors duration-200
                    ${location.pathname === '/settings'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <Settings className="h-5 w-5" />
                </Link>

                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="text-gray-600 hover:text-blue-600"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer to prevent content from going under navbar */}
      <div className="h-16" />
    </>
  )
}
