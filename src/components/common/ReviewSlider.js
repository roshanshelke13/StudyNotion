import React, { useEffect, useState } from 'react'
import { apiConnector } from '../../services/apiconnector'
import { ratingsEndpoints } from '../../services/apis'
import { Swiper, SwiperSlide } from 'swiper/react'
import ReactStars from 'react-rating-stars-component'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import '../../App.css'

// Icons
import { FaStar } from 'react-icons/fa'

// Swiper modules
import { Autoplay, FreeMode, Pagination } from 'swiper/modules'

const ReviewSlider = () => {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      const response = await apiConnector('GET', ratingsEndpoints.REVIEWS_DETAILS_API)
      if (response?.data?.success) {
        setReviews(response?.data?.data)
      }
    })()
  }, [])

  return (
    <div className="text-white px-4">
      <div className="my-[50px] max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          spaceBetween={25}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full"
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 1.2,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index} className="!min-w-[270px] h-full">
              <div className="flex flex-col gap-3 bg-richblack-800 p-4 text-[14px] text-richblack-25 rounded-md h-full">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <h1 className="font-semibold text-richblack-5 truncate">
                      {`${review?.user?.firstName || ''} ${review?.user?.lastName || ''}`}
                    </h1>
                    <h2 className="text-[12px] font-medium text-richblack-500 truncate">
                      {review?.course?.courseName || 'Course'}
                    </h2>
                  </div>
                </div>

                <p className="font-medium text-richblack-25 line-clamp-3">
                  {review?.review?.split(' ').length > truncateWords
                    ? `${review.review.split(' ').slice(0, truncateWords).join(' ')} ...`
                    : `${review?.review}`}
                </p>

                <div className="flex items-center gap-2 mt-auto">
                  <h3 className="font-semibold text-yellow-100">{review.rating.toFixed(1)}</h3>
                  <ReactStars
                    count={5}
                    value={review.rating}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider
