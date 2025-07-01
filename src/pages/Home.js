import React from 'react'
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import HighlightText from '../components/core/homepage/HighlightText';
import Button from '../components/core/homepage/Button';
import Banner from '../assets/Images/banner.mp4';
import CodeBlocks from '../components/core/homepage/CodeBlocks';
import TimelineSection from '../components/core/homepage/TimelineSection';
import LearningLanguageSection from '../components/core/homepage/LearningLanguageSection';
import InstructorSection from '../components/core/homepage/InstructorSection';
import Footer from '../components/common/Footer';
import ExploreMore from '../components/core/homepage/ExploreMore';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/operations/authAPI';
import ReviewSlider from '../components/common/ReviewSlider';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  return (
    <div>
      {/* SECTION 1 */}
      <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent gap-8 items-center text-white justify-between'>

        <Link to={"/signup"}>

            <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all
            duration-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] hover:scale-95 hover:drop-shadow-none'>
            {/* HW:- ADD shadow to the button*/ }

                <div className='flex items-center gap-2 rounded-full px-10 py-[5px] transition-all
            duration-200 group-hover:bg-richblack-900'>
                    <p>Become an Instructor</p>
                    <FaArrowRight></FaArrowRight>
                </div>

            </div>

        </Link>

        <div className="text-center text-4xl mt-7 font-semibold bg-richblack-900"> 
            Empower Your Future with
            <HighlightText text={"Coding Skills"}></HighlightText>
        </div>

        <div className='-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300 '>
            With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
        </div>

        <div className='flex flex-row gap-7 mt-8'>
            <Button active={true} linkto={"/signup"}>
                Learn More
            </Button>

            <Button active={false} linkto={"/login"}>
                Book a Demo
            </Button> 
        </div>

        <div className='mx-3 my-7 shadow-[-8px_-5px_50px_-5px] shadow-blue-200'>
            <video muted loop autoPlay className='shadow-[20px_20px_0px_0px_rgba(255,255,255)]'>
              <source src={Banner} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
        </div>

        <div>
          <CodeBlocks position={"lg:flex-row"}
            heading={
              <div className='text-4xl font-semibold'>
                  Unlock your
                  <HighlightText text={"coding potential "}/>
                  with our online courses.
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            btn1={"Try it Yourself"}
            btn2={"Learn More"}
            codeblock={`<!DOCTYPE html>\n<html lang="en">\n<head>\n<title>This is my Page</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav><a href="/one">One</a> <a\nhref="/two">Two</a><a href="/three">Three</a>\n</nav>\n</body>`}
            codeColor={"text-yellow-25"}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
            />
        </div>

        <div>
          <CodeBlocks position={"lg:flex-row-reverse"}
            heading={
              <div className='text-4xl font-semibold'>
                  Start
                  <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            btn1={"Continue Lesson"}
            btn2={"Learn More"}
            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            codeColor={"text-white"}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
            />
        </div>

        <ExploreMore/>

      </div> 

 
      {/* SECTION 2 */}
      <div className='bg-pure-greys-5 text-richblack-700'>

            <div className='homepage_bg h-[320px]'>

                <div className='w-11/12 max-w-maxContent flex-col flex justify-between items-center gap-8 mx-auto'>  

                    <div className='h-[150px]'></div>

                    <div className='flex flex-row gap-7 text-white lg:mt-8'>
                        <Button active={true} linkto={"/signup"}>
                            <div className='flex items-center gap-3'>
                                Explore Full Catalog
                                <FaArrowRight/>
                            </div>
                        </Button>

                        <Button active={false} linkto={"/login"}>
                          <div>Learn More</div>
                        </Button>
                    </div>

                </div>

            </div>

            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-8'>
               
                <div className='flex flex-col mt-[-100px] justify-between gap-7 mb-10 lg:mt-20 lg:flex-row lg:gap-0 '>

                    <div className='text-4xl font-semibold lg:w-[45%]'>
                        Get the skills you need for a <HighlightText text={"job that is in demand"}/>
                    </div>

                    <div className='flex flex-col items-start gap-10 lg:w-[40%]'>
                       <div className='text-[16px]'>
                            The modern StudyNotion is the dictates its own terms. Today, to be a competitive
                             specialist requires more than professional skills.
                       </div>

                       <Button active={true} linkto={"/signup"}>Learn More</Button>
                    </div>

                </div>

                <TimelineSection></TimelineSection>
                <LearningLanguageSection/>
            </div>

      </div>


      {/* SECTION 3 */}

      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">

          <InstructorSection></InstructorSection>

          {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider/>       

      </div> 

      {/* <button className='w-20 h-20 bg-yellow-5' onClick={dispatch(logout(navigate))}>click me</button> */}
      {/* SECTION 4 */}
      <Footer/>

    </div>
  )
}

export default Home;  