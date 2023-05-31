<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="google-site-verification" content="ZdJ5b2sR2SV3GBeoIC67AASBaLjZBwX84UbZ2p3ayvw" />

        <title>EssayWeavers - Professional and quality tutoring services</title>

        <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
        <link href="{{ asset('css/main.css').'?v=1' }}" rel="stylesheet">
        <link href="{{ asset('css/home.css').'?v=1' }}" rel="stylesheet">

        <style>
        </style>
    </head>
    <body>

        <nav class="top-navbar navbar navbar-expand-md navbar-light">
            <div class="container-fluid">
                <button class="navbar-toggler menu-button text-default mr-3" onclick="$('.sidebar').toggleClass('open')">
                    <span class="fa fa-bars"></span>
                </button>

                <a class="navbar-brand mr-auto" href="{{ url('/') }}">
                    <img class="app-logo" src="{{ asset('img/logo.png') }}" alt="{{ config('app.name') }}" >
                </a>

                <div class="d-flex align-items-center ml-auto py-3">
                    <a class="btn btn-success btn-rounded px-4 shadow-none ml-auto" href="{{ url('/writer') }}">
                        <i class="fa fa-user-o mr-2"></i>{{ auth('writer')->check() ? 'Account':'Log In' }}
                    </a>
                </div>
            </div>
        </nav>

        <section class="hero">

            <div class="">

                <div class="container">
                    <div class="row d-flex align-items-center">

                        <div class="col-lg-6 py-5">

                            <h4 class="heading text-success mb-3">Welcome to {{ config('app.name') }}</h4>

                            <h3 class="display-3 text-uppercase lh-120">Verified, experienced professional tutors on demand</h3>

                            <p class="lead mb-4">
                                We are ready to help you excel in your assignments.
                                We deliver quality and timely work relieving you
                                from unnecessary worries about your work
                            </p>

                            <a href="{{ url('/writer') }}" class="btn btn-success px-3 shadow-none">Get Started</a>
                            <button class="btn btn-link px-3 shadow-none" onclick="document.querySelector('.why-us-start').scrollIntoView({behavior: 'smooth'})">Learn More</button>

                        </div>

                        <div class="col-lg-6 py-5">
                            <img class="img-fluid hero-img" src="{{ asset('img/hero.png') }}" alt="Student assignment">
                        </div>

                    </div>
                </div>

            </div>

        </section>

        <section class="section why-us pb-5">

            <div class="container">
                <div class="row d-flex align-items-center">
                    <div class="col-lg-5">
                        <img class="why-us-context-img" src="{{ asset('img/student.png') }}" alt="Student assignment">
                    </div>

                    <div class="col-lg-7">

                        {{-- CONTENT --}}
                        <div class="row">

                            <div class="col-lg-6 mb-4 why-us-start">
                                <div class="why-us-item text-center">
                                    <div class="mb-3">
                                        <img class="why-us-img" src="{{ asset('img/icons/timely.png') }}" alt="Speedy Delivery">
                                    </div>

                                    <h3 class="mb-3 text-center font-weight-600 heading-title text-success">Timely Delivery</h3>

                                    <div class="text">
                                        Whether you need the assignment in an hour, a day
                                        or a month, you'll get it before that deadline elapses
                                    </div>

                                </div>
                            </div>

                            <div class="col-lg-6 h-100 mb-4">
                                <div class="why-us-item text-center">
                                    <div class="mb-3">
                                        <img class="why-us-img" src="{{ asset('img/icons/quality_assured.png') }}" alt="Speedy Delivery">
                                    </div>

                                    <h3 class="mb-3 text-center font-weight-600 heading-title text-success">Quality Always</h3>

                                    <div class="text">
                                        We have a network of verified writers with lots of experience
                                        in different subjects who will provide outstanding solutions
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6 h-100 mb-4">
                                <div class="why-us-item text-center">
                                    <div class="mb-3">
                                        <img class="why-us-img" src="{{ asset('img/icons/costs.png') }}" alt="Speedy Delivery">
                                    </div>

                                    <h3 class="mb-3 text-center font-weight-600 heading-title text-success">Cost Effective</h3>

                                    <div class="text">
                                        Our pricing model is carefully crafted to
                                        ensure that you only pay for the amount of work and
                                        conditions under which the work has been done
                                    </div>

                                </div>
                            </div>

                            <div class="col-lg-6 h-100 mb-4">
                                <div class="why-us-item text-center">
                                    <div class="mb-3">
                                        <img class="why-us-img" src="{{ asset('img/icons/multiple.png') }}" alt="Speedy Delivery">
                                    </div>

                                    <h3 class="mb-3 text-center font-weight-600 heading-title text-success">Multiple Orders</h3>

                                    <div class="text">
                                        We have a lot of writers, our platform allows you
                                        to submit multiple orders, which are quickly assigned
                                        to the best writers available
                                    </div>

                                </div>
                            </div>

                        </div>
                        {{-- END CONTENT --}}

                    </div>
                </div>

            </div>
        </section>

        <section class="section-shaped numbers py-5">
            <div class="shape shape-dark shape-style-1">
                <span class="shape-50"></span>
                <span class="shape-100"></span>
                <span class="shape-150"></span>
                <span class="shape-50"></span>
                <span class="shape-200"></span>
                <span class="shape-50"></span>
                <span class="shape-150"></span>
            </div>
            <div class="container">
                <div class="row">

                    <div class="col-lg-3">
                        <div class="number-item text-center">
                            <div class="number">
                                450+
                            </div>
                            <div class="text">
                                Writers
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-3">
                        <div class="number-item text-center">
                            <div class="number">
                                10+
                            </div>
                            <div class="text">
                                Subjects
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-3">
                        <div class="number-item text-center">
                            <div class="number">
                                12000+
                            </div>
                            <div class="text">
                                Orders Done
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-3">
                        <div class="number-item text-center">
                            <div class="number">
                                4.9
                            </div>
                            <div class="text">
                                Student Rating
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>

        {{-- How it works --}}
        <section class="section how-it-works py-5">
            <div class="container">

                <h4 class="section-title display-3 text-uppercase text-center">How it Works</h4>

                <span class="sep bg-danger mx-auto my-5"></span>

                <div class="row">

                    <div class="col-lg-4 mb-4 mb-lg-0">
                        <div class="how-it-works-item text-center">
                            <div class="mb-4">
                                <img class="how-it-works-img" src="{{ asset('img/icons/submit_assignment.png') }}" alt="Speedy Delivery">
                            </div>

                            <h3 class="text-center font-weight-600 heading-title mb-4">Submit Order</h3>

                            <div class="text">
                                Submit your assignment, providing details, requirements and attach any relevant files
                            </div>

                            <div class="action">
                                <a href="#" class="btn btn-outline-success shadow-none">Submit Order</a>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4 mb-4 mb-lg-0">
                        <div class="how-it-works-item text-center">
                            <div class="mb-4">
                                <img class="how-it-works-img" src="{{ asset('img/icons/payment.png') }}" alt="Speedy Delivery">
                            </div>

                            <h3 class="text-center font-weight-600 heading-title mb-4">Make Payment</h3>

                            <div class="text">
                                Make a secure payment for your order and wait for your order to be assigned to the next available writer
                            </div>

                            <div class="action">
                                <a href="#" class="btn btn-outline-success shadow-none">Submit Order</a>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4 mb-4 mb-lg-0">
                        <div class="how-it-works-item text-center">
                            <div class="mb-4">
                                <img class="how-it-works-img" src="{{ asset('img/icons/download_assignment.png') }}" alt="Speedy Delivery">
                            </div>

                            <h3 class="text-center font-weight-600 heading-title mb-4">Get Help</h3>

                            <div class="text">
                                Engage with us as your assignment is done. Download your completed assignment which is ready for submission
                            </div>

                            <div class="action">
                                <a href="#" class="btn btn-outline-success shadow-none">Submit Order</a>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>

        <footer class="footer">
            <div class="container">
                <div class="row row-grid align-items-center">
                    <div class="col-lg-6">
                        <h3 class="text-primary display-4 font-weight-light mb-2">Get in touch now!</h3>
                        <h4 class="mb-0 font-weight-light">Contact us on any of these platforms.</h4>
                    </div>
                    <div class="col-lg-6 text-lg-center btn-wrapper">
                        <button target="_blank" href="#" rel="nofollow" class="btn btn-icon-only btn-twitter rounded-circle" data-toggle="tooltip" data-original-title="Follow us">
                            <span class="btn-inner--icon"><i class="fa fa-twitter"></i></span>
                        </button>
                        <button target="_blank" href="#" rel="nofollow" class="btn-icon-only rounded-circle btn btn-facebook" data-toggle="tooltip" data-original-title="Like us">
                            <span class="btn-inner--icon"><i class="fab fa-facebook"></i></span>
                        </button>
                        <button target="_blank" href="#" rel="nofollow" class="btn btn-icon-only btn-dribbble rounded-circle" data-toggle="tooltip" data-original-title="Follow us">
                            <span class="btn-inner--icon"><i class="fa fa-instagram"></i></span>
                        </button>
                    </div>
                </div>
                <hr>
                <div class="row align-items-center justify-content-md-between">
                    <div class="col-md-6">
                        <div class="copyright">
                            &copy;{{ now()->year }} <a href="{{ route('home') }}">{{ config('app.name') }}</a>. All right reserved
                        </div>
                    </div>
                    <div class="col-md-6">
                        <ul class="nav nav-footer justify-content-end">
                            <li class="nav-item">
                                <a href="{{ route('home') }}" class="nav-link">{{ config('app.name') }}</a>
                            </li>
                            <li class="nav-item">
                                <a href="{{ route('login', 'writer') }}" class="nav-link">Log In</a>
                            </li>

                            <li class="nav-item">
                                <a href="{{ url('/writer') }}" class="nav-link">Account</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>

        <script src="{{ asset('vendor/jquery/dist/jquery.min.js') }}"></script>
        <script src="{{ asset('vendor/popper/popper.min.js') }}"></script>
        <script src="{{ asset('vendor/bootstrap/dist/js/bootstrap.min.js') }}"></script>
        <script src="https://kit.fontawesome.com/ce4529ea37.js" crossorigin="anonymous"></script>

    </body>
</html>
