import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const slides = [
    {
        id: 1,
        title: "Mr. Akhil Sharma",
        description: "A place where ideas turn into reality.",
        image: "../../public/aditya.jpg",
    },
    {
        id: 2,
        title: "Ms. Ritu Malik",
        description: "Work together and grow your skills.",
        image: "../../public/mardav.jpg",
    },
    {
        id: 3,
        title: "Mr. Rajesh Yadav",
        description: "Resources & support for student success.",
        image: "../../public/vikash.jpg",
    },
    {
        id: 4,
        title: "Mr. Dilip ",
        description: "Stay updated with latest advancements.",
        image: "../../public/aditya.jpg",
    },
    {
        id: 5,
        title: "Mr. Nitin Yadav",
        description: "Build strong professional connections.",
        image: "../../public/mardav.jpg",
    },
    {
        id: 6,
        title: "Ms. Munesh Yadav",
        description: "Opportunities to shape your future.",
        image: "../../public/vikash.jpg",
    },
];

function PauseOnHover() {
    var settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };

    return (
        <div className="md:max-w-[90%] mx-auto md:p-4">
            <style>
                {`
                    .slick-dots li button:before {
                        color: gray !important;
                    }
                    .slick-dots li.slick-active button:before {
                        color: gray !important;
                    }

                    .slick-prev, .slick-next {
                        color: gray !important;
                    }
                    .slick-prev:before, .slick-next:before {
                        color: gray !important; 
                    }
                `}
            </style>
            <Slider {...settings}>
                {slides.map((slide) => (
                    <div key={slide.id} className="md:p-4 p-1">
                        <div className="bg-primary/20 overflow-hidden rounded-lg">
                            <img src={slide.image} alt={slide.title} className="w-full md:h-60 md:p-6 p-2 md:rounded-[13%] rounded-2xl"/>
                            <div className="md:p-4 p-2 text-center">
                                <h3 className="md:text-lg font-bold">{slide.title}</h3>
                                <p className="md:text-sm text-xs mt-2">{slide.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default PauseOnHover;
