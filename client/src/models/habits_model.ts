export interface HabitsModel  {
    userid: string,
    name: string,
    description: string,
    frequency: string,
    category: string,
    target_count: number,
    current_streak: number,
    completed_dates: string[]
} 

export interface HabitData {
    id: number;
    user_id: string;
    name: string;
    description: string;
    target_count: number;
    current_streak: number;
    completed_dates: string[] | null;
    category: string;
    created_at: string;
}