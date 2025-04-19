import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const UserDashboard = () => {
  const { user, token } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      setIsLoading(true);
      try {
        const [appointmentsRes, doctorsRes] = await Promise.all([
          axios.get('https://doctor-appointment-backend-frtd.onrender.com/api/appointments', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('https://doctor-appointment-backend-frtd.onrender.com/api/doctors', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setAppointments(appointmentsRes.data);
        setDoctors(doctorsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !appointmentDate) {
      toast.error('Please select both doctor and appointment date');
      return;
    }

    try {
      console.log('Booking appointment with:', {
        doctorId: selectedDoctor,
        date: appointmentDate
      });

      const response = await axios.post(
        'https://doctor-appointment-backend-frtd.onrender.com/api/appointments',
        {
          doctorId: selectedDoctor,
          date: appointmentDate
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAppointments(prevAppointments => [...prevAppointments, response.data.appointment]);
      
      toast.success('Appointment booked successfully');
      
      setSelectedDoctor('');
      setAppointmentDate('');
    } catch (error) {
      console.error('Error booking appointment:', error.response?.data || error);
      toast.error(
        error.response?.data?.message || 
        'Failed to book appointment. Please try again.'
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, <span className="text-blue-600">{user?.name}</span>
        </h1>

        {/* Book Appointment Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Book an Appointment</h2>
          <form onSubmit={handleBookAppointment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Doctor
                </label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Appointments</h2>
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No appointments scheduled</p>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      appointment.status === 'completed' 
                        ? 'bg-green-100' 
                        : 'bg-blue-100'
                    }`}>
                      {appointment.status === 'completed' ? (
                        <Calendar className="h-6 w-6 text-green-600" />
                      ) : (
                        <Clock className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Dr. {appointment.doctor?.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.date).toLocaleString()}
                      </p>
                      {appointment.status === 'pending' && (
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`text-sm font-medium ${
                            appointment.turnNumber === 1 
                              ? 'text-yellow-600 animate-pulse'
                              : 'text-blue-600'
                          }`}>
                            {appointment.turnNumber === 1 
                              ? "🔔 It's your turn!"
                              : `Turn Number: ${appointment.turnNumber}`
                            }
                          </span>
                          {appointment.turnNumber === 1 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 animate-pulse">
                              Current Turn
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {appointment.status === 'pending' && appointment.turnNumber > 1 && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {appointment.turnNumber} in queue
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : appointment.turnNumber === 1
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {appointment.status === 'completed' 
                        ? 'Completed'
                        : appointment.turnNumber === 1
                        ? 'Current'
                        : 'Pending'
                      }
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;