import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 z-50">
      {/* Blurred Background */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-lg"></div>

      {/* 3D Rotating Cube */}
      <motion.div
        className="relative w-20 h-20"
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
          rotateZ: [0, 360],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute w-full h-full bg-blue-500 shadow-xl rounded-lg"></div>
      </motion.div>

      {/* Loading Text */}
      <div className="absolute bottom-10 text-center text-white text-lg font-semibold tracking-widest animate-pulse">
        LOADING<span className="text-blue-500">...</span>
      </div>
    </div>
  );
};

export default Loader;
