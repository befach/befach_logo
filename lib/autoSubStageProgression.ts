// Automatic sub-stage progression based on calendar days
// Each sub-stage corresponds to a specific day and time

export interface SubStageData {
  id: string;
  date: string;
  time: string;
  status: string;
  location: string;
  dayOfWeek: string;
  dayNumber: number; // 1 = Monday, 2 = Tuesday, etc.
}

export const SUB_STAGES_DATA: SubStageData[] = [
  {
    id: 'stage_1',
    date: 'Monday, 18/08/25',
    time: '7:30 PM',
    status: 'Shipment information received by Befach',
    location: 'SHENZHEN CN',
    dayOfWeek: 'Monday',
    dayNumber: 1
  },
  {
    id: 'stage_2',
    date: 'Wednesday, 20/08/25',
    time: '1:12 PM',
    status: 'Picked up from supplier warehouse',
    location: 'SHENZHEN CN',
    dayOfWeek: 'Wednesday',
    dayNumber: 3
  },
  {
    id: 'stage_3',
    date: 'Wednesday, 20/08/25',
    time: '5:45 PM',
    status: 'Package received at Befach export facility',
    location: 'SHENZHEN CN',
    dayOfWeek: 'Wednesday',
    dayNumber: 3
  },
  {
    id: 'stage_4',
    date: 'Wednesday, 20/08/25',
    time: '10:35 PM',
    status: 'Customs export clearance submitted',
    location: 'SHENZHEN CN',
    dayOfWeek: 'Wednesday',
    dayNumber: 3
  },
  {
    id: 'stage_5',
    date: 'Thursday, 21/08/25',
    time: '9:40 AM',
    status: 'Export clearance completed',
    location: 'SHENZHEN CN',
    dayOfWeek: 'Thursday',
    dayNumber: 4
  },
  {
    id: 'stage_6',
    date: 'Thursday, 21/08/25',
    time: '11:05 PM',
    status: 'Departed from Shenzhen International Airport',
    location: 'SHENZHEN CN',
    dayOfWeek: 'Thursday',
    dayNumber: 4
  },
  {
    id: 'stage_7',
    date: 'Friday, 22/08/25',
    time: '3:25 AM',
    status: 'Arrived at transit hub',
    location: 'HONG KONG CN',
    dayOfWeek: 'Friday',
    dayNumber: 5
  },
  {
    id: 'stage_8',
    date: 'Friday, 22/08/25',
    time: '6:45 AM',
    status: 'Departed transit hub',
    location: 'HONG KONG CN',
    dayOfWeek: 'Friday',
    dayNumber: 5
  },
  {
    id: 'stage_9',
    date: 'Friday, 22/08/25',
    time: '12:10 PM',
    status: 'Arrived at port of entry',
    location: 'DELHI IN',
    dayOfWeek: 'Friday',
    dayNumber: 5
  },
  {
    id: 'stage_10',
    date: 'Friday, 22/08/25',
    time: '12:30 PM',
    status: 'Document verification initiated (Customs)',
    location: 'DELHI IN',
    dayOfWeek: 'Friday',
    dayNumber: 5
  },
  {
    id: 'stage_11',
    date: 'Friday, 22/08/25',
    time: '3:15 PM',
    status: 'Import duty & GST assessment under process',
    location: 'DELHI IN',
    dayOfWeek: 'Friday',
    dayNumber: 5
  },
  {
    id: 'stage_12',
    date: 'Friday, 22/08/25',
    time: '6:50 PM',
    status: 'Customs inspection & clearance completed',
    location: 'DELHI IN',
    dayOfWeek: 'Friday',
    dayNumber: 5
  },
  {
    id: 'stage_13',
    date: 'Saturday, 23/08/25',
    time: '8:40 AM',
    status: 'Handed over to Befach local delivery hub',
    location: 'DELHI IN',
    dayOfWeek: 'Saturday',
    dayNumber: 6
  },
  {
    id: 'stage_14',
    date: 'Saturday, 23/08/25',
    time: '10:20 AM',
    status: 'Out for delivery',
    location: 'DELHI IN',
    dayOfWeek: 'Saturday',
    dayNumber: 6
  },
  {
    id: 'stage_15',
    date: 'Saturday, 23/08/25',
    time: '11:45 AM',
    status: 'Delivered',
    location: 'DELHI IN',
    dayOfWeek: 'Saturday',
    dayNumber: 6
  }
];

