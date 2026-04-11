import React from 'react';
import useStore from '../store/useStore';
import { parseProject, matchResources } from '../api/client';
import ProjectInput from '../components/dashboard/ProjectInput';
import BOMPanel from '../components/dashboard/BOMPanel';
import SkillsPanel from '../components/dashboard/SkillsPanel';
import HardwareMatches from '../components/dashboard/HardwareMatches';
import MentorMatches from '../components/dashboard/MentorMatches';
import { SkeletonCard } from '../components/ui/LoadingSpinner';

const UserDashboard: React.FC = () => {
  const {
    parseResult,
    isParsingProject,
    matchedHardware,
    matchedMentors,
    isMatchingResources,
    setParseResult,
    setIsParsingProject,
    setMatchedHardware,
    setMatchedMentors,
    setIsMatchingResources,
  } = useStore();

  const handleParseProject = async (description: string) => {
    setIsParsingProject(true);
    setParseResult(null);
    setMatchedHardware([]);
    setMatchedMentors([]);

    try {
      const { data } = await parseProject(description);
      const result = data.data;
      setParseResult(result);
      setIsParsingProject(false);

      // Automatically trigger matching
      if (result.extrapolated_BOM?.length > 0 || result.required_skills?.length > 0) {
        setIsMatchingResources(true);
        try {
          const matchResponse = await matchResources(result.extrapolated_BOM, result.required_skills);
          setMatchedHardware(matchResponse.data.data.matched_hardware || []);
          setMatchedMentors(matchResponse.data.data.matched_mentors || []);
        } catch (matchError) {
          console.error('Matching error:', matchError);
        } finally {
          setIsMatchingResources(false);
        }
      }
    } catch (error) {
      console.error('Parse error:', error);
      setIsParsingProject(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            Project <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-text-secondary">
            Describe your project and let OmniPool's AI find everything you need.
          </p>
        </div>

        {/* Project Input */}
        <ProjectInput onSubmit={handleParseProject} isLoading={isParsingProject} />

        {/* Loading skeletons */}
        {isParsingProject && (
          <div className="mt-8 space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Results */}
        {parseResult && (
          <div className="mt-8 space-y-6">
            {/* Project title */}
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 rounded-full bg-gradient-to-b from-accent-indigo to-accent-violet" />
                <h2 className="text-xl font-bold text-text-primary">{parseResult.title}</h2>
              </div>
            </div>

            {/* BOM + Skills row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BOMPanel items={parseResult.extrapolated_BOM} />
              <SkillsPanel skills={parseResult.required_skills} />
            </div>

            {/* Matching section */}
            {isMatchingResources && (
              <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            )}

            {!isMatchingResources && (matchedHardware.length > 0 || matchedMentors.length > 0) && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 animate-fade-in">
                  <div className="w-1 h-8 rounded-full bg-gradient-to-b from-accent-emerald to-accent-cyan" />
                  <h2 className="text-xl font-bold text-text-primary">Community Matches</h2>
                </div>
                <HardwareMatches items={matchedHardware} />
                <MentorMatches mentors={matchedMentors} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
