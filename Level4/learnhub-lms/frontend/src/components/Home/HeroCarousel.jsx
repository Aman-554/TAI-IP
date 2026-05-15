import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroCarousel = () => {
  const navigate = useNavigate();
  
  const slides = [
    {
      title: "Start Your MERN Journey",
      description: "Master Full Stack Development with our structured roadmap",
      buttonText: "Enroll Now",
      buttonAction: () => navigate('/roadmaps?category=MERN'),
      bgColor: "from-blue-600 to-purple-600"
    },
    {
      title: "Become a Software Engineer",
      description: "Follow our comprehensive learning path to success",
      buttonText: "Explore Roadmap",
      buttonAction: () => navigate('/roadmaps'),
      bgColor: "from-green-600 to-teal-600"
    },
    {
      title: "Master DSA Step by Step",
      description: "Crack coding interviews with our DSA roadmap",
      buttonText: "Start Learning",
      buttonAction: () => navigate('/roadmaps?category=DSA'),
      bgColor: "from-orange-600 to-red-600"
    }
  ];

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="h-[500px] rounded-xl"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className={`bg-gradient-to-r ${slide.bgColor} h-full rounded-xl flex items-center justify-center`}>
            <div className="text-center text-white px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">{slide.title}</h1>
              <p className="text-xl md:text-2xl mb-8">{slide.description}</p>
              <button
                onClick={slide.buttonAction}
                className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
              >
                {slide.buttonText}
              </button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousel;