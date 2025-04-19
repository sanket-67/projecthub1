import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectCard = ({ project, onClick, skillGradients }) => {
  return (
    <div
      className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg cursor-pointer h-full"
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 mt-4 mr-4">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${
          project.modeofwork === 'Remote' 
            ? 'bg-gradient-to-r from-green-500 to-teal-500' 
            : project.modeofwork === 'Hybrid'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
        }`}>
          {project.modeofwork}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
        {project.projectname}
      </h3>

      <p className="text-sm text-gray-500 line-clamp-3 mb-4">
        {project.description}
      </p>

      <div className="space-y-3 mt-auto">
        <div className="flex flex-wrap gap-2">
          {project.skill.slice(0, 3).map((skill, index) => (
            <motion.span
              key={index}
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white bg-gradient-to-r ${skillGradients[index % skillGradients.length]}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {skill}
            </motion.span>
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
            <Users className="h-4 w-4 mr-1.5" />
            <span>{project.teamsize} members</span>
          </div>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-xl" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-xl" />
      </div>
    </div>
  );
};

export default ProjectCard; 