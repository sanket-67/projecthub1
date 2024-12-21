'use client'

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { TagInput } from "../components/ui/tag-input"
import { Navbar } from "../components/layout/navbar"
import { api } from "../utils/api"
import { Briefcase, Users, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function CreateProjectPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    projectname: "",
    description: "",
    skill: [],
    duration: "",
    teamsize: "",
    modeofwork: "remote"
  })
  const [errors, setErrors] = useState({})
  const [submitStatus, setSubmitStatus] = useState(null)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.projectname?.trim()) {
      newErrors.projectname = "Project name is required"
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = "Description is required"
    }
    
    if (!formData.skill?.length) {
      newErrors.skill = "At least one skill is required"
    }
    
    if (!formData.duration || formData.duration < 1) {
      newErrors.duration = "Duration must be at least 1 month"
    }
    
    if (!formData.teamsize || formData.teamsize < 1) {
      newErrors.teamsize = "Team size must be at least 1 member"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setSubmitStatus('error')
      const firstError = document.querySelector('.text-red-500')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    
    setIsLoading(true)
    setErrors({})

    try {
      await api.createProject(formData)
      setSubmitStatus('success')
      setTimeout(() => {
        navigate("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Project creation error:", error)
      setErrors({ submit: error.message })
      setSubmitStatus('error')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
            <p className="mt-2 text-gray-600">Fill in the project details below to get started.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-sm text-red-700">{errors.submit}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Input
                  label="Project Name"
                  value={formData.projectname}
                  onChange={e => setFormData({ ...formData, projectname: e.target.value })}
                  error={errors.projectname}
                  required
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                    placeholder="Describe your project..."
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                <TagInput
                  label="Required Skills"
                  value={formData.skill}
                  onChange={skill => setFormData({ ...formData, skill })}
                  error={errors.skill}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Team Size"
                    type="number"
                    min="1"
                    value={formData.teamsize}
                    onChange={e => setFormData({ ...formData, teamsize: e.target.value })}
                    error={errors.teamsize}
                    required
                  />
                  
                  <Input
                    label="Duration (months)"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    error={errors.duration}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Mode of Work</label>
                  <select
                    value={formData.modeofwork}
                    onChange={e => setFormData({ ...formData, modeofwork: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="remote">Remote</option>
                    <option value="onsite">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Create Project
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Success/Error Toast */}
      {submitStatus && (
        <div className={`
          fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-2
          animate-slide-in-up
          ${submitStatus === 'success'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
          }
        `}>
          {submitStatus === 'success' ? (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Project created successfully!
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5" />
              Failed to create project. Please check the form and try again.
            </>
          )}
        </div>
      )}
    </div>
  )
}

