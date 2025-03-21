/* eslint-disable @typescript-eslint/no-explicit-any */
import { database } from "@/lib/appwrite";
import { Query } from "appwrite";

export type Save = {
  pomodoroUpgrades: number;
  bobaCount: number;
  totalBoba: number;
  totalClicks: number;
  completedSessions: number;
  bobaGoal: number;
  bobaPerClick: number;
  passiveBobaRate: number;
  staffUpgrades: number;
  marketingUpgrades: number;
  tapiocaUpgrades: number;
  challengesCompleted: string[];
};

const checkUserExists = async (userId: string) => {
  try {
    const documents = await database.listDocuments(
      import.meta.env.VITE_aPP_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_aPP_APPWRITE_COLLECTION_SAVES_ID,
      [Query.equal("userId", userId)]
    );
    return documents.total > 0; // Return true if user exists
  } catch (err) {
    console.error("Error checking if user exists:", err);
    return false;
  }
};

export const getDocumentCloudStorage = async (userId: string) => {
  try {
    const documents = await database.listDocuments(
      import.meta.env.VITE_aPP_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_aPP_APPWRITE_COLLECTION_SAVES_ID,
      [Query.equal("userId", userId)]
    );

    // Check if the document exists
    if (documents.total > 0) {
      return documents.documents[0]; // Return the first document (user's document)
    } else {
      console.log("No document found for the given userId");
      return null; // Return null if no document is found
    }
  } catch (err) {
    console.error("Error fetching user's document:", err);
    return null; // Return null if an error occurs
  }
};

export const saveToCloudStorage = async (
  userId: string | null,
  save: Save,
  lastSynced: string | null,
  setLastSynced: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  if (!userId || !save) return; // Don't sync if not signed in

  // Convert progress to JSON string for comparison
  const progressString = JSON.stringify(save);

  // Avoid unnecessary writes (sync only if progress changed)
  if (progressString === lastSynced) return;

  setLoading(true);
  try {
    const userExists = await checkUserExists(userId);

    if (userExists) {
      // Update existing document
      const documents = await database.listDocuments(
        import.meta.env.VITE_aPP_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_aPP_APPWRITE_COLLECTION_SAVES_ID,
        [Query.equal("userId", userId)]
      );

      const documentId = documents.documents[0].$id;

      await database.updateDocument(
        import.meta.env.VITE_aPP_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_aPP_APPWRITE_COLLECTION_SAVES_ID,
        documentId,
        {
          ...save,
          timestamp: new Date().toISOString(),
        }
      );
    } else {
      // Create new document if user doesn't exist
      await database.createDocument(
        import.meta.env.VITE_aPP_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_aPP_APPWRITE_COLLECTION_SAVES_ID,
        "unique()",
        {
          userId,
          ...save,
          timestamp: new Date().toISOString(),
        }
      );
    }

    setLastSynced(progressString); // Update last synced state
  } catch (err) {
    setError("Auto-sync failed");
    console.error("Auto-sync error:", err);
  } finally {
    setLoading(false);
  }
};
