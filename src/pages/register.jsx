import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { TagInput } from "../components/ui/tag-input"
import { LoadingDots } from "../components/ui/loading-dots"
import { Users, Upload, CheckCircle2, AlertCircle } from 'lucide-react'
import { api } from "../utils/api"

// Array of gradients for skills
const skillGradients = [
  'from-pink-500 to-rose-500',
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-emerald-500 to-green-500',
  'from-amber-500 to-yellow-500',
  'from-orange-500 to-red-500'
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [registerStatus, setRegisterStatus] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullname: "",
    skills: [],
    useridcard: null,
  })
  const [errors, setErrors] = useState({})

  // Reset register status after 5 seconds
  useEffect(() => {
    if (registerStatus) {
      const timer = setTimeout(() => {
        setRegisterStatus(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [registerStatus])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username) {
      newErrors.username = "Username is required"
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    if (!formData.fullname) {
      newErrors.fullname = "Full name is required"
    }
    
    if (formData.skills.length === 0) {
      newErrors.skills = "At least one skill is required"
    }

    if (!formData.useridcard) {
      newErrors.useridcard = "ID card is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setRegisterStatus(null)

    try {
      const submitData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'skills') {
          submitData.append(key, JSON.stringify(value))
        } else if (key === 'useridcard') {
          submitData.append(key, value)
        } else {
          submitData.append(key, value)
        }
      })

      const response = await api.register(submitData)
      
      if (response.statusCode === 200) {
        setRegisterStatus('success')
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        throw new Error(response.message || "Registration failed")
      }
    } catch (error) {
      setErrors({ submit: error.message })
      setRegisterStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        useridcard: file
      }))
      
      // Create image preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
          <div className="aspect-[1200/1000] w-[82.375rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20" />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8 transform transition-all duration-500 space-y-6">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center transform transition-transform duration-700 hover:scale-110 hover:rotate-12">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 animate-fade-in">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 animate-fade-in-up">
              Join ProjectHub and start collaborating
            </p>
          </div>

          {registerStatus && (
            <div
              className={`transform transition-all duration-500 ease-in-out
                ${registerStatus === 'success' 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
                } 
                rounded-lg p-4 flex items-center border animate-slide-in-down`}
            >
              {registerStatus === 'success' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-3 animate-bounce" />
                  <span>Registration successful! Redirecting to login...</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 mr-3 animate-shake" />
                  <span>{errors.submit}</span>
                </>
              )}
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Username"
                type="text"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                error={errors.username}
                required
                className="transform transition-all duration-300 hover:scale-[1.01] focus-within:scale-[1.01]"
              />
              
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
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
              
              <Input
                label="Full Name"
                type="text"
                value={formData.fullname}
                onChange={e => setFormData({ ...formData, fullname: e.target.value })}
                error={errors.fullname}
                required
                className="transform transition-all duration-300 hover:scale-[1.01] focus-within:scale-[1.01]"
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={skill}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm text-white bg-gradient-to-r ${skillGradients[index % skillGradients.length]} transform transition-all duration-300 hover:scale-105 hover:shadow-md`}
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            skills: prev.skills.filter(s => s !== skill)
                          }))
                        }}
                        className="ml-1 rounded-full p-0.5 hover:bg-white/20"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type a skill and press Enter"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const value = e.target.value.trim()
                      if (value && !formData.skills.includes(value)) {
                        setFormData(prev => ({
                          ...prev,
                          skills: [...prev.skills, value]
                        }))
                        e.target.value = ''
                      }
                    }
                  }}
                />
                {errors.skills && (
                  <p className="text-sm text-red-500 animate-shake">{errors.skills}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  ID Card
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="id-card-upload"
                  />
                  <label
                    htmlFor="id-card-upload"
                    className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-500 focus:outline-none group-hover:bg-gray-50"
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview}
                          alt="ID Card preview"
                          className="w-full h-full object-contain rounded-md"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 rounded-md">
                          <p className="text-white text-sm">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <p className="mb-2 text-sm text-gray-500 group-hover:text-blue-500 transition-colors">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </label>
                  {errors.useridcard && (
                    <p className="text-sm text-red-500 mt-1 animate-shake">{errors.useridcard}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className={`w-full group transform transition-all duration-300 
                  ${isLoading ? 'animate-pulse' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingDots />
                ) : (
                  'Create Account'
                )}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 animate-fade-in">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

