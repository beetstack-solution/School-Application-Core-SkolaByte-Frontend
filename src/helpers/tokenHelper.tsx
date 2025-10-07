import store from "@/redux/store";

 
export const getAdminBearerToken = () => {
  const token = store
  .getState().user.token;
  if (!token) {
    console.error("No artist token found");
    throw new Error("Authentication token is missing");
  }
  return token;
};