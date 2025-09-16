// models/User.ts
export type EmploymentStatus = 'employed' | 'unemployed' | 'student' | 'looking';

export interface EmploymentStatusOption {
  value: EmploymentStatus;
  label: string;
}

export const employmentStatusOptions: EmploymentStatusOption[] = [
  { value: 'employed', label: 'Employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'student', label: 'Student' },
  { value: 'looking', label: 'Looking for opportunities' },
];

// models/User.ts
export interface UserProfile {
    uid: string;
    name: string;
    username: string;
    email: string;
    employmentStatus: EmploymentStatus;
    profilePicture?: string;
    completedProfile: boolean;
    createdAt?: Date; // Add optional createdAt field
  }