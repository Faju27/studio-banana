import { useContext } from "react";
import { WholesalerContext } from "../context/WholesalerProvider";


export const useWholesaler = () => useContext(WholesalerContext);