import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "../components/layout/navbar";
import { Button } from "../components/ui/button";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../components/ui/modal";
import { 
  Search, Plus, ArrowRight, AlertCircle, 
  CheckCircle2, Filter, Activity, Loader2, Briefcase
} from "lucide-react";
import { Component } from "react";
import PropTypes from 'prop-types';
import toast from "react-hot-toast";

// Lazy loaded components
const DashboardStats = lazy(() => import('../components/dashboard/DashboardStats'));
const ProjectCard = lazy(() => import('../components/dashboard/ProjectCard'));

// Skeleton loading component
const SkeletonCard = () => (
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
  </div>
);

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Something went wrong. Please try refreshing the page.</span>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

// Logo Component
const Logo = ({ className = "", size = "md" }) => {
  const sizes = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-lg opacity-50 animate-pulse" />
        <svg className={`relative ${sizes[size]} aspect-square`} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" className="fill-blue-600" />
          <path d="M2 17L12 22L22 17" className="stroke-indigo-600 stroke-2" />
          <path d="M2 12L12 17L22 12" className="stroke-blue-600 stroke-2" />
        </svg>
      </div>
      <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        ProjectHub
      </span>
    </div>
  );
};

Logo.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

// Skill gradients
const skillGradients = [
  "from-pink-500 to-rose-500",
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-purple-500",
  "from-emerald-500 to-green-500",
  "from-amber-500 to-yellow-500",
  "from-orange-500 to-red-500",
];

