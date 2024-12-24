import { useState, useEffect, Component } from "react"
import { Navbar } from "../components/layout/navbar"
import { Button } from "../components/ui/button"
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../components/ui/modal"
import { Search, Plus, Calendar, GroupIcon as TeamIcon, Briefcase, ArrowRight, AlertCircle, CheckCircle2, Users, Clock } from 'lucide-react'

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Something went wrong. Please try refreshing the page.</span>
        </div>
      )
    }
    return this.props.children
  }
}

// Stats Component
function DashboardStats({ totalProjects = 0, activeUsers = 0, avgDuration = 0 }) {
  const stats = [
    {
      label: "Total Projects",
      value: totalProjects,
      icon: Briefcase,
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      label: "Active Users",
      value: activeUsers,
      icon: Users,
      gradient: "from-emerald-600 to-teal-600"
    },
    {
      label: "Avg. Duration",
      value: `${avgDuration} months`,
      icon: Clock,
      gradient: "from-amber-600 to-orange-600"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="relative group"
        >
          <div 
            className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}
          />
          <div 
            className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-sm transition-all duration-200 hover:shadow-lg animate-fade-in-up" 
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <p className="mt-4 text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Logo Component
function Logo({ className = "", size = "md" }) {
  const sizes = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10"
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-lg opacity-50 animate-pulse" />
        <svg 
          className={`relative ${sizes[size]} aspect-square`}
          viewBox="0 0 24 24" 
          fill="none"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            className="fill-blue-600"
          />
          <path
            d="M2 17L12 22L22 17"
            className="stroke-indigo-600 stroke-2"
          />
          <path
            d="M2 12L12 17L22 12"
            className="stroke-blue-600 stroke-2"
          />
        </svg>
      </div>
      <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        ProjectHub
      </span>
    </div>
  )
}

// Array of gradients for skills
const skillGradients = [
  'from-pink-500 to-rose-500',
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-emerald-500 to-green-500',
  'from-amber-500 to-yellow-500',
  'from-orange-500 to-red-500'
]

// Main Dashboard Component
export default function DashboardPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedProject, setSelectedProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [applicationStatus, setApplicationStatus] = useState(null)

  useEffect(() => {
    const fetchUserAndProjects = async () => {
      try {
        const userResponse = await fetch("https://projecthub-38w5.onrender.com/users/admin", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })
        
        if (userResponse.ok) {
          setIsAdmin(true)
        }

        const projectsResponse = await fetch("https://projecthub-38w5.onrender.com/project/list", {
          credentials: "include",
        })
        if (!projectsResponse.ok) throw new Error("Failed to fetch projects")
        const projectsData = await projectsResponse.json()
        setProjects(projectsData.data || [])
      } catch (err) {
        if (!err.message.includes("admin")) {
          setError(err.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAndProjects()
  }, [])

  const handleApply = async (projectName) => {
    try {
      setApplicationStatus('loading')
      const response = await fetch("https://projecthub-38w5.onrender.com/project/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ projectname: projectName }),
      })

      if (!response.ok) throw new Error("Failed to send application")

      setApplicationStatus('success')
      setTimeout(() => {
        setSelectedProject(null)
        setApplicationStatus(null)
      }, 2000)
    } catch (err) {
      setApplicationStatus('error')
      setTimeout(() => {
        setApplicationStatus(null)
      }, 3000)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("https://projecthub-38w5.onrender.com/users/logout", { 
        method: "POST",
        credentials: "include"
      })
      window.location.href = "/login"
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  const filteredProjects = projects.filter(project => 
    project.projectname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.skill.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
      <Navbar onLogout={handleLogout} isAdmin={isAdmin} />

      <main className="max-w-[1400px] mx-auto py-6 px-4 sm:px-6">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex-1">
              <Logo className="mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-fade-in">
                Welcome to ProjectHub
              </h1>
              <p className="text-gray-600 animate-fade-in-up">
                Discover and collaborate on exciting projects
              </p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto animate-fade-in">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              
              <Button
                onClick={() => window.location.href = '/projects/create'}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 animate-fade-in group"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-[-10px] group-hover:translate-x-0" />
              </Button>
            </div>
          </div>

          <ErrorBoundary>
            <DashboardStats
              totalProjects={projects.length}
              activeUsers={projects.reduce((acc, p) => acc + (p.teamsize || 0), 0)}
              avgDuration={Math.round(projects.reduce((acc, p) => acc + (p.duration || 0), 0) / (projects.length || 1))}
            />
          </ErrorBoundary>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200 flex items-center text-red-700 animate-shake">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded-full w-full" />
                      <div className="h-3 bg-gray-200 rounded-full w-5/6" />
                    </div>
                    <div className="flex gap-2">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-6 w-16 bg-gray-200 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No projects found</h3>
                <p className="mt-2 text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'Projects will appear here once created'}
                </p>
              </div>
            ) : (
              filteredProjects.map((project, index) => (
                <div
                  key={project._id}
                  className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg cursor-pointer animate-fade-in-up"
                  onClick={() => setSelectedProject(project)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute top-0 right-0 mt-4 mr-4">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-2.5 py-0.5 text-xs font-medium text-white">
                      {project.modeofwork}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {project.projectname}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {project.skill.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white bg-gradient-to-r ${skillGradients[index % skillGradients.length]}`}
                        >
                          {skill}
                        </span>
                      ))}
                      {project.skill.length > 3 && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                          +{project.skill.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1.5" />
                        <span>{project.duration} months</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <TeamIcon className="h-4 w-4 mr-1.5" />
                        <span>{project.teamsize} members</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-xl transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-xl" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Modal 
        isOpen={!!selectedProject} 
        onClose={() => !applicationStatus && setSelectedProject(null)}
      >
        {selectedProject && (
          <>
            <ModalHeader onClose={() => !applicationStatus && setSelectedProject(null)}>
              {selectedProject.projectname}
            </ModalHeader>
            
            <ModalBody>
              {applicationStatus ? (
                <div className="py-8 text-center">
                  {applicationStatus === 'loading' && (
                    <div className="animate-pulse space-y-4">
                      <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <ArrowRight className="h-6 w-6 text-blue-600 animate-bounce" />
                      </div>
                      <p className="text-gray-600">Sending your application...</p>
                    </div>
                  )}
                  {applicationStatus === 'success' && (
                    <div className="space-y-4">
                      <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-gray-600">Application sent successfully!</p>
                    </div>
                  )}
                  {applicationStatus === 'error' && (
                    <div className="space-y-4">
                      <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center animate-shake">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <p className="text-red-600">Failed to send application. Please try again.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-2 text-gray-900">{selectedProject.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Required Skills</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedProject.skill.map((skill, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white bg-gradient-to-r ${skillGradients[index % skillGradients.length]}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Project Duration</h3>
                      <p className="mt-2 text-gray-900">{selectedProject.duration} months</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Team Size</h3>
                      <p className="mt-2 text-gray-900">{selectedProject.teamsize} members</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Mode of Work</h3>
                      <p className="mt-2 text-gray-900">{selectedProject.modeofwork}</p>
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>
            
            <ModalFooter>
              <Button
                variant="outline"
                onClick={() => !applicationStatus && setSelectedProject(null)}
                disabled={!!applicationStatus}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleApply(selectedProject.projectname)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group"
                disabled={!!applicationStatus}
              >
                Apply for Project
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-[-10px] group-hover:translate-x-0" />
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </div>
  )
}

