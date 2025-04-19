import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  Shield, 
  UserPlus, 
  Activity, 
  Heart, 
  Award,
  CheckCircle,
  Users
} from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section with Gradient Background */}
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-white/75 sm:bg-transparent sm:from-white/95 sm:to-white/25 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l"></div>
        
        <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
          <div className="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right lg:w-1/2">
            <h1 className="text-3xl font-extrabold sm:text-5xl">
              Your Health Journey
              <strong className="block font-extrabold text-blue-600">
                Starts Here
              </strong>
            </h1>

            <p className="mt-4 max-w-lg sm:text-xl/relaxed text-gray-700">
              Experience healthcare reimagined. Book appointments seamlessly, connect with expert doctors, and take control of your well-being.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-center justify-center sm:justify-start">
              <Link
                to="/register"
                className="block w-full rounded bg-blue-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
              >
                Get Started
              </Link>

              <Link
                to="/about"
                className="block w-full rounded bg-white px-12 py-3 text-sm font-medium text-blue-600 shadow hover:text-blue-700 focus:outline-none focus:ring active:text-blue-500 sm:w-auto border border-blue-600"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Doctor Image */}
          <div className="hidden lg:block lg:w-1/2 lg:pl-8">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                alt="Professional Doctor"
                className="rounded-lg shadow-2xl"
              />
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-6 animate-float">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Stethoscope className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Expert Doctors</p>
                    <p className="text-2xl font-bold text-blue-600">50+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Better Healthcare</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for your health
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Experience a new standard of healthcare management with our comprehensive platform.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              {/* Feature 1 */}
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                  Easy Registration
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Quick and secure sign-up process to get started with your healthcare journey.
                </dd>
              </div>

              {/* Feature 2 */}
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  Smart Scheduling
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Book appointments with your preferred doctors at your convenience.
                </dd>
              </div>

              {/* Feature 3 */}
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  Health Tracking
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Monitor your appointments and health progress all in one place.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-blue-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Trusted by thousands of patients
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                We're committed to providing the best healthcare experience
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col bg-white/5 backdrop-blur-sm p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Active Doctors</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">50+</dd>
              </div>
              <div className="flex flex-col bg-white/5 backdrop-blur-sm p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Patient Satisfaction</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">99%</dd>
              </div>
              <div className="flex flex-col bg-white/5 backdrop-blur-sm p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Appointments</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">10k+</dd>
              </div>
              <div className="flex flex-col bg-white/5 backdrop-blur-sm p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Available Hours</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">24/7</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            <div className="max-w-xl lg:max-w-lg">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to take control of your health?
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-300">
                Join thousands of satisfied patients who have transformed their healthcare experience with our platform.
              </p>
              <div className="mt-6 flex max-w-md gap-x-4">
                <Link
                  to="/register"
                  className="flex-none rounded-md bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  Get started
                </Link>
              </div>
            </div>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
              <div className="flex flex-col items-start">
                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <dt className="mt-4 font-semibold text-white">Professional Doctors</dt>
                <dd className="mt-2 leading-7 text-gray-400">
                  Connect with experienced healthcare professionals
                </dd>
              </div>
              <div className="flex flex-col items-start">
                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <dt className="mt-4 font-semibold text-white">Patient-Centered</dt>
                <dd className="mt-2 leading-7 text-gray-400">
                  Your health and comfort are our top priorities
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;