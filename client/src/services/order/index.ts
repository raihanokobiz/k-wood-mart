import { apiRequest } from "@/lib/apiRequest";

// client-side order create helper — send full order payload from browser
export const addOrder = async (order: any) => {
  try {
    // helpful debug log to confirm exact payload being sent
    // (check browser console Network tab as well)
    console.log("[addOrder] sending payload:", order);
  } catch {
    // ignore
  }

  const res = await apiRequest({
    endpoint: "/order",
    method: "POST",
    body: order,
  });
  return res;
};
