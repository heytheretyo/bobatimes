import { account, graphql } from "@/lib/appwrite";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  name?: string;
  email: string;
  emailVerification: boolean;
}

interface AuthResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  const register = async (
    email: string,
    password: string,
    username?: string
  ) => {
    try {
      // Use the Appwrite SDK's create method to register a new user
      const response = await account.create(
        "unique()", // The userId can be generated or unique as needed
        email,
        password,
        username || ""
      );

      // The response contains user details, including _id
      return { _id: response.$id }; // Return the user ID
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await account.createEmailPasswordSession(
        email,
        password
      );
      // The response contains session information after successful login
      return response; // You can return session data if needed
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  const logout = async () => {
    try {
      const response = await account.deleteSession("current"); // Deletes the current session

      // If the session is deleted successfully, the response will contain status 'ok'
      if (response === "ok") {
        return "Logged out successfully";
      } else {
        throw new Error("Logout failed: Unexpected response");
      }
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };
  const getCurrentUser = async (): Promise<User | null> => {
    try {
      const response = await account.get();

      // The response will contain user details like _id, name, email, etc.
      return {
        _id: response.$id,
        name: response.name,
        email: response.email,
        emailVerification: response.emailVerification,
      };
    } catch (error) {
      console.error("Fetch user error:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userDetails = await getCurrentUser();
      setUser(userDetails);
    };
    fetchUser();
  }, []);

  return { register, login, user, logout };
};

export default useAuth;
