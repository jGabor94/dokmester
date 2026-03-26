import { PlanConfig } from "./types";

const plansConfig = {
  "basic": {
    name: "Basic",
    storage: 5368709120, //in byte
    userNumber: 1,
  },
  "premium": {
    name: "Premium",
    storage: 26843545600, //in byte
    userNumber: 10,
  },
  "business": {
    name: "Business",
    storage: 53687091200, //in byte
    userNumber: 20,
  }
}

export default plansConfig as Record<string, PlanConfig>;