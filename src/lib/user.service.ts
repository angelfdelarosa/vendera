
'use client';

import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/types';

// Supabase client setup from our existing client module
const supabase = createClient();

// User Creation and Profile Management Service
class UserService {

  // Create a new user with extended profile
  async signUp(email: string, password: string, metadata: Partial<UserProfile> = {}) {
    try {
      const fullName = metadata.full_name || email.split('@')[0];
      
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            avatar_url: metadata.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User not created in Auth.");

      // The trigger 'handle_new_user' should create the profile.
      // We can fetch it to confirm and return it.
      const profile = await this.getProfile(authData.user.id);

      return { user: authData.user, profile };
    } catch (error) {
      console.error('User signup error:', error);
      throw error;
    }
  }

  // Generate a unique username
  generateUsername(email: string): string {
    const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/gi, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${baseUsername}${randomSuffix}`;
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

  // Fetch user profile
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, created_at')
        .eq('user_id', userId)
        .single();

      if (error) {
        // This is expected if the profile is not found, so we don't throw.
        console.warn('Fetch profile warning:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Fetch profile error:', error);
      throw error; // Rethrow for caller to handle
    }
  }
}

// Export a single instance of the service
export const userService = new UserService();
