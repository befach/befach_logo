import React from 'react';
import { ORIGINAL_SHIPMENT_STAGES, DETAILED_SHIPMENT_STAGES } from '../lib/shipmentStages';
import { getCurrentSubStage, getSubStageDetails as getAutoSubStageDetails, isSubStageCompleted, getSubStagesUpToCurrent } from '../lib/autoSubStageProgression';

interface ShipmentTimelineProps {
  currentStage: string;
  subStage?: string; // Add sub-stage prop
  estimatedDelivery?: string;
  transitStartDate?: string; // Add transit start date for auto progression
  stageUpdatedDate?: string; // Add stage updated date for auto progression
}

const ShipmentTimeline: React.FC<ShipmentTimelineProps> = ({ currentStage, subStage, estimatedDelivery, transitStartDate, stageUpdatedDate }) => {
  // Find the current stage index
  const currentStageIndex = ORIGINAL_SHIPMENT_STAGES.findIndex(stage => stage === currentStage);
  
  // Use automatic progression if stage is "In Transit to India" and we have a transit start date
  const useAutoProgression = currentStage === 'In Transit to India' && transitStartDate;
  const autoSubStage = useAutoProgression && transitStartDate ? getCurrentSubStage(new Date(transitStartDate)) : null;
  const effectiveSubStage = useAutoProgression ? autoSubStage : subStage;

  // Debug: Log props to see what's being passed
  console.log('=== SHIPMENT TIMELINE RENDER ===');
  console.log('Current timestamp:', new Date().toISOString());
  console.log('ShipmentTimeline props:', { currentStage, subStage, estimatedDelivery, transitStartDate, stageUpdatedDate });
  console.log('Auto progression enabled:', useAutoProgression);
  console.log('Effective sub-stage:', effectiveSubStage);
  console.log('Current stage index:', currentStageIndex);
  console.log('ORIGINAL_SHIPMENT_STAGES:', ORIGINAL_SHIPMENT_STAGES);
  console.log('=== END PROPS ===');
  
  // Get sample data for each stage - now dynamic based on stage updated date
  const getSampleData = (index: number) => {
    if (!stageUpdatedDate) return { date: '', time: '', location: '' };
    
    const baseDate = new Date(stageUpdatedDate);
    const stageDate = new Date(baseDate);
    stageDate.setDate(baseDate.getDate() + index);
    
    const formattedDate = stageDate.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    
    // Generate a random time
    const randomHour = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
    const randomMinute = Math.floor(Math.random() * 60);
    const formattedTime = `${randomHour.toString().padStart(2, '0')}:${randomMinute.toString().padStart(2, '0')} ${randomHour < 12 ? 'AM' : 'PM'}`;
    
    // Default location based on stage
    const locations = ['SHENZHEN CN', 'HONG KONG CN', 'DELHI IN'];
    const location = locations[index % locations.length];
    
    return { 
      date: formattedDate, 
      time: formattedTime, 
      location: location 
    };
  };

  // Function to get sub-stage details with dynamic dates
  const getSubStageDetails = (subStageId: string) => {
    // FORCE: Always use dynamic calculation, never return cached data
    console.log('=== FORCING DYNAMIC CALCULATION ===');
    console.log('stageUpdatedDate:', stageUpdatedDate);
    console.log('subStageId:', subStageId);
    
    if (!stageUpdatedDate) {
      console.log('No stageUpdatedDate provided, using current date as fallback');
      // Use current date as fallback
      const fallbackDate = new Date();
      const stageNumber = parseInt(subStageId.replace('stage_', ''));
      const stageDate = new Date(fallbackDate);
      stageDate.setDate(fallbackDate.getDate() + (stageNumber - 1));
      
      return {
        date: stageDate.toLocaleDateString('en-GB', {
          weekday: 'long',
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }),
        time: '12:00 PM',
        status: 'Dynamic Status',
        location: 'DYNAMIC LOCATION'
      };
    }
    
    const baseDate = new Date(stageUpdatedDate);
    const stageNumber = parseInt(subStageId.replace('stage_', ''));
    
    if (isNaN(stageNumber)) {
      console.log(`Invalid stage number for ${subStageId}`);
      return null;
    }
    
    // Calculate the date for this stage (stage_1 = base date, stage_2 = base date + 1 day, etc.)
    const stageDate = new Date(baseDate);
    stageDate.setDate(baseDate.getDate() + (stageNumber - 1));
    
    // Debug logging
    console.log(`Sub-stage ${subStageId}: Base date: ${baseDate.toISOString()}, Stage date: ${stageDate.toISOString()}, Stage number: ${stageNumber}`);
    
    const subStageMap = {
      'stage_1': { status: 'Shipment information received by Befach', location: 'SHENZHEN CN' },
      'stage_2': { status: 'Picked up from supplier warehouse', location: 'SHENZHEN CN' },
      'stage_3': { status: 'Package received at Befach export facility', location: 'SHENZHEN CN' },
      'stage_4': { status: 'Customs export clearance submitted', location: 'SHENZHEN CN' },
      'stage_5': { status: 'Export clearance completed', location: 'SHENZHEN CN' },
      'stage_6': { status: 'Departed from Shenzhen International Airport', location: 'SHENZHEN CN' },
      'stage_7': { status: 'Arrived at transit hub', location: 'HONG KONG CN' },
      'stage_8': { status: 'Departed transit hub', location: 'HONG KONG CN' },
      'stage_9': { status: 'Arrived at port of entry', location: 'DELHI IN' },
      'stage_10': { status: 'Document verification initiated (Customs)', location: 'DELHI IN' },
      'stage_11': { status: 'Import duty & GST assessment under process', location: 'DELHI IN' },
      'stage_12': { status: 'Customs inspection & clearance completed', location: 'DELHI IN' },
      'stage_13': { status: 'Handed over to Befach local delivery hub', location: 'DELHI IN' },
      'stage_14': { status: 'Out for delivery', location: 'DELHI IN' },
      'stage_15': { status: 'Delivered', location: 'DELHI IN' }
    };
    
    const stageInfo = subStageMap[subStageId as keyof typeof subStageMap];
    if (!stageInfo) return null;
    
    // Format the date dynamically - ensure it's always forward from base date
    const formattedDate = stageDate.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    
    // Generate a consistent time for each stage (not random, so it's predictable)
    const hour = 8 + (stageNumber % 12); // 8 AM to 7 PM
    const minute = (stageNumber * 15) % 60; // Increment by 15 minutes per stage
    const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
    
    return {
      date: formattedDate,
      time: formattedTime,
      status: stageInfo.status,
      location: stageInfo.location
    };
  };

  // Function to get sub-stages for a main stage
  const getSubStagesForMainStage = (mainStage: string) => {
    // Only show sub-stages for "In Transit to India" stage
    if (mainStage === 'In Transit to India') {
      return ['stage_1', 'stage_2', 'stage_3', 'stage_4', 'stage_5', 'stage_6', 'stage_7', 'stage_8', 'stage_9', 'stage_10', 'stage_11', 'stage_12', 'stage_13', 'stage_14', 'stage_15'];
    }
    // For all other stages, return empty array (no sub-stages)
    return [];
  };

  // Function to get current sub-stage index
  const getCurrentSubStageIndex = (mainStage: string, currentSubStage: string) => {
    const subStages = getSubStagesForMainStage(mainStage);
    return subStages.indexOf(currentSubStage);
  };

  // Function to check if a sub-stage is completed based on main stage progress
  const checkSubStageCompleted = (mainStage: string, subStageId: string, subIndex: number) => {
    const stageIndex = ORIGINAL_SHIPMENT_STAGES.indexOf(mainStage);
    
    // If this main stage is completed (past current stage), all its sub-stages are completed
    if (stageIndex < currentStageIndex) {
      return true;
    }
    
    // If this is the current main stage, check sub-stage progress
    if (stageIndex === currentStageIndex) {
      // Use automatic progression if available
      if (useAutoProgression && transitStartDate) {
        return isSubStageCompleted(subStageId, new Date(transitStartDate));
      }
      
      // Fallback to manual progression
      const currentSubStageIndex = getCurrentSubStageIndex(mainStage, effectiveSubStage || '');
      return subIndex < currentSubStageIndex;
    }
    
    // If this main stage is pending, no sub-stages are completed
    return false;
  };

  // Function to check if a sub-stage should be displayed
  const shouldDisplaySubStage = (mainStage: string, subStageId: string, subIndex: number) => {
    const stageIndex = ORIGINAL_SHIPMENT_STAGES.indexOf(mainStage);
    
    // For completed stages, show all sub-stages
    if (stageIndex < currentStageIndex) {
      return true;
    }
    
    // For current stage, show completed sub-stages AND the current sub-stage
    if (stageIndex === currentStageIndex) {
      // Use automatic progression if available
      if (useAutoProgression && transitStartDate) {
        const completedStages = getSubStagesUpToCurrent(new Date(transitStartDate));
        const currentSubStage = getCurrentSubStage(new Date(transitStartDate));
        const shouldShow = completedStages.includes(subStageId) || subStageId === currentSubStage;
        
        // Debug logging for first few sub-stages
        if (subIndex < 3) {
          console.log(`🔍 shouldDisplaySubStage(${subStageId}):`, {
            completedStages: completedStages.slice(0, 3),
            currentSubStage,
            shouldShow,
            isCompleted: completedStages.includes(subStageId),
            isCurrent: subStageId === currentSubStage
          });
        }
        
        return shouldShow;
      }
      
      // Fallback to manual progression
      const currentSubStageIndex = getCurrentSubStageIndex(mainStage, effectiveSubStage || '');
      // Show if it's completed OR if it's the current sub-stage
      return subIndex <= currentSubStageIndex;
    }
    
    // For pending stages, don't show any sub-stages
    return false;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipment Timeline</h2>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Progress: {Math.round(((currentStageIndex + 1) / ORIGINAL_SHIPMENT_STAGES.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStageIndex + 1) / ORIGINAL_SHIPMENT_STAGES.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Timeline items */}
        <div className="space-y-10">
          {ORIGINAL_SHIPMENT_STAGES.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const stageData = getSampleData(index);

            // Debug logging for main stages
            console.log(`--- Main Stage: ${stage} (Index: ${index}) ---`);
            console.log(`Current stage index: ${currentStageIndex}`);
            console.log(`Is completed: ${isCompleted}`);
            console.log(`Is current: ${isCurrent}`);
            console.log(`----------------------------------------`);
            
            return (
              <div key={stage} className="relative flex items-start">
                {/* Timeline dot */}
                <div className={`absolute left-5 top-2 w-4 h-4 rounded-full transform -translate-x-1/2 ${
                  isCompleted 
                    ? index === ORIGINAL_SHIPMENT_STAGES.length - 1 
                      ? 'bg-green-500' // Final stage gets green dot
                      : 'bg-green-500'   // Completed stages get green dot
                    : isCurrent
                      ? stage === 'In Transit to India' 
                        ? 'bg-green-500'    // In Transit to India always gets green dot
                        : 'bg-blue-500'    // Other current stages get blue dot
                      : 'bg-gray-300'    // Pending stages get gray dot
                } ${
                  isCurrent 
                    ? 'ring-4 ring-blue-100' 
                    : ''
                }`}></div>
                
                
                {/* Content */}
                <div className="ml-16 flex-1">
                  {/* Status Tag */}
                  <div className="mb-2">
                    {isCompleted ? (
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Completed
                      </span>
                    ) : isCurrent ? (
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                  
                  {/* Stage Name */}
                  <div className={`font-semibold text-base mb-1 ${
                    isCompleted 
                      ? 'text-gray-800' 
                      : isCurrent
                        ? 'text-gray-800'
                      : 'text-gray-500'
                  }`}>
                    {stage}
                    {getSubStagesForMainStage(stage).length > 0 && (
                      <span className="text-xs text-gray-500 ml-2">({getSubStagesForMainStage(stage).filter((_, subIndex) => shouldDisplaySubStage(stage, _, subIndex)).length} sub-stages)</span>
                    )}
                  </div>
                  
                  {/* Date */}
                  {isCompleted && (
                    <div className="text-sm text-gray-500 mb-2">
                      {isCurrent && subStage && getSubStageDetails(subStage) ? getSubStageDetails(subStage)?.date : stageData.date}
                    </div>
                  )}
                  
                  {/* Sub-stage details - show only relevant sub-stages for the stage */}
                  {getSubStagesForMainStage(stage).length > 0 && (
                    <div className="mt-3 mb-2">
                      <div className="text-xs text-gray-400 font-medium">Sub-stages:</div>
                    </div>
                  )}
                  <div className="relative">
                    {/* Dotted line for sub-stages */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 border-l-2 border-dotted border-gray-500"></div>
                    
                    
                    <div className="space-y-3">
                    {getSubStagesForMainStage(stage).map((subStageId, subIndex) => {
                      const subStageDetails = getSubStageDetails(subStageId);
                      const isSubStageCompleted = checkSubStageCompleted(stage, subStageId, subIndex);
                      const isCurrentSubStage = subIndex === getCurrentSubStageIndex(stage, subStage || '') && index === currentStageIndex;
                      
                      // Only show sub-stages that should be displayed
                      if (!shouldDisplaySubStage(stage, subStageId, subIndex)) return null;
                      
                      return subStageDetails ? (
                        <div key={subStageId} className="py-2">
                          {/* Sub-stage dot aligned with vertical line */}
                          <div className="flex items-center mb-1">
                            <div className={`w-3 h-3 rounded-full mr-4 transform -translate-x-1/2 ${
                              isCurrentSubStage
                                ? 'bg-purple-500'   // Current sub-stage gets purple dot (priority)
                                : isSubStageCompleted 
                                  ? 'bg-green-500'   // Completed sub-stages get green dot
                                  : 'bg-gray-300'     // Pending sub-stages get gray dot
                            }`} style={{ marginLeft: '32px' }}></div>
                            {/* Sub-stage status tag */}
                            <div>
                              {isCurrentSubStage ? (
                                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                  In Progress
                                </span>
                              ) : isSubStageCompleted ? (
                                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                  Completed
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={`text-sm font-medium ml-16 ${
                            isCurrentSubStage
                              ? 'text-gray-800'   // Current sub-stage gets black text (priority)
                              : isSubStageCompleted 
                                ? 'text-gray-800'   // Completed sub-stages get black text
                                : 'text-gray-500'   // Pending sub-stages get gray text
                          }`}>
                            {subStageDetails.status}
                          </div>
                          {/* Removed sub-stage date display here; only status is shown */}
                        </div>
                      ) : null;
                    })}
                    </div>
                  </div>
                  
                  {/* Location */}
                  {isCompleted && (
                    <div className="flex items-center text-sm text-blue-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {isCurrent && subStage && getSubStageDetails(subStage) ? getSubStageDetails(subStage)?.location : stageData.location}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShipmentTimeline; 