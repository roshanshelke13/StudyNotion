import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react"
import Courses from './Courses'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { FreeMode, Navigation, Pagination,Mousewheel, Keyboard } from "swiper/modules"


const CourseSlider = ({courses}) => {
  return (
    <div className="relative">
        {
            courses?.length ? (
                <Swiper
                    slidesPerView={1}
                    spaceBetween={25}
                    loop={true}
                    // cssMode={true}
                    navigation = {true}
                    pagination={{ clickable: true }}
                    keyboard={true}
                    modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                    breakpoints={{
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    className="max-h-[30rem] custom-swiper "
                >
                    {courses.map((course, i) => (
                        <SwiperSlide key={i}>
                            <Courses course={course} Height={"h-[250px]"} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <p>No Course Found</p>
            )
        }
    </div>
  )
}

export default CourseSlider
