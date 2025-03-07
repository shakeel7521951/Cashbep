import React from 'react'

function About() {
  return (
    <div>
     <section>
     <p className='text-[60px] font-bold text-center text-blue-950 mb-[20px]'><span className='text-red-700'>C</span>ashBep</p>
    <div className="w-full max-w-lg mx-auto px-4 mb-28 flex c flex-col">
        <h1 className="text-3xl font-bold mb-4 text-center uppercase">Welcome</h1>
        <p className=" mb-2 text-center uppercase">You are lucky You joined CashBeP </p>
        <p className="te mb-2 text-center uppercase">Now you are part of our team. It's our responsibility to give you good earnings, but for earning, you work as part of us.</p>
        <h2 className="text-2xl mb-2 font-semibold text-center uppercase mt-4">Exciting Opportunity!</h2>
        <p className="te mb-2 text-center uppercase">Members who join 50 members in a month will be entered into a draw and get a chance to win 10 grand prizes, including:</p>
        <ul className="list-disc list-inside uppercase mb-4 ml-6">
            <li>Bikes</li>
            <li>Cash Prize</li>
            <li>Android Phones</li>
            <li>Other prizes</li>
        </ul>
        <p className=" text-center uppercase">The draw will be held at the end of every month.</p>
    </div>
</section>
    </div>
  )
}

export default About
