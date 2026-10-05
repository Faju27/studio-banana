import { useContext } from "react";
import { ProductContext } from "../context/ProductProvider";


export const useProducts = () => useContext(ProductContext);