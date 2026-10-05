import { motion } from "motion/react";

const StaggerContainer = ({ children, className = "" , whileInView = false}) => {
    return (
        <motion.div
            initial="hidden"
            // animate="visible"
            // whileInView="visible"
            // viewport={{
            //     once: true,
            //     amount: 0.2,
            // }}
            {...(
                whileInView
                    ? {
                        whileInView: "visible",
                        viewport: { once: true, amount: 0.2 },
                    }
                    : {
                        animate: "visible",
                    }
            )}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: 0.2,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem = ({ children, className = "" }) => {
    return (
        <motion.div
            layout
            variants={{
                hidden: {
                    opacity: 0,
                    x: 50,
                },
                visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                        duration: 0.4,
                        ease: "easeOut",
                    },
                },
                exit: {
                    opacity: 0,
                    x: -50,
                    transition: {
                        duration: 0.3,
                        ease: "easeIn",
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default StaggerContainer;