/**
 * Utility function to get the appropriate home link based on user role
 * @param userType - The user's role (customer, seller, or null)
 * @returns The appropriate home link path
 */
export const getHomeLink = (userType: string | null): string => {
  if (!userType) return "/";

  switch (userType) {
    case "customer":
      return "/customer/home";
    case "seller":
      return "/seller/home";
    default:
      return "/";
  }
};
