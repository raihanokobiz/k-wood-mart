import { BASE_URL } from "@/config/config";

export interface EmiPlan {
  months: number;
  interestRate: number;
}

export interface Emi {
  _id?: string;
  isActive?: boolean;
  plans: EmiPlan[];
  createdAt?: string;
  updatedAt?: string;
}

export async function createEmiPlan(data: Emi) {
  console.log(data, "data from EMI post api");
  const response = await fetch(`${BASE_URL}/emi`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Error: ${response.status}`);
  }
  return response.json();
}

export async function getAllEmiPlans() {
  const response = await fetch(`${BASE_URL}/emi/all`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function getEmiPlanById(id: string) {
  const response = await fetch(`${BASE_URL}/emi/${id}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function updateEmiPlan(id: string, data: Emi) {
  const response = await fetch(`${BASE_URL}/emi/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Error: ${response.status}`);
  }
  return response.json();
}

export async function deleteEmiPlan(id: string) {
  const response = await fetch(`${BASE_URL}/emi/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Error: ${response.status}`);
  }
  return response.json();
}

export async function toggleEmiPlanActive(id: string, isActive: boolean) {
  const response = await fetch(`${BASE_URL}/emi/${id}/toggle-active`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isActive }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Error: ${response.status}`);
  }
  return response.json();
}
