import { useContext } from "react";
import { OrderContext } from "../context/OrderProvider";


export const useOrder = () => useContext(OrderContext);