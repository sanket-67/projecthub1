import { Users, Briefcase, Clock } from 'lucide-react'

export function DashboardStats({ totalProjects, activeUsers, avgDuration }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {[
        {
          label: "Total Projects",
          value: totalProjects,
          icon: Briefcase,
          color: "from-blue-600 to-indigo-600"
        },
        {
          label: "Active Users",
          value: activeUsers,
          icon: Users,
          color: "from-emerald-600 to-teal-600"
        },
        {
          label: "Avg. Duration",
          value: `${avgDuration} months`,
          icon: Clock,
          color: "from-amber-600 to-orange-600"
        }
      ].map((stat, index) => (
        <div
          key={stat.label}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
            style={{
              backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
              '--tw-gradient-from': stat.color.split(' ')[0].split('-')[1],
              '--tw-gradient-to': stat.color.split(' ')[2].split('-')[1],
            }}
          />
          <div className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-sm transition-all duration-200 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
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