// Custom Hook for fetching data with pagination
const useDashboardData = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchProjects = useCallback(async (pageNum = 1) => {
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Check admin status only on first load
      if (pageNum === 1) {
        const userResponse = await fetch("https://projecthub-38w5.onrender.com/users/admin", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (userResponse.ok) {
          setIsAdmin(true);
        }
      }

      const projectsResponse = await fetch("https://projecthub-38w5.onrender.com/project/list", {
        credentials: "include",
      });
      
      if (!projectsResponse.ok) throw new Error("Failed to fetch projects");
      
      const projectsData = await projectsResponse.json();
      const newProjects = projectsData.data || [];
      
      if (pageNum === 1) {
        setProjects(newProjects);
      } else {
        // Simulate pagination by adding delay and limiting results
        // This is just for demonstration since the actual API doesn't support pagination
        setTimeout(() => {
          setProjects(prev => [...prev, ...newProjects.slice(0, 3)]);
          setHasMore(false); // In real implementation, this would be based on response
        }, 800);
      }
    } catch (error) {
      if (!error.message?.includes("admin")) {
        setError(error.message);
      }
    } finally {
      if (pageNum === 1) {
        setIsLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProjects(nextPage);
    }
  }, [fetchProjects, loadingMore, hasMore, page]);

  useEffect(() => {
    fetchProjects();
    // Using IntersectionObserver for infinite scroll
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    const target = document.querySelector('#load-more-trigger');
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [fetchProjects, loadMore, hasMore, loadingMore, isLoading]);

  return { isAdmin, projects, isLoading, error, loadingMore, hasMore, loadMore };
};

// Main Dashboard Component
const DashboardPage = () => {
  const { isAdmin, projects, isLoading, error, loadingMore, hasMore, loadMore } = useDashboardData();
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [filterMode, setFilterMode] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [activeView, setActiveView] = useState("grid"); // 'grid' or 'list'

  // Track page scroll position
  useEffect(() => {
    // Save scroll position before unmount
    return () => {
      sessionStorage.setItem('dashboardScrollPos', window.scrollY.toString());
    };
  }, []);

  // Restore scroll position on mount
  useEffect(() => {
    const savedScrollPos = sessionStorage.getItem('dashboardScrollPos');
    if (savedScrollPos) {
      window.scrollTo(0, parseInt(savedScrollPos));
    }
  }, []);

  const handleApply = useCallback(async (projectName) => {
    try {
      setApplicationStatus("loading");
      const response = await fetch("https://projecthub-38w5.onrender.com/project/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ projectname: projectName }),
      });

      if (!response.ok) throw new Error("Failed to send application");

      setApplicationStatus("success");
      toast.success("Application sent successfully!");
      setTimeout(() => {
        setSelectedProject(null);
        setApplicationStatus(null);
      }, 2000);
    } catch (error) {
      console.error("Application error:", error);
      setApplicationStatus("error");
      toast.error("Failed to send application. Please try again.");
      setTimeout(() => {
        setApplicationStatus(null);
      }, 3000);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("https://projecthub-38w5.onrender.com/users/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(
      (project) =>
        (filterMode === "all" || project.modeofwork === filterMode) &&
        (project.projectname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.skill.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [projects, searchTerm, filterMode]);

  // Analytics data (mocked)
  const analytics = {
    projectsGrowth: 18, // percentage
    usersGrowth: 12, // percentage
    popularSkills: ["React", "JavaScript", "Node.js"]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16 font-sans">
      <Navbar onLogout={handleLogout} isAdmin={isAdmin} />

      <main className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6">
        {/* Hero Section */}
        <motion.section
          className="relative bg-white rounded-2xl shadow-lg p-8 mb-8 overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <Logo className="mb-4" size="lg" />
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Welcome to ProjectHub
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Discover, collaborate, and innovate on exciting projects.
              </p>
              {isAdmin && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                  Admin Access
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  aria-label="Search projects"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 transition-colors"
                  aria-label="Show filters"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </Button>
                
                <Button
                  onClick={() => (window.location.href = "/projects/create")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 group"
                  aria-label="Create new project"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-[-10px] group-hover:translate-x-0" />
                </Button>
              </div>
            </div>
          </div>
        </motion.section>

        <Suspense fallback={<LoadingSpinner />}>
          <ErrorBoundary>
            <DashboardStats
              totalProjects={projects.length}
              activeUsers={projects.reduce((acc, p) => acc + (p.teamsize || 0), 0)}
              avgDuration={Math.round(
                projects.reduce((acc, p) => acc + (p.duration || 0), 0) / (projects.length || 1)
              )}
              projectsGrowth={analytics.projectsGrowth}
              usersGrowth={analytics.usersGrowth}
            />
          </ErrorBoundary>
        </Suspense>

        {error && (
          <motion.div
            className="mb-8 p-4 bg-red-50 rounded-lg border border-red-200 flex items-center text-red-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Error loading projects</p>
              <p className="text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* View Toggle & Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
            <button
              onClick={() => setActiveView('grid')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                activeView === 'grid' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              aria-label="Grid view"
            >
              Grid View
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                activeView === 'list' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              aria-label="List view"
            >
              List View
            </button>
          </div>

          {/* Popular Skills */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-sm text-gray-500">Popular:</span>
            {analytics.popularSkills.map(skill => (
              <button
                key={skill}
                onClick={() => setSearchTerm(skill)}
                className="px-2 py-1 rounded text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="mb-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter Projects
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant={filterMode === "all" ? "default" : "outline"}
                  onClick={() => setFilterMode("all")}
                  className={filterMode === "all" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : ""}
                  size="sm"
                >
                  All Projects
                </Button>
                <Button
                  variant={filterMode === "Remote" ? "default" : "outline"}
                  onClick={() => setFilterMode("Remote")}
                  className={filterMode === "Remote" ? "bg-gradient-to-r from-green-600 to-teal-600 text-white" : ""}
                  size="sm"
                >
                  Remote
                </Button>
                <Button
                  variant={filterMode === "Onsite" ? "default" : "outline"}
                  onClick={() => setFilterMode("Onsite")}
                  className={filterMode === "Onsite" ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white" : ""}
                  size="sm"
                >
                  Onsite
                </Button>
                <Button
                  variant={filterMode === "Hybrid" ? "default" : "outline"}
                  onClick={() => setFilterMode("Hybrid")}
                  className={filterMode === "Hybrid" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : ""}
                  size="sm"
                >
                  Hybrid
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className={activeView === 'grid' 
            ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" 
            : "flex flex-col gap-4"
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <SkeletonCard />
              </motion.div>
            ))
          ) : filteredProjects.length === 0 ? (
            <motion.div
              className="col-span-full text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No projects found</h3>
              <p className="mt-2 text-gray-500">
                {searchTerm 
                  ? `No results for "${searchTerm}". Try adjusting your search terms.` 
                  : "Projects will appear here once created"}
              </p>
              <Button 
                variant="outline"
                className="mt-6" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterMode('all');
                }}
              >
                Clear filters
              </Button>
            </motion.div>
          ) : (
            <>
              {filteredProjects.map((project, index) => (
                <Suspense 
                  key={project._id}
                  fallback={<SkeletonCard />}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: activeView === 'grid' ? 1.02 : 1.005 }}
                  >
                    <ProjectCard 
                      project={project} 
                      onClick={() => setSelectedProject(project)} 
                      skillGradients={skillGradients}
                      view={activeView}
                    />
                  </motion.div>
                </Suspense>
              ))}

              {/* Load more trigger */}
              <div id="load-more-trigger" className="col-span-full h-20 flex items-center justify-center">
                {loadingMore && <LoadingSpinner />}
                {!loadingMore && hasMore && (
                  <Button 
                    variant="outline" 
                    onClick={loadMore} 
                    className="mx-auto"
                  >
                    Load more projects
                  </Button>
                )}
              </div>
            </>
          )}
        </motion.div>
      </main>

      <AnimatePresence>
        {selectedProject && (
          <Modal isOpen={!!selectedProject} onClose={() => !applicationStatus && setSelectedProject(null)}>
            <ModalHeader onClose={() => !applicationStatus && setSelectedProject(null)}>
              {selectedProject.projectname}
            </ModalHeader>
            <ModalBody>
              {applicationStatus ? (
                <motion.div
                  className="py-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {applicationStatus === "loading" && (
                    <div className="animate-pulse space-y-4">
                      <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <ArrowRight className="h-6 w-6 text-blue-600 animate-bounce" />
                      </div>
                      <p className="text-gray-600">Sending your application...</p>
                    </div>
                  )}
                  {applicationStatus === "success" && (
                    <div className="space-y-4">
                      <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-gray-600">Application sent successfully!</p>
                    </div>
                  )}
                  {applicationStatus === "error" && (
                    <div className="space-y-4">
                      <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center animate-shake">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <p className="text-red-600">Failed to send application. Please try again.</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-2 text-gray-900">{selectedProject.description}</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
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
                  </motion.div>
                  
                  <motion.div 
                    className="grid grid-cols-2 gap-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
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
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-blue-50 p-4 rounded-lg flex items-start"
                  >
                    <Activity className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800">Activity Level</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        This is an active project seeking contributors with your skills. 
                        Apply now to join the team!
                      </p>
                    </div>
                  </motion.div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                onClick={() => !applicationStatus && setSelectedProject(null)}
                disabled={!!applicationStatus}
                aria-label="Cancel"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleApply(selectedProject.projectname)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group"
                disabled={!!applicationStatus}
                aria-label="Apply for project"
              >
                Apply for Project
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-[-10px] group-hover:translate-x-0" />
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;

