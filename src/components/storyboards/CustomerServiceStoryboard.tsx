import CustomerService from "../CustomerService";
import { BrowserRouter } from "react-router-dom";

export default function CustomerServiceStoryboard() {
  return (
    <BrowserRouter>
      <CustomerService />
    </BrowserRouter>
  );
}
