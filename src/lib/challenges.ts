// challenges.ts

export interface Challenge {
  id: string;
  name: string;
  description: string;
  target: number;
  type: "boba" | "sessions" | "clicks" | "bps";
  completed: boolean;
  reward: number;
}

export const initialChallenges: Challenge[] = [
  {
    id: "rookie",
    name: "Rookie Brewer",
    description: "Brew 100 total boba",
    target: 100,
    type: "boba",
    completed: false,
    reward: 50,
  },
  {
    id: "focused",
    name: "Focused Mind",
    description: "Complete 5 focus sessions",
    target: 5,
    type: "sessions",
    completed: false,
    reward: 100,
  },
  {
    id: "clicker",
    name: "Fast Fingers",
    description: "Click 200 times",
    target: 200,
    type: "clicks",
    completed: false,
    reward: 75,
  },
  {
    id: "passive",
    name: "Passive Income",
    description: "Reach 10 boba per second",
    target: 10,
    type: "bps",
    completed: false,
    reward: 250,
  },
  {
    id: "master",
    name: "Boba Master",
    description: "Brew 1000 total boba",
    target: 1000,
    type: "boba",
    completed: false,
    reward: 500,
  },
];
