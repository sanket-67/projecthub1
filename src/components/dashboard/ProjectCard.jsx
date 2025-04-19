import React from 'react';
import { Calendar, Users, ArrowUpRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const ProjectCard = ({ project, onClick, skillGradients, view = 'grid' }) => {
  // For displaying top skills in both views
  const topSkills = project.skill.slice(0, 3);
  const remainingSkillsCount = Math.max(0, project.skill.length - 3);

  // Random "trending" status for some projects (for demo purposes)
  const isTrending = project._id.charCodeAt(0) % 5 === 0;

  // Common skill badges component
  const SkillBadges = () => (
    <div className="flex flex-wrap gap-2">
      {topSkills.map((skill, index) => (
        <motion.span
          key={index}
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white bg-gradient-to-r ${skillGradients[index % skillGradients.length]}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {skill}
        </motion.span>
      ))}
      {remainingSkillsCount > 0 && (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          +{remainingSkillsCount} more
        </span>
      )}
    </div>
  );

  // Common project metadata component
  const ProjectMetadata = () => (
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
  );

  // Modal label for accessibility
  const modalLabel = `View details for project: ${project.projectname}`;

  if (view === 'list') {
    return (
      <div
        className="group relative rounded-xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col md:flex-row gap-4 hover:border-blue-200"
        onClick={onClick}
        role="button"
        aria-label={modalLabel}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick();
            e.preventDefault();
          }
        }}
      >
        {/* Tag on top */}
        <div className="flex flex-wrap justify-between gap-2 mb-2 md:hidden">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${
            project.modeofwork === 'Remote' 
              ? 'bg-gradient-to-r from-green-500 to-teal-500' 
              : project.modeofwork === 'Hybrid'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          }`}>
            {project.modeofwork}
          </span>
          
          {isTrending && (
            <span className="inline-flex items-center text-amber-600 gap-1 text-xs font-medium">
              <Star className="h-3 w-3 fill-amber-500 stroke-amber-500" />
              Trending
            </span>
          )}
        </div>
      
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {project.projectname}
            </h3>
            <div className="hidden md:flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${
                project.modeofwork === 'Remote' 
                  ? 'bg-gradient-to-r from-green-500 to-teal-500' 
                  : project.modeofwork === 'Hybrid'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}>
                {project.modeofwork}
              </span>
              
              {isTrending && (
                <span className="inline-flex items-center text-amber-600 gap-1 text-xs font-medium">
                  <Star className="h-3 w-3 fill-amber-500 stroke-amber-500" />
                  Trending
                </span>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {project.description}
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <SkillBadges />
            <ProjectMetadata />
          </div>
        </div>
        
        {/* View details arrow indicator */}
        <div className="hidden md:flex items-center self-center">
          <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
            <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg cursor-pointer h-full"
      onClick={onClick}
      role="button"
      aria-label={modalLabel}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
          e.preventDefault();
        }
      }}
    >
      <div className="absolute top-0 right-0 mt-4 mr-4 flex items-center gap-2">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${
          project.modeofwork === 'Remote' 
            ? 'bg-gradient-to-r from-green-500 to-teal-500' 
            : project.modeofwork === 'Hybrid'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
        }`}>
          {project.modeofwork}
        </span>
        
        {isTrending && (
          <span className="inline-flex items-center bg-amber-100 text-amber-800 px-1.5 rounded-full gap-1 text-xs font-medium">
            <Star className="h-3 w-3 fill-amber-500 stroke-amber-500" />
            Trending
          </span>
        )}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1 pr-16">
        {project.projectname}
      </h3>

      <p className="text-sm text-gray-500 line-clamp-3 mb-4">
        {project.description}
      </p>

      <div className="space-y-3 mt-auto">
        <SkillBadges />
        <ProjectMetadata />
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-xl" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-xl" />
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    projectname: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    skill: PropTypes.arrayOf(PropTypes.string).isRequired,
    duration: PropTypes.number.isRequired,
    teamsize: PropTypes.number.isRequired,
    modeofwork: PropTypes.string.isRequired
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  skillGradients: PropTypes.arrayOf(PropTypes.string).isRequired,
  view: PropTypes.oneOf(['grid', 'list'])
};

export default ProjectCard;
