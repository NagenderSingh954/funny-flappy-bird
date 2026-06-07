import { useEffect, useState, useRef } from 'react'


function App() {
  const birrdposition = 10
  const [jump, setJump] = useState(50)
  const [gravity, setGravity] = useState(50)
  const [pillars, setPillars] = useState(5)
  const [obstacles, setObstacles] = useState([])
  const [score, setScore] = useState(0)
   const audioRef = useRef(null);

  const obstaclesRef = useRef([])
  const deadRef = useRef(false)
  const birdRef = useRef(null)
  const gameRef = useRef(null)
  const [colied,setColid]=useState(false)




  const jumping = () => {
    if (deadRef.current) return
    setJump((pre) => pre - 15)
    // setGravity(0)
    // console.log(jump)

  }

   useEffect(() => {
    audioRef.current?.play().catch(() => {
      console.log("Autoplay blocked");
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (deadRef.current) return
      setGravity((pre) => pre + 10)
      // console.log(gravity)
      // setJump(pre=>pre-15)

    }, 100);

    return () => clearInterval(interval);
  }, [])
  useEffect(() => {
    const interval = setInterval(() => {
      if (deadRef.current) return
      setPillars((pre) => pre + 10)

    }, 1000);
    const span = setInterval(() => {
      if (deadRef.current) return
      setObstacles((pre) => [...pre, { id: Date.now(), right: -30, height: Math.random() * (500 - 100) + 100, score: false }])
    }, 3000);
    const mode = setInterval(() => {
      if (deadRef.current) return
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


  useEffect(() => {
    const collision = setInterval(() => {
      if (deadRef.current) return
      if (!birdRef.current || !gameRef.current) return

      const gameRect = gameRef.current.getBoundingClientRect()
      const birdRect = birdRef.current.getBoundingClientRect()

      const birdTop = birdRect.top - gameRect.top
      const birdBottom = birdRect.bottom - gameRect.top
      const birdLeft = birdRect.left - gameRect.left
      const birdRight = birdRect.right - gameRect.left

      if (birdTop <= 0 || birdBottom >= gameRect.height) {
                setColid(true)
                reset(); return
            }


        const pillars = gameRef.current.querySelectorAll('.upper, .lower')
            for (const pillar of pillars) {
                const pRect = pillar.getBoundingClientRect()
                const pTop = pRect.top - gameRect.top
                const pBottom = pRect.bottom - gameRect.top
                const pLeft = pRect.left - gameRect.left
                const pRight = pRect.right - gameRect.left

                const horizontalOverlap = birdRight - 20 > pLeft && birdLeft + 20 < pRight
                const verticalOverlap = birdBottom - 20 > pTop && birdTop + 20 < pBottom

                if (horizontalOverlap && verticalOverlap) {
                     setColid(true)
                    reset(); return
                }}

    }, 50);
    return () => clearInterval(collision)
  }, [])
  const reset = () => {
        deadRef.current = true
        setObstacles([])
        setJump(50)
        setGravity(50)
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setPillars(5)
        // setTimeout(() => { deadRef.current = false }, 200)
    }
   const reinitialize=()=>{
      setTimeout(() => { deadRef.current = false }, 200)
      audioRef.current.play();
       setColid(false)
       setScore(0)
    }



  return (
    <>
    <audio ref={audioRef} loop>
  <source src="/audio.mp3" type="audio/mpeg" />
</audio>
      <div
        ref={gameRef}
        className='main relative w-350 h-180 px-5 py-0 relative overflow-hidden' onClick={() => jumping()}>
        <div className='p-3 text-2xl z-100'>
          score: {score}
        </div>
        <div
          ref={birdRef}
          className="bird absolute flex"
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
          
          {colied && <img src="blast.png" alt="" style={{
              display: 'block',
              width: '',
              height: '',
              border:'2px solid red',
              position:'absolute',
              left:'-12px',
              bottom:'9px',
              scale:'2'
            }}  />}
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

        {deadRef.current &&
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl
w-[450px] p-8 flex flex-col items-center z-10">

    {/* Heading */}
    <h1 className="text-4xl font-extrabold text-gray-800">
        Game Over
    </h1>

    <p className="text-gray-500 mt-2">
        Great Job!
    </p>

    {/* Medal */}
    <div className="mt-6 relative">
        <div className="w-40 h-40 rounded-full bg-yellow-100 flex items-center justify-center shadow-lg overflow-hidden">
            <img
                src="/medal.png"
                alt="Medal"
                className=" scale-160"
            />
        </div>
    </div>

    {/* Score */}
    <div className="mt-6 text-center">
        <p className="text-xl font-semibold text-gray-600">
            Your Score
        </p>

        <div className="mt-3 bg-sky-100 rounded-full w-32 h-32 flex items-center justify-center shadow-inner">
            <span className="text-6xl font-bold text-sky-600">
                {score}
            </span>
        </div>
    </div>

    {/* Buttons */}
    <div className="flex gap-4 mt-8 w-full">
        <button
            className="flex-1 bg-sky-500 hover:bg-sky-600
            text-white font-bold py-3 rounded-xl
            transition-all duration-300" onClick={()=> reinitialize()}>
            Retry
        </button>

        <button
            className="flex-1 bg-green-500 hover:bg-green-600
            text-white font-bold py-3 rounded-xl
            transition-all duration-300">
            Share
        </button>
    </div>
</div>
        }
      </div>
    </>
  )
}

export default App
