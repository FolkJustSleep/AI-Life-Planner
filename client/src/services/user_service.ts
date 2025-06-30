// src/services/user_service.ts

import { supabase, getCurrentSupabaseUserId, apiUrl } from '../utils/supabase';
import { ApiAllUserData, ClientProfileData, UserModel } from '../models/user_model';
import { ResponseModel } from '../models/response_model';

export class UserService {
  // for saving user data in goal page
  static async saveUserProfile(clientProfileData: ClientProfileData): Promise<ResponseModel> {
    const userId = await getCurrentSupabaseUserId();

    if (!userId) {
      throw new Error('User not authenticated. Cannot save profile.');
    }

    // Transform client-side data into the comprehensive ApiAllUserData format
    const apiAllUserData: ApiAllUserData = {
      age: parseInt(clientProfileData.personal.age),
      allergies: clientProfileData.health.allergies
        ? clientProfileData.health.allergies.split(',').map((s) => s.trim())
        : [],
      available_time: clientProfileData.schedule.availableTime,
      busy_days: clientProfileData.schedule.busiestDays
        ? clientProfileData.schedule.busiestDays.split(',').map((s) => s.trim())
        : [],
      currency: clientProfileData.financial.currency,
      expenses: parseInt(clientProfileData.financial.monthlyExpenses),
      fitness_level: clientProfileData.health.fitnessLevel,
      full_name: clientProfileData.personal.full_name,
      gender: clientProfileData.personal.gender,
      height: parseInt(clientProfileData.personal.height),
      income: parseInt(clientProfileData.financial.monthlyIncome),
      long_term: clientProfileData.lifeGoals.longTermGoals
        ? clientProfileData.lifeGoals.longTermGoals.split(',').map((s) => s.trim())
        : [],
      medical_conditions: clientProfileData.health.medicalConditions
        ? clientProfileData.health.medicalConditions.split(',').map((s) => s.trim())
        : [],
      medications: clientProfileData.health.currentMedications
        ? clientProfileData.health.currentMedications.split(',').map((s) => s.trim())
        : [],
      preferred_times: clientProfileData.schedule.preferredTimes
        ? clientProfileData.schedule.preferredTimes.split(',').map((s) => s.trim())
        : [],
      priorities: clientProfileData.lifeGoals.lifePriorities
        ? clientProfileData.lifeGoals.lifePriorities.split(',').map((s) => s.trim())
        : [],
      risk_tolerance: clientProfileData.financial.riskTolerance,
      savings_goal: parseInt(clientProfileData.financial.monthlySavingGoal),
      short_term: clientProfileData.lifeGoals.shortTermGoals
        ? clientProfileData.lifeGoals.shortTermGoals.split(',').map((s) => s.trim())
        : [],
      sleep_pattern: clientProfileData.health.sleepPattern,
      timeframe: clientProfileData.lifeGoals.preferredTimeframe,
      weight: parseInt(clientProfileData.personal.weight),
      work_hours: clientProfileData.schedule.workHours,
    };

    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;

      if (!accessToken) {
        throw new Error('No active Supabase session found. Please log in.');
      }

      const response = await fetch(
        `${apiUrl}/api/v1/users/user/add_alldata/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(apiAllUserData),
        }
      );

      if (!response.ok) {
        let errorMessage = `Failed to save profile: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
        }
        throw new Error(errorMessage);
      }

      return (await response.json()) as ResponseModel;
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  // for getting user data in userprofile page
  static async getUserProfile(): Promise<UserModel> {
    const userId = await getCurrentSupabaseUserId();

    if (!userId) {
      throw new Error('User not authenticated. Cannot get profile.');
    }

    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;

      if (!accessToken) {
        throw new Error('No active Supabase session found. Please log in.');
      }

      const response = await fetch(
        `${apiUrl}/api/v1/users/user/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        if (
          response.status === 403 &&
          responseData &&
          typeof responseData.message === 'string' &&
          responseData.message.toLowerCase().includes('cannot get user data')
        ) {
          // Return empty UserModel
          return {
            full_name: null,
            age: null,
            gender: null,
            height: null,
            weight: null,
          };
        }
        let errorMessage = `Failed to get profile: ${response.statusText}`;
        try {
          const errorData = responseData;
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
        }
        throw new Error(errorMessage);
      }

      return responseData.data as UserModel;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // for updating user data in userprofile page
  static async updateProfile(userModel: UserModel): Promise<ResponseModel> {
    const userId = await getCurrentSupabaseUserId();

    if (!userId) {
      throw new Error('User not authenticated. Cannot update profile.');
    }

    const apiAllUserData: UserModel = {
      age: userModel.age,
      full_name: userModel.full_name,
      gender: userModel.gender,
      height: userModel.height,
      weight: userModel.weight
    };
    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;

      if (!accessToken) {
        throw new Error('No active Supabase session found. Please log in.');
      }
      console.log(apiAllUserData)
      const response = await fetch(
        `${apiUrl}/api/v1/users/update_user/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(apiAllUserData),
        }
      );

      if (!response.ok) {
        let errorMessage = `Failed to save profile: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
        }
        throw new Error(errorMessage);
      }

      return (await response.json()) as ResponseModel;
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  // for saving new user data in userprofile page
  static async saveUserData(userModel: UserModel): Promise<ResponseModel> {
    const userId = await getCurrentSupabaseUserId();

    if (!userId) {
      throw new Error('User not authenticated. Cannot save user data.');
    }

    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;

      if (!accessToken) {
        throw new Error('No active Supabase session found. Please log in.');
      }

      const apiAllUserData: UserModel = {
        age: userModel.age,
        full_name: userModel.full_name,
        gender: userModel.gender,
        height: userModel.height,
        weight: userModel.weight
      };
      try {
        const session = await supabase.auth.getSession();
        const accessToken = session.data.session?.access_token;

        if (!accessToken) {
          throw new Error('No active Supabase session found. Please log in.');
        }
        console.log(apiAllUserData)
        const response = await fetch(
          `${apiUrl}/api/v1/users/add_user/${userId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(apiAllUserData),
          }
        );

        if (!response.ok) {
          let errorMessage = `Failed to save user data: ${response.statusText}`;
          try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (jsonError) {
            console.error('Error parsing JSON response:', jsonError);
          }
          throw new Error(errorMessage);
        }

        return (await response.json()) as ResponseModel;
      } catch (error) {
        console.error('Error saving user data:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }
}