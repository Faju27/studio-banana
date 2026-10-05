import React from 'react';
import { motion } from "motion/react";

const FadeIn = ({children, className = "", delay = 0, }) => {
    return (
        <motion.div  
            initial={{ opacity: 0 , y:20 }}

            animate={{ opacity: 1, y:0 }}
            // whileInView={{ opacity: 1, y: 0 }}
            // viewport={{ once: true }}

            // exit={{opacity:0, y: -20}}
            transition={{
                duration: 0.5,
                delay,
                ease: "easeOut",
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default FadeIn;
