import store from "./src/redux/store";
 
export const getAdminBearerToken = () => {
  const token = store.getState().user.token;
  // console.log("token", token);
  if (!token) {
    console.error("No  token found");
    throw new Error("Authentication token is missing");
  }
  return token;
};
 
 
// export const getCustomerBearerToken = () => {
//   const token = store.getState().customer.token;
//   console.log("token", token);
//   if (!token) {
//     console.error("No customer token found");
//     throw new Error("Authentication token is missing");
//   }
//   return token;
// };
 
 
 