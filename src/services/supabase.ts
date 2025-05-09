import { createClient } from "@supabase/supabase-js";
import type { User, Session } from "@supabase/supabase-js";

// Initialize Supabase client
// Note: In a production environment, these values should be in environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase URL or Anon Key is missing. Please check your environment variables.",
  );

  // In development, provide a more helpful message
  if (import.meta.env.DEV) {
    console.info(
      "To fix this error, please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.",
      "You can set these in the Tempo platform by clicking on the environment variables button.",
    );

    // Use dummy values in development to prevent crashes during initial setup
    // This allows the app to at least load, though Supabase functions won't work
    if (!supabaseUrl) {
      console.warn("Using placeholder Supabase URL for development");
    }
    if (!supabaseAnonKey) {
      console.warn("Using placeholder Supabase Anon Key for development");
    }
  } else {
    throw new Error(
      "Supabase configuration is missing. Please check your environment variables.",
    );
  }
}

// Create the Supabase client with actual values or fallbacks for development
export const supabase = createClient(
  supabaseUrl || "https://uvirmaodzkzytspnipwr.supabase.co",
  supabaseAnonKey ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2aXJtYW9kemt6eXRzcG5pcHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NDQxNjAsImV4cCI6MjA2MjEyMDE2MH0.hQt5H3V08c4I2c_4YjNvrmml5ZawXAAAUiBJGLBWryQ",
);

// Types for authentication responses
export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: string | null;
}

// Types for user data
export interface CustomerData {
  email: string;
  password: string;
  name?: string;
  address?: string;
  phone_number?: string;
}

export interface SellerData {
  email: string;
  password: string;
  business_name?: string;
  business_address?: string;
}

/**
 * Sign up a new customer
 * @param data - Customer registration data
 * @returns AuthResponse object
 */
export const signUpCustomer = async (
  data: CustomerData,
): Promise<AuthResponse> => {
  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          address: data.address,
          phone_number: data.phone_number,
          user_type: "customer",
        },
      },
    });

    if (error) {
      return { user: null, session: null, error: error.message };
    }

    return { user: authData.user, session: authData.session, error: null };
  } catch (err) {
    console.error("Error signing up customer:", err);
    return { user: null, session: null, error: "An unexpected error occurred" };
  }
};

/**
 * Sign up a new seller
 * @param data - Seller registration data
 * @returns AuthResponse object
 */
export const signUpSeller = async (data: SellerData): Promise<AuthResponse> => {
  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          business_name: data.business_name,
          business_address: data.business_address,
          user_type: "seller",
        },
      },
    });

    if (error) {
      return { user: null, session: null, error: error.message };
    }

    return { user: authData.user, session: authData.session, error: null };
  } catch (err) {
    console.error("Error signing up seller:", err);
    return { user: null, session: null, error: "An unexpected error occurred" };
  }
};

/**
 * Sign in a user with email and password
 * @param email - User's email
 * @param password - User's password
 * @returns AuthResponse object
 */
export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    console.log("Attempting to sign in with:", { email });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase auth error:", error);
      return { user: null, session: null, error: error.message };
    }

    console.log("Sign in successful", data);
    return { user: data.user, session: data.session, error: null };
  } catch (err) {
    console.error("Error signing in:", err);
    return { user: null, session: null, error: "An unexpected error occurred" };
  }
};

/**
 * Sign out the current user
 * @returns boolean indicating success or failure
 */
export const signOut = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error signing out:", err);
    return false;
  }
};

/**
 * Delete the current user's account
 * @returns boolean indicating success or failure
 */
export const deleteAccount = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.admin.deleteUser(
      (await supabase.auth.getUser()).data.user?.id || "",
    );
    if (error) {
      console.error("Error deleting account:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error deleting account:", err);
    return false;
  }
};

/**
 * Get the current session
 * @returns The current session or null
 */
export const getCurrentSession = async (): Promise<Session | null> => {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (err) {
    console.error("Error getting session:", err);
    return null;
  }
};

/**
 * Get the current user
 * @returns The current user or null
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (err) {
    console.error("Error getting user:", err);
    return null;
  }
};
