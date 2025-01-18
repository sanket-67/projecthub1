import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { LoadingDots } from "../components/ui/loading-dots"
import { Users, Lock, ArrowRight, Github, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false
  })
  const [errors, setErrors] = useState({})
  const [loginStatus, setLoginStatus] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Check if user is already logged in
    const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
    if (isAuthenticated) {
      navigate("/dashboard");
    }

    // Check if user was redirected here due to logout or session expiry
    const params = new URLSearchParams(location.search)
    const logoutMessage = params.get('logout')
    const sessionExpired = params.get('session')
    
    if (logoutMessage === 'success') {
      setMessage("You have been successfully logged out")
    } else if (sessionExpired === 'expired') {
      setMessage("Your session has expired. Please log in again")
    }
  }, [navigate, location]);

  useEffect(() => {
    if (loginStatus) {
      const timer = setTimeout(() => {
        setLoginStatus(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [loginStatus])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.identifier) {
      newErrors.identifier = "Username or email is required"
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    if (!validateForm()) return
  
    setIsLoading(true)
    setLoginStatus(null)
    setMessage("")
  
    try {
      const response = await fetch("https://projecthub-38w5.onrender.com/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password
        }),
        credentials: "include",
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }

      // Set authentication state in localStorage
      localStorage.setItem("isLoggedIn", "true")
  
      setLoginStatus('success')
      setTimeout(() => {
        navigate("/dashboard")
      }, 1000)
    } catch (error) {
      console.error("Login error:", error.message)
      setErrors({ general: error.message })
      setLoginStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center transform transition-transform duration-700 hover:scale-110 hover:rotate-12">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 animate-fade-in">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600 animate-fade-in-up">
              Sign in to your account to continue
            </p>
          </div>

          {message && (
            <div className="bg-blue-50 text-blue-700 border border-blue-200 rounded-lg p-4 animate-slide-in-down">
              {message}
            </div>
          )}

          {loginStatus && (
            <div className={`transform transition-all duration-500 ease-in-out
              ${loginStatus === 'success' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-red-50 text-red-700 border-red-200'
              } 
              rounded-lg p-4 flex items-center border animate-slide-in-down`}>
              {loginStatus === 'success' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-3 animate-bounce" />
                  <span>Login successful! Redirecting...</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 mr-3 animate-shake" />
                  <span>{errors.general}</span>
                </>
              )}
            </div>
          )}
          
          <form className="mt-8 space-y-6 transform transition-all duration-500" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Username or Email"
                type="text"
                value={formData.identifier}
                onChange={e => setFormData({ ...formData, identifier: e.target.value })}
                error={errors.identifier}
                required
                className="transform transition-all duration-300 hover:scale-[1.01] focus-within:scale-[1.01]"
              />
              
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                required
                className="transform transition-all duration-300 hover:scale-[1.01] focus-within:scale-[1.01]"
              />

              <div className="flex items-center justify-between animate-fade-in">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={e => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 transition-colors"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    Forgot your password?
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className={`w-full group transform transition-all duration-300 
                  ${isLoading ? 'animate-pulse' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingDots />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <div className="relative animate-fade-in">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Github className="h-5 w-5 mr-2" />
                Continue with GitHub
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 animate-fade-in">
            Not a member?{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors hover:underline"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:flex md:flex-1 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8">
        <div className="w-full max-w-md mx-auto flex flex-col justify-center space-y-8">
          <div className="animate-fade-in-up [animation-delay:200ms]">
            <h2 className="text-3xl font-bold mb-4">Join ProjectHub</h2>
            <p className="text-blue-100 text-lg">
              Connect with developers, collaborate on projects, and build your portfolio.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4 animate-fade-in-up [animation-delay:400ms]">
              <div className="mt-1 bg-white/10 rounded-lg p-2 transform transition-transform hover:scale-110">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Active Community</h3>
                <p className="text-blue-100">Join thousands of developers working on exciting projects</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 animate-fade-in-up [animation-delay:600ms]">
              <div className="mt-1 bg-white/10 rounded-lg p-2 transform transition-transform hover:scale-110">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Secure Platform</h3>
                <p className="text-blue-100">Your data is protected with enterprise-grade security</p>
              </div>
            </div>

            <div className="border-t border-white/20 pt-6 mt-6 animate-fade-in-up [animation-delay:800ms]">
              <blockquote className="text-lg font-medium">
                "ProjectHub has helped me find amazing collaborators for my open-source projects"
              </blockquote>
              <p className="mt-2 text-blue-100">- Sarah Chen, Software Engineer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

