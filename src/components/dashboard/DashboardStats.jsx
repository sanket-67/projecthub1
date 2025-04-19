import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import PropTypes from 'prop-types';

const DashboardStats = ({ 
  totalProjects = 0, 
  activeUsers = 0, 
  avgDuration = 0,
  projectsGrowth = 0,
  usersGrowth = 0
}) => {
  const stats = [
    {
      label: "Total Projects",
      value: totalProjects,
      icon: Briefcase,
      gradient: "from-blue-600 to-indigo-600",
      growth: projectsGrowth,
      growthLabel: `${projectsGrowth}% from last month`
    },
    {
      label: "Active Users",
      value: activeUsers,
      icon: Users,
      gradient: "from-emerald-600 to-teal-600",
      growth: usersGrowth,
      growthLabel: `${usersGrowth}% from last month`
    },
    {
      label: "Avg. Duration",
      value: `${avgDuration} months`,
      icon: Clock,
      gradient: "from-amber-600 to-orange-600",
      growth: null
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
          whileHover={{ 
            y: -5,
            transition: { duration: 0.2 }
          }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-xl`}
          />
          <div className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-sm transition-all duration-200 hover:shadow-lg">
            <div className="flex justify-between items-start">
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              
              {stat.growth !== null && (
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.growth > 0 
                    ? 'text-emerald-700 bg-emerald-50' 
                    : stat.growth < 0 
                      ? 'text-rose-700 bg-rose-50' 
                      : 'text-gray-600 bg-gray-50'
                } rounded-full px-2 py-0.5`}>
                  {stat.growth > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : stat.growth < 0 ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : null}
                  <span>{Math.abs(stat.growth)}%</span>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <span className="block text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</span>
              <span className="text-sm font-medium text-gray-500 mt-1">{stat.label}</span>
              
              {stat.growth !== null && (
                <span className="block text-xs text-gray-500 mt-1.5" aria-label={stat.growthLabel}>
                  {stat.growth > 0 
                    ? `+${stat.growth}% from last month` 
                    : stat.growth < 0 
                      ? `${stat.growth}% from last month`
                      : 'No change from last month'}
                </span>
              )}
            </div>
            
            {/* Progress indicator on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl">
              <motion.div
                className={`h-full bg-gradient-to-r ${stat.gradient}`}
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

DashboardStats.propTypes = {
  totalProjects: PropTypes.number,
  activeUsers: PropTypes.number,
  avgDuration: PropTypes.number,
  projectsGrowth: PropTypes.number,
  usersGrowth: PropTypes.number
};

export default DashboardStats;