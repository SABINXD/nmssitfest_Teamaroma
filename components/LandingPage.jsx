

'use client'
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect } from "react";
import { useRef } from "react";


const LandingPage = () => {
    const router = useRouter();
    const navRef = useRef(null);
    const btnWrapperNav = useRef(null);
    const trustedBoxWrapper = useRef(null);
    const revolutionTxtWrapper = useRef(null);
    const bothWrapper = useRef(null);
    const featuresTitle = useRef(null);
    const featuresWrapper = useRef(null);
    const whyToChoose = useRef(null);
    const trustedBy = useRef(null);
    const readyToUse = useRef(null);
    const footer = useRef(null);
    const div1 = useRef(null);
    const div2 = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
    }, []);

    useEffect(() => {

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: footer.current,
                start: 'top bottom', // when the top of the trigger hits the top of the viewport
                end: '+=200', // end after scrolling 500px beyond the start
            }
        });

        tl.from(footer.current, {
            opacity: 0,
            y: 200,
            stagger: 0.3,
            duration: 1,
            ease: "power3.out",
        });

        return () => {
            tl.kill(); // stops animation and frees memory
        };

    }, []);

    useEffect(() => {


        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: readyToUse.current,
                start: 'top 90%', // when the top of the trigger hits the top of the viewport
                end: '+=200', // end after scrolling 500px beyond the start
            }
        });

        tl.from(readyToUse.current, {
            opacity: 0,
            y: 200,
            stagger: 0.3,
            duration: 1,
            ease: "power3.out",
        });

        return () => {
            tl.kill(); // stops animation and frees memory
        };

    }, []);

    useEffect(() => {


        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: trustedBy.current,
                start: 'top 90%', // when the top of the trigger hits the top of the viewport
                end: '+=200', // end after scrolling 500px beyond the start
            }
        });

        tl.from(trustedBy.current, {
            opacity: 0,
            y: 200,
            stagger: 0.3,
            duration: 1,
            ease: "power3.out",
        });

        return () => {
            tl.kill(); // stops animation and frees memory
        };

    }, []);

    useEffect(() => {


        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: whyToChoose.current,
                start: 'top 90%', // when the top of the trigger hits the top of the viewport
                end: '+=200', // end after scrolling 500px beyond the start
            }
        });

        tl.from(whyToChoose.current, {
            opacity: 0,
            y: 200,
            stagger: 0.3,
            duration: 1,
            ease: "power3.out",
        });

        tl.from(div1.current, {
            opacity: 0,
            y: 200,
            duration: 0.5,
            ease: "power3.out",
        })

        tl.from(div2.current, {
            opacity: 0,
            y: 200,
            duration: 0.5,
            ease: "power3.out",
        })

        return () => {
            tl.kill(); // stops animation and frees memory
        };

    }, []);

    useEffect(() => {


        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: featuresWrapper.current,
                start: 'top 90%', // when the top of the trigger hits the top of the viewport
                end: '+=500', // end after scrolling 500px beyond the start
            }
        });

        tl.from(featuresWrapper.current.querySelectorAll('div'), {
            opacity: 0,
            y: 200,
            stagger: 0.3,
            duration: 1,
            ease: "power3.out",
        });

        return () => {
            tl.kill(); // stops animation and frees memory
        };

    }, []);

    useEffect(() => {


        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: featuresTitle.current,
                start: 'top 90%', // when the top of the trigger hits the top of the viewport
                end: '+=500', // end after scrolling 500px beyond the start
            }
        });


        tl.from(featuresTitle.current, {
            opacity: 0,
            y: 200,
            duration: 1,
            ease: "power3.out",
        });

        return () => {
            tl.kill(); // stops animation and frees memory
        };

    }, []);

    useEffect(() => {


        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: bothWrapper.current,
                start: 'top 90%', // when the top of the trigger hits the top of the viewport
                end: '+=500', // end after scrolling 500px beyond the start
            }
        });


        tl.from(trustedBoxWrapper.current, {
            opacity: 0,
            y: 200,
            duration: 1,
            ease: "power3.out",
        });

        return () => {
            tl.kill(); // stops animation and frees memory
        };

    }, []);

    useEffect(() => {

        const tl = gsap.timeline();

        tl.from(navRef.current, {
            opacity: 0,
            y: -200,
            duration: 0.8,
            ease: "power3.out",
        });

        tl.from(navRef.current.querySelector("h3"), {
            opacity: 0,
            y: 300,
            duration: 0.5,
            ease: "power3.out",
        });


        return () => {
            tl.kill(); // stops animation and frees memory
        };

    }, []);

    useEffect(() => {

        const tl = gsap.timeline();

        tl.from(revolutionTxtWrapper.current, {
            opacity: 0,
            y: 200,
        })



        return () => {
            tl.kill(); // stops animation and frees memory
        };

    }, []);

    const detail = [
        {
            id: '1',
            heading: "Real-time tracking",
            content: "Monitor blood inventory levels, expiration dates, and donation schedules in real-time across all locations.",
        },
        {
            id: '2',
            heading: "Donor management",
            content: "Comprehensive donor database with eligibility tracking, appointment scheduling, and communication tools.",
        },
        {
            id: '3',
            heading: "Compliance Ready",
            content: "Built-in compliance with FDA, AABB, and international blood banking regulations and standards.",
        },
        {
            id: '4',
            heading: "Advance Analytics",
            content: "Powerful insights and reporting to optimize operations, predict demand, and reduce wastage.",
        },
        {
            id: '5',
            heading: "Expiry Management",
            content: "Automated alerts for blood product expiration with smart rotation and distribution recommendations.",
        },
        {
            id: '6',
            heading: "Fast Processing",
            content: "Streamlined workflows for blood collection, testing, processing, and distribution.",
        },
        {
            id: '7',
            heading: "Secure Storage",
            content: "Enterprise-grade security with HIPAA compliance and encrypted data storage.",
        },
        {
            id: '8',
            heading: "Smart Notifications",
            content: "Automated alerts for critical events, low inventory, and urgent blood requests.",
        },
    ];


    return (
        <>

            <div className="landing">
                <div ref={navRef} className="w-full overflow-hidden text-white flex items-center justify-between  backdrop-blur-md  px-8 py-4 shadow-lg fixed top-0 z-50">
                    {/* Logo */}
                    <h3 className="text-2xl font-bold tracking-wide select-none cursor-pointer">
                        Blood <span className="text-red-500">Flow</span>
                    </h3>


                    {/* Buttons (Desktop) */}
                    <div ref={btnWrapperNav} className="hidden md:flex justify-center items-center space-x-4">
                        <button onClick={() => { router.replace('/login') }} className="bg-red-500 hover:bg-red-600 transition-all duration-300 block text-white px-5 py-2 rounded-lg font-semibold shadow-sm hover:shadow-lg">
                            Sign In
                        </button>
                        <button onClick={() => { router.replace('/register') }} className="bg-red-500 hover:bg-red-600 transition-all duration-300 block text-white px-5 py-2 rounded-lg font-semibold shadow-sm hover:shadow-lg">
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Menu Icon */}
                    <div className="md:hidden relative">
                        <button className="focus:outline-none p-4 rounded-md hover:bg-red-700 transition-colors duration-300">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>


                <div className="w-full bg-[#210f04]">
                    <div ref={revolutionTxtWrapper} className="w-full h-full flex flex-col items-center justify-center px-6 py-30 text-center space-y-6 backdrop-blur-sm text-white">

                        <h3 className="text-red-500 text-lg font-semibold animate-pulse">
                            🔴 Next-generation blood management
                        </h3>

                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
                            Revolutionizing <span className="text-red-500">Blood Management</span> Software
                        </h1>

                        {/* Subtext */}
                        <p className="text-red-200 max-w-2xl text-lg md:text-xl">
                            Streamline blood bank operations, track donations in real-time, and save more lives with our comprehensive blood management platform.
                        </p>

                    </div>
                </div>

                <div ref={bothWrapper} className="w-full bg-[#210f04] text-white py-16 px-8">

                    <div ref={trustedBoxWrapper} className="text-center mb-12">
                        <h3 className="text-2xl md:text-3xl font-bold mb-6">Trusted by leading blood banks worldwide</h3>
                        <div className="flex flex-wrap justify-center gap-8">
                            <span className="bg-red-700 block text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300 cursor-pointer">
                                RedCross+
                            </span>
                            <span className="bg-red-700 block text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300 cursor-pointer">
                                LifeBlood
                            </span>
                            <span className="bg-red-700 block text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300 cursor-pointer">
                                VitalBank
                            </span>
                        </div>
                    </div>

                    {/* Features Heading */}
                    <div ref={featuresTitle} className="text-center mb-12 relative">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                            Powerful <span className="text-red-500">Features</span>
                        </h1>
                        <h3 className="text-lg md:text-xl text-red-200">
                            Everything you need to run blood bank operations efficiently and save more lives
                        </h3>
                    </div>

                    {/* Features Cards */}
                    <div ref={featuresWrapper} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {detail.map((item) => (
                            <div
                                key={item.id}
                                className="bg-[#230c0f] rounded-xl p-6 shadow-lg hover:shadow-[0_2px_10px_#ef5b5b] transition-shadow duration-300"
                            >
                                <h2 className="text-xl font-bold mb-3 text-[#fff]">{item.heading}</h2>
                                <p className="text-red-200">{item.content}</p>
                            </div>
                        ))}
                    </div>

                </div>


                <div className="w-full bg-[#210f04] text-white py-16 px-8">

                    <div ref={whyToChoose} className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div ref={div1} className="space-y-6">
                            <h1 className="text-4xl md:text-5xl font-extrabold">
                                Why Choose <span className="text-red-500">BloodFlow</span>?
                            </h1>
                            <p className="text-red-200 text-lg">
                                BloodFlow is the most comprehensive blood bank management software designed for modern healthcare facilities. Our platform combines cutting-edge technology with intuitive design to help you save more lives.
                            </p>
                            <ul className="space-y-2 text-red-300 font-semibold">
                                <li>✔️ Reduce blood wastage by up to 40%</li>
                                <li>✔️ Increase donor retention rates</li>
                                <li>✔️ Streamline regulatory compliance</li>
                                <li>✔️ Seamless integration with lab systems</li>
                                <li>✔️ 24/7 real-time inventory visibility</li>
                            </ul>
                        </div>

                        {/* Right Content */}
                        <div ref={div2} className="bg-red-900 rounded-xl shadow-lg p-8">

                            <div className="grid grid-cols-3 gap-6 text-center mb-8">
                                <div className="bg-red-800 rounded-lg p-4 hover:bg-red-700 transition-all duration-300">
                                    <h2 className="text-3xl font-bold text-[#fff]">2.5K</h2>
                                    <p className="text-red-200">Units</p>
                                </div>
                                <div className="bg-red-800 rounded-lg p-4 hover:bg-red-700 transition-all duration-300">
                                    <h2 className="text-3xl font-bold text-[#fff]">98%</h2>
                                    <p className="text-red-200">Uptime</p>
                                </div>
                                <div className="bg-red-800 rounded-lg p-4 hover:bg-red-700 transition-all duration-300">
                                    <h2 className="text-3xl font-bold text-[#fff]">24/7</h2>
                                    <p className="text-red-200">Support</p>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="flex justify-between items-end h-32 gap-2">
                                <div className="w-1/6 bg-red-600 rounded-t-xl h-20 hover:h-28 transition-all duration-300"></div>
                                <div className="w-1/6 bg-red-500 rounded-t-xl h-24 hover:h-28 transition-all duration-300"></div>
                                <div className="w-1/6 bg-red-400 rounded-t-xl h-16 hover:h-28 transition-all duration-300"></div>
                                <div className="w-1/6 bg-red-500 rounded-t-xl h-28 hover:h-28 transition-all duration-300"></div>
                                <div className="w-1/6 bg-red-600 rounded-t-xl h-20 hover:h-28 transition-all duration-300"></div>
                                <div className="w-1/6 bg-red-700 rounded-t-xl h-24 hover:h-28 transition-all duration-300"></div>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="w-full bg-[#210f04] text-white py-16 px-8">
                    {/* Trusted Section */}
                    <div ref={trustedBy} className="max-w-6xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-5xl font-extrabold">
                            Trusted By <span className="text-red-500">Healthcare Leaders</span>
                        </h1>
                        <p className="text-red-200 text-lg md:text-xl">
                            Join hundreds of blood banks worldwide that trust BloodFlow to manage their critical operations.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
                            <div className="bg-red-900 rounded-xl shadow-lg p-6 flex flex-col items-center hover:bg-red-800 transition-all duration-300">
                                <h4 className="text-white text-4xl font-bold">500+</h4>
                                <span className="text-red-200 font-semibold mt-2 text-center">BLOOD BANKS</span>
                            </div>

                            <div className="bg-red-900 rounded-xl shadow-lg p-6 flex flex-col items-center hover:bg-red-800 transition-all duration-300">
                                <h4 className="text-white text-4xl font-bold">2M+</h4>
                                <span className="text-red-200 font-semibold mt-2 text-center">DONATIONS TRACKED</span>
                            </div>

                            <div className="bg-red-900 rounded-xl shadow-lg p-6 flex flex-col items-center hover:bg-red-800 transition-all duration-300">
                                <h4 className="text-white text-4xl font-bold">99.9%</h4>
                                <span className="text-red-200 font-semibold mt-2 text-center">UPTIME</span>
                            </div>

                            <div className="bg-red-900 rounded-xl shadow-lg p-6 flex flex-col items-center hover:bg-red-800 transition-all duration-300">
                                <h4 className="text-white text-4xl font-bold">50+</h4>
                                <span className="text-red-200 font-semibold mt-2 text-center">COUNTRIES</span>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="w-full bg-[#210f04] text-white py-24 px-6">
                    <div ref={readyToUse} className="max-w-4xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-5xl font-extrabold">
                            Ready to Transform your <span className="text-red-500">Blood Bank Operations</span>?
                        </h1>
                        <p className="text-red-200 text-lg md:text-xl">
                            Start your free trial and see how BloodFlow can help you save more lives while reducing costs and improving efficiency.
                        </p>



                        <p className="text-red-300 text-sm md:text-base mt-4">
                            No credit card required • 14-days free trial • Full features access
                        </p>
                    </div>
                </div>


                <div className="w-full bg-red-950 text-red-100 py-10 px-6 relative border-t-2 border-white">
                    <div ref={footer} className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

                        {/* Logo */}
                        <div className="text-2xl font-bold text-white">
                            Blood<span className="text-red-500">Flow</span>
                        </div>

                        {/* Footer Links */}
                        <div className="flex space-x-6 text-red-300 font-medium">
                            <a href="#" className="hover:text-white transition-colors duration-300">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors duration-300">Terms</a>
                            <a href="#" className="hover:text-white transition-colors duration-300">Contact</a>
                        </div>

                        {/* Copyright */}
                        <p className="text-red-400 text-sm md:text-base text-center md:text-right">
                            © {new Date().getFullYear()} BloodFlow. All rights reserved.
                        </p>

                    </div>
                </div>

            </div>

        </>
    );
};


export default LandingPage