import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

const Confetti = () => {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => i)

  return (
    <>
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece}
          initial={{
            x: Math.random() * window.innerWidth,
            y: -10,
            rotate: Math.random() * 360,
            opacity: 1,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 10,
            rotate: Math.random() * 360 + 360,
            opacity: 0,
          }}
          transition={{
            duration: 3 + Math.random() * 1,
            ease: 'easeIn',
          }}
          className="fixed pointer-events-none"
        >
          <div
            className={`w-2 h-2 rounded-full ${
              ['bg-brand-blue', 'bg-brand-purple', 'bg-brand-green', 'bg-brand-yellow'][
                Math.floor(Math.random() * 4)
              ]
            }`}
          ></div>
        </motion.div>
      ))}
    </>
  )
}

export default Confetti
