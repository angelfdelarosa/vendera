
'use client';

import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/types';

// Supabase client setup from our existing client module
const supabase = createClient();

// User Creation and Profile Management Service
class UserService {

  // Create a new user with extended profile
  async signUp(email: string, password: string, metadata: Partial<Pick<UserProfile, 'full_name'>> = {}) {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const userMetadata = {
        full_name: metadata.full_name || email.split('@')[0],
      };

      // Sign up with Supabase Auth. The database trigger will handle profile creation.
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User not created in Auth.");

      // Fetch profile to confirm and return it, using retry logic for trigger delay
      const profile = await this.getProfile(authData.user.id);

      return { user: authData.user, profile };
    } catch (error) {
      console.error('User signup error:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      // Update auth user metadata
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: updates.full_name,
          avatar_url: updates.avatar_url
        }
      });

      if (authError) throw authError;

      // Update profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (profileError) throw profileError;

      return { authUser: authData.user, profile: profileData };
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  // Fetch user profile with retry logic
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, created_at')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle to avoid error on no rows

      if (error && error.code !== 'PGRST116') { // PGRST116 is "exact-single-row-selection-violation" which maybeSingle handles
        console.error('Fetch profile error:', error);
        throw error;
      }
      
      // If profile is not found, it could be due to db trigger delay. Retry once.
      if (!data) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const retryResult = await supabase
          .from('profiles')
          .select('*, created_at')
          .eq('user_id', userId)
          .maybeSingle();

        if (retryResult.error) {
           console.error('Retry fetch profile error:', retryResult.error);
        }
        
        return retryResult.data || null;
      }

      return data;
    } catch (error) {
      console.error('Unhandled fetch profile error:', error);
      throw error; 
    }
  }
}

// Export a single instance of the service
export const userService = new UserService();