// Function to get current day of week (1 = Monday, 7 = Sunday)
export function getCurrentDayOfWeek(): number {
  const today = new Date();
  const day = today.getDay();
  // Convert Sunday (0) to 7, Monday (1) to 1, etc.
  return day === 0 ? 7 : day;
}

// Function to get current day name
export function getCurrentDayName(): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
}

// Function to calculate days elapsed since a given date (24-hour intervals)
export function getDaysElapsed(sinceDate: Date): number {
  const today = new Date();
  const diffTime = today.getTime() - sinceDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // <-- use floor
  return Math.max(0, diffDays);
}

// Function to get the appropriate sub-stage based on days elapsed (24-hour per stage)
export function getCurrentSubStage(sinceDate: Date): string {
  const daysElapsed = getDaysElapsed(sinceDate);
  
  // Map days elapsed to sub-stages - sequential progression
  if (daysElapsed === 0) return 'stage_1'; // Same day - Shipment information received
  if (daysElapsed === 1) return 'stage_2'; // Next day - Picked up from supplier warehouse
  if (daysElapsed === 2) return 'stage_3'; // 2 days later - Package received at Befach export facility
  if (daysElapsed === 3) return 'stage_4'; // 3 days later - Customs export clearance submitted
  if (daysElapsed === 4) return 'stage_5'; // 4 days later - Export clearance completed
  if (daysElapsed === 5) return 'stage_6'; // 5 days later - Departed from Shenzhen International Airport
  if (daysElapsed === 6) return 'stage_7'; // 6 days later - Arrived at transit hub
  if (daysElapsed === 7) return 'stage_8'; // 7 days later - Departed transit hub
  if (daysElapsed === 8) return 'stage_9'; // 8 days later - Arrived at port of entry
  if (daysElapsed === 9) return 'stage_10'; // 9 days later - Document verification initiated
  if (daysElapsed === 10) return 'stage_11'; // 10 days later - Import duty & GST assessment
  if (daysElapsed === 11) return 'stage_12'; // 11 days later - Customs inspection & clearance completed
  if (daysElapsed === 12) return 'stage_13'; // 12 days later - Handed over to Befach local delivery hub
  if (daysElapsed === 13) return 'stage_14'; // 13 days later - Out for delivery
  if (daysElapsed >= 14) return 'stage_15'; // 14+ days later - Delivered
  
  return 'stage_1'; // Default
}

// Function to get all sub-stages up to current day
export function getSubStagesUpToCurrent(sinceDate: Date): string[] {
  const daysElapsed = getDaysElapsed(sinceDate);
  
  // Get all sub-stages that should be completed - sequential progression
  const completedStages: string[] = [];
  
  // Add stages based on days elapsed
  for (let i = 0; i <= daysElapsed; i++) {
    const stageId = `stage_${i + 1}`;
    if (i < 15) { // Only add valid stage IDs
      completedStages.push(stageId);
    }
  }
  
  return completedStages;
}

// Function to get sub-stage details by ID
export function getSubStageDetails(subStageId: string): SubStageData | null {
  return SUB_STAGES_DATA.find(stage => stage.id === subStageId) || null;
}

// Function to check if a sub-stage should be completed based on days elapsed
export function isSubStageCompleted(subStageId: string, sinceDate: Date): boolean {
  const daysElapsed = getDaysElapsed(sinceDate);
  
  // Extract stage number from stageId (e.g., "stage_1" -> 1)
  const stageNumber = parseInt(subStageId.replace('stage_', ''));
  
  if (isNaN(stageNumber)) return false;
  
  // A stage is completed if its number is less than or equal to days elapsed + 1
  // (since day 0 = stage_1, day 1 = stage_2, etc.)
  return stageNumber <= daysElapsed + 1;
}

// Function to get the next sub-stage that should be active
export function getNextActiveSubStage(sinceDate: Date): string {
  const daysElapsed = getDaysElapsed(sinceDate);
  
  // Find the next stage that should be active
  for (const stage of SUB_STAGES_DATA) {
    if (stage.dayNumber > daysElapsed + 1) {
      return stage.id;
    }
  }
  
  return 'stage_15'; // Default to last stage
}

