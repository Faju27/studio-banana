import { useContext } from "react";
import { PaymentContext } from "../context/PaymentProvider";


export const usePayment = () => useContext(PaymentContext);