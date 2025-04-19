import React from 'react';
import { Heart, Clock, UserCheck, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About MediCare</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We're dedicated to making healthcare accessible and convenient for everyone through our modern appointment booking system.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-blue-600">
            <Heart className="h-12 w-12" />
          </div>
          <h3 className="mt-6 text-lg font-medium text-gray-900">Quality Care</h3>
          <p className="mt-2 text-base text-gray-500">
            Access to the best healthcare professionals for your needs
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-blue-600">
            <Clock className="h-12 w-12" />
          </div>
          <h3 className="mt-6 text-lg font-medium text-gray-900">Convenient Booking</h3>
          <p className="mt-2 text-base text-gray-500">
            Book appointments anytime, anywhere with our easy-to-use system
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-blue-600">
            <UserCheck className="h-12 w-12" />
          </div>
          <h3 className="mt-6 text-lg font-medium text-gray-900">Expert Doctors</h3>
          <p className="mt-2 text-base text-gray-500">
            Qualified and experienced healthcare professionals
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-blue-600">
            <Shield className="h-12 w-12" />
          </div>
          <h3 className="mt-6 text-lg font-medium text-gray-900">Secure Platform</h3>
          <p className="mt-2 text-base text-gray-500">
            Your health information is protected and secure
          </p>
        </div>
      </div>

      <div className="mt-16">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              At MediCare, we believe that everyone deserves easy access to quality healthcare. Our mission is to bridge the gap between patients and healthcare providers through technology, making the process of finding and booking medical appointments as seamless as possible.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">For Patients</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Easy online appointment booking</li>
              <li>• Real-time appointment tracking</li>
              <li>• Automated turn management</li>
              <li>• Secure personal health information</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">For Doctors</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Efficient patient management</li>
              <li>• Appointment analytics</li>
              <li>• Automated scheduling</li>
              <li>• Secure communication channel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;