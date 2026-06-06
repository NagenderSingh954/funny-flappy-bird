import { useEffect, useState, useRef } from 'react'


function App() {
  const birrdposition = 10
  const [jump, setJump] = useState(50)
  const [gravity, setGravity] = useState(50)
  const [pillars, setPillars] = useState(5)
  const [obstacles, setObstacles] = useState([])
  const [score, setScore] = useState(0)


  const obstaclesRef = useRef([])
  const deadRef = useRef(false)
  const birdRef=useRef(null)
  const gameRef=useRef(null)




  const jumping = () => {

    setJump((pre) => pre - 15)
    // setGravity(0)
    // console.log(jump)

  }
  useEffect(() => {
    const interval = setInterval(() => {
      setGravity((pre) => pre + 10)
      // console.log(gravity)
      // setJump(pre=>pre-15)

    }, 100);

    return () => clearInterval(interval);
  }, [])
  useEffect(() => {
    const interval = setInterval(() => {
      setPillars((pre) => pre + 10)

    }, 1000);
    const span = setInterval(() => {
      setObstacles((pre) => [...pre, { id: Date.now(), right: -30, height: Math.random() * (500 - 100) + 100, score: false }])
    }, 3000);
    const mode = setInterval(() => {
      setObstacles((prev) => (
        prev.map((e) => {
          if (!e.score && e.right >= 120) {
            setScore(s => s + 0.5);

            return {
              ...e,
              score: true
            };
          }
          return { ...e, right: e.right + 10 }
        }).filter((e => e.right <= 120))
      ))
    }, 1000);


    return () => {
      clearInterval(interval)
      clearInterval(span)
      clearInterval(mode)
    };
  }, [])





  return (
    <>
      <div 
      ref={gameRef}
      className='main relative w-350 h-180 px-5 py-0 relative overflow-hidden' onClick={() => jumping()}>
        <div className='p-3 text-2xl z-100'>
          score: {score}
        </div>
        <div 
          ref={birdRef}
          className="bird absolute"
          style={{
            transform: `translateY(${gravity}%)`,
            top: `${jump}%`,
            left: '10%',
            transition: 'transform 0.5s linear, top 0.5s ease-out',
          }}
        >
          <img
            src="/plane.png"
            alt="plane"
            style={{
              display: 'block',
              width: '100px', 
              height: 'auto',
            }}
          />
        </div>


        {obstacles.map((e) => (
          <div key={e.id} className='upper w-40  bg-blue-600 absolute'
            style={{
              top: '0%',
              right: `${e.right}%`,
              height: `${700 - e.height - 150}px`,
              transition: 'right 1s linear'
            }}>

          </div>
        ))}

        {obstacles.map((e) => (
          <div key={`bot-${e.id}`} className='lower w-40  bg-blue-600 absolute'
            style={{
              bottom: '0%',
              right: `${e.right}%`,
              height: `${e.height}px`,
              transition: 'right 1s linear'
            }}>

          </div>
        ))}
      </div>
    </>
  )
}

export default App
