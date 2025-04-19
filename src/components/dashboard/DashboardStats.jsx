import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Clock } from 'lucide-react';

const DashboardStats = ({ totalProjects, activeUsers, avgDuration }) => {
  const stats = [
    {
      label: "Total Projects",
      value: totalProjects,
      icon: Briefcase,
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      label: "Active Users",
      value: activeUsers,
      icon: Users,
      gradient: "from-emerald-600 to-teal-600",
    },
    {
      label: "Avg. Duration",
      value: `${avgDuration} months`,
      icon: Clock,
      gradient: "from-amber-600 to-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="relative group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-xl`}
          />
          <div className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-sm transition-all duration-200 hover:shadow-lg">
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="mt-4">
              <span className="block text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</span>
              <span className="text-sm font-medium text-gray-500 mt-1">{stat.label}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;