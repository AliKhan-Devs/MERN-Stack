import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Calendar, CheckCircle, Clock, Users, TrendingUp, Activity } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import io from 'socket.io-client';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DoctorDashboard = () => {
  const { user, token } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    monthlyData: [],
    weeklyData: []
  });
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || !user) return;

    const newSocket = io('https://doctor-appointment-backend-frtd.onrender.com', {
      auth: { token }
    });

    newSocket.on('appointmentUpdated', (data) => {
      console.log('Received appointment update:', data);
      if (data.stats) {
        setStats(prevStats => ({
          ...prevStats,
          ...data.stats
        }));
      }
      
      setAppointments(prevAppointments => {
        return prevAppointments.map(apt => {
          if (apt.doctor._id === data.doctorId) {
            return { 
              ...apt, 
              turnNumber: data.newTurnNumbers[apt._id] || apt.turnNumber,
              status: data.completedAppointmentId === apt._id ? 'completed' : apt.status
            };
          }
          return apt;
        });
      });
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [token, user]);

  const fetchData = async () => {
    if (!token || !user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const [appointmentsRes, statsRes] = await Promise.all([
        axios.get('https://doctor-appointment-backend-frtd.onrender.com/api/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://doctor-appointment-backend-frtd.onrender.com/api/appointments/doctor/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setAppointments(appointmentsRes.data || []);
      
      // Process and set stats with detailed logging
      const statsData = statsRes.data || {};
      console.log('Raw stats data:', statsData);
      
      const processedStats = {
        totalAppointments: parseInt(statsData.totalAppointments) || 0,
        completedAppointments: parseInt(statsData.completedAppointments) || 0,
        pendingAppointments: parseInt(statsData.pendingAppointments) || 0,
        monthlyData: Array.isArray(statsData.monthlyData) ? statsData.monthlyData : [],
        weeklyData: Array.isArray(statsData.weeklyData) ? statsData.weeklyData : []
      };
      
      console.log('Processed stats:', processedStats);
      setStats(processedStats);

    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, user]);

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      const response = await axios.patch(`https://doctor-appointment-backend-frtd.onrender.com/api/appointments/${appointmentId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state with new turn numbers and stats
      setAppointments(prevAppointments => {
        return prevAppointments.map(apt => {
          const newTurnNumber = response.data.newTurnNumbers[apt._id];
          if (apt._id === appointmentId) {
            return { ...apt, status: 'completed' };
          }
          if (newTurnNumber !== undefined) {
            return { ...apt, turnNumber: newTurnNumber };
          }
          return apt;
        });
      });

      if (response.data.stats) {
        setStats(prevStats => ({
          ...prevStats,
          ...response.data.stats
        }));
      }

      toast.success('Appointment marked as completed');
    } catch (error) {
      console.error('Failed to complete appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to complete appointment');
    }
  };

  // Chart data
  const getChartData = () => {
    try {
      console.log('Current stats in getChartData:', stats);

      // Ensure we have valid numbers for pie chart
      const completed = parseInt(stats.completedAppointments) || 0;
      const pending = parseInt(stats.pendingAppointments) || 0;

      // Pie Data
      const pieData = {
        labels: ['Completed', 'Pending'],
        datasets: [{
          data: [completed, pending],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(234, 179, 8, 0.8)'
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(234, 179, 8)'
          ],
          borderWidth: 1
        }]
      };

      // Monthly Data
      const monthlyData = {
        labels: [],
        datasets: [{
          label: 'Monthly Appointments',
          data: [],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.4,
          fill: true
        }]
      };

      // Weekly Data
      const weeklyData = {
        labels: [],
        datasets: [{
          label: 'Weekly Appointments',
          data: [],
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          tension: 0.4,
          fill: true
        }]
      };

      // Process monthly data if available
      if (Array.isArray(stats.monthlyData) && stats.monthlyData.length > 0) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        monthlyData.labels = stats.monthlyData.map(item => {
          const monthIndex = (item._id?.month || item.month) - 1;
          return monthNames[monthIndex] || `Month ${monthIndex + 1}`;
        });
        monthlyData.datasets[0].data = stats.monthlyData.map(item => parseInt(item.count) || 0);
      }

      // Process weekly data if available
      if (Array.isArray(stats.weeklyData) && stats.weeklyData.length > 0) {
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        // Debug the incoming data
        console.log('Weekly Data from server:', stats.weeklyData);

        // Map the data directly since it's already in the correct order (Monday=1 to Sunday=7)
        weeklyData.labels = dayNames;
        weeklyData.datasets[0] = {
          label: 'Weekly Appointments',
          data: stats.weeklyData.map(day => parseInt(day.count) || 0),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: 'rgb(34, 197, 94)'
        };

        // Debug the processed data
        console.log('Processed weekly data:', {
          labels: weeklyData.labels,
          data: weeklyData.datasets[0].data
        });
      } else {
        console.warn('No weekly data available:', stats.weeklyData);
        weeklyData.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        weeklyData.datasets[0] = {
          label: 'Weekly Appointments',
          data: [0, 0, 0, 0, 0, 0, 0],
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: 'rgb(34, 197, 94)'
        };
      }

      // Add debug logging
      console.log('Processed chart data:', {
        pieData,
        monthlyData,
        weeklyData
      });

      return {
        monthlyData,
        weeklyData,
        pieData
      };
    } catch (error) {
      console.error('Error in getChartData:', error);
      // Return empty datasets with proper structure
      return {
        monthlyData: {
          labels: [],
          datasets: [{
            label: 'Monthly Appointments',
            data: [],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            tension: 0.4,
            fill: true
          }]
        },
        weeklyData: {
          labels: [],
          datasets: [{
            label: 'Weekly Appointments',
            data: [],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
            tension: 0.4,
            fill: true
          }]
        },
        pieData: {
          labels: ['Completed', 'Pending'],
          datasets: [{
            data: [0, 0],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(234, 179, 8, 0.8)'
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(234, 179, 8)'
            ],
            borderWidth: 1
          }]
        }
      };
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, <span className="text-blue-600">Dr. {user?.name}</span>
        </h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center">
              <Users className="h-10 w-10" />
              <div className="ml-4">
                <p className="text-sm font-medium opacity-80">Total Appointments</p>
                <p className="text-3xl font-bold">{stats.totalAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center">
              <CheckCircle className="h-10 w-10" />
              <div className="ml-4">
                <p className="text-sm font-medium opacity-80">Completed</p>
                <p className="text-3xl font-bold">{stats.completedAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center">
              <Clock className="h-10 w-10" />
              <div className="ml-4">
                <p className="text-sm font-medium opacity-80">Pending</p>
                <p className="text-3xl font-bold">{stats.pendingAppointments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
              Monthly Trend
            </h3>
            <div className="h-[300px] w-full">
              <Line data={chartData.monthlyData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Activity className="h-6 w-6 mr-2 text-blue-600" />
              Appointment Status
            </h3>
            <div className="h-[300px] w-full flex items-center justify-center">
              <Doughnut data={chartData.pieData} options={pieOptions} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-blue-600" />
              Weekly Distribution
            </h3>
            <div className="h-[300px] w-full">
              <Line data={chartData.weeklyData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Today's Appointments</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {appointments
              .filter(apt => new Date(apt.date).toDateString() === new Date().toDateString())
              .sort((a, b) => a.turnNumber - b.turnNumber)
              .map((appointment) => (
                <div
                  key={appointment._id}
                  className="border rounded-lg p-4 flex items-start space-x-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {appointment.status === 'completed' ? (
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{appointment.patient?.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.date).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                          ? "Next in Line"
                          : `Turn Number: ${appointment.turnNumber}`}
                      </span>
                      {appointment.status === 'pending' && (
                        <button
                          onClick={() => handleCompleteAppointment(appointment._id)}
                          className="ml-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-green-200 transition-colors"
                        >
                          Mark as Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            {appointments.filter(apt => 
              new Date(apt.date).toDateString() === new Date().toDateString()
            ).length === 0 && (
              <p className="text-gray-500 text-center py-4">No appointments for today</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;