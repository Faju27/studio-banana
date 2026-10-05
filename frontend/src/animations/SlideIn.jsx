import React, { Children } from 'react';
import { motion } from "motion/react";

const SlideIn = ({children}) => {
    return (
        <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    );
}

export default SlideIn;
