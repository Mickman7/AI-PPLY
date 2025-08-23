import React from 'react'

const LandingPage = () => {
  return (
    <>
        {/* hero section */}
        <div className='p-12 m-4 bg-[linear-gradient(110.48deg,#F1F7FEFF_0%,#E6FFFB4D_100%)] flex justify-evenly'>
            <div>
                <h1 className='mb-16 font-bold'>Land your dream job with <br />AI-powered resume matching</h1>
                <p>AI-PPLY empowers you to optimize your applications by providing in-depth analysis of your resume against job descriptions, identifying key strengths and areas for improvement.</p>
                <button className='mt-4'>Get Started</button>
            </div>
            <div className='w-auto'>
                <img src="https://www.proserveit.com/hubfs/AI%20Infra%20feature%20image-1.png" alt="hero image" className='w-[800px] h-[600] rounded'/>
            </div>
        </div>

        {/* Instruction section */}
        <div className=' p-12 m-4'>
            <h2 className='text-center font-bold text-2xl mb-10'>How AI-PPLY Works</h2>
            <div className='flex justify-evenly gap-4'>
                <div className='border-1 rounded p-4 m-2 w-96 flex flex-col justify-evenly gap-2'>
                    <img src="https://www.iconpacks.net/icons/2/free-file-icon-1453-thumb.png" alt="file" className='w-12'/>
                    <p className='font-semibold text-xl'>Upload your documents</p>
                    <p>Seamlessly upload your resume and any job description. Our system supports various formats including PDF and DOCX.</p>
                </div>
                <div className='border-1 rounded p-4 m-2 w-96 flex flex-col justify-evenly gap-2'>
                    <img src="https://www.iconpacks.net/icons/2/free-file-icon-1453-thumb.png" alt="file" className='w-12'/>
                    <p className='font-semibold text-xl'>AI-Powered Analysis</p>
                    <p>Our advanced AI algorithms meticulously compare your skills and experience with the job requirements, providing a comprehensive match score.</p>
                </div>
                <div className='border-1 rounded p-4 m-2 w-96 flex flex-col justify-evenly gap-2'>
                    <img src="https://www.iconpacks.net/icons/2/free-file-icon-1453-thumb.png" alt="file" className='w-12'/>
                    <p className='font-semibold text-xl'>Personalized Insights</p>
                    <p>Receive actionable feedback on skill gaps, keyword optimization, and tailored suggestions to enhance your application's effectiveness.</p>
                </div>
            </div>
        </div>

        {/* Review Section */}
        <div className='p-12 m-4'>
        <h2 className='text-center font-bold text-2xl mb-10'>What Other Users Said</h2>
            <div className='flex justify-evenly gap-2'>
                <div className='border-1 rounded p-4 m-2 w-[600px] flex flex-col '>
                    <div className='flex flex-row gap-1'>
                        <img src="https://pdaphotography.com/wp-content/uploads/2018/07/PD4_8636-Edit-384x576.jpg" alt="file" className='w-12 h-12 rounded-full'/>
                        <div>
                            <p className='text-sm font-semibold'>Sarah Brown</p>
                            <p className='text-sm'>Marketing Specialist</p>
                        </div>
                    </div>
                    <p>"AI-PPLY helped me tailor my resume perfectly for my dream job. The insights were invaluable, and I got an interview within days!"</p>
                </div>
                <div className='border-1 rounded p-4 m-2 w-[600px] flex flex-col justify-evenly gap-2'>
                    <div className='flex flex-row gap-1'>
                        <img src="https://pdaphotography.com/wp-content/uploads/2018/07/PD4_8636-Edit-384x576.jpg" alt="file" className='w-12 h-12 rounded-full'/>
                        <div>
                            <p className='text-sm font-semibold'>Sarah Brown</p>
                            <p className='text-sm'>Marketing Specialist</p>
                        </div>
                    </div>
                    <p>"The job description matching feature is a game-changer. It highlights exactly what I need to adjust, saving me so much time and effort."</p>
                </div>
            </div>
        </div>


        <div className='p-4 m-4'>
            <div className='p-4 rounded bg-[#1570D1FF] w-auto h-46 flex flex-col justify-center items-center'>
                <h1 className='text-white font-bold'>Ready to supercharge your job search?</h1>
                <button className='rounded-full px-8 py-2 mt-8 bg-white font-semibold'>Start Optimising Today</button>
            </div>
        </div>


        <footer className='mx-12 my-4 flex justify-between'>
            <div className='flex gap-2'>
                <a href="#">Product</a>
                <a href="#">Resources</a>
                <a href="#">Company</a>
            </div>
            <div className='flex gap-2'>
                <a href="#">LinkedIn</a>
                <a href="#">Instagram</a>
                <a href="#">Twitter</a>
            </div>
        </footer>
    </>
  )
}

export default LandingPage