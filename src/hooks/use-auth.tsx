import { graphql } from "@/lib/appwrite";
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
      const response: AuthResponse<{ accountCreate: { _id: string } }> =
        await graphql.mutation({
          query: `mutation Signup($email: String!, $password: String!, $name: String) {
            accountCreate(userId: "unique()", email: $email, password: $password, name: $name) {
              _id
            }
          }`,
          variables: { email, password, name: username },
        });

      if (response?.data?.accountCreate) {
        return response.data.accountCreate;
      } else {
        throw new Error(response?.errors?.[0]?.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse<{
        accountCreateEmailSession: { _id: string };
      }> = await graphql.mutation({
        query: `mutation Login($email: String!, $password: String!) {
            accountCreateEmailSession(email: $email, password: $password) {
              _id
            }
          }`,
        variables: { email, password },
      });

      if (response?.data?.accountCreateEmailSession) {
        return response.data.accountCreateEmailSession;
      } else {
        throw new Error(response?.errors?.[0]?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response: {
        data?: { accountDeleteSession?: { status: string } };
        errors?: { message: string }[];
      } = await graphql.mutation({
        query: `mutation {
          accountDeleteSession(sessionId: "current") {
            status
          }
        }`,
      });

      if (response?.errors?.length) {
        throw new Error(response.errors[0].message);
      }

      if (!response?.data?.accountDeleteSession) {
        throw new Error("Logout failed: No response data.");
      }

      return response.data.accountDeleteSession.status;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const getCurrentUser = async () => {
    try {
      const response: AuthResponse<{ accountGet: User }> = await graphql.query({
        query: `query {
          accountGet {
            _id
            name
            email
            emailVerification
          }
        }`,
      });

      if (response?.data?.accountGet) {
        return response.data.accountGet;
      } else {
        throw new Error("Failed to fetch user data");
      }
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
