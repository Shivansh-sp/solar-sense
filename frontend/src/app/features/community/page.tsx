'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  UserGroupIcon, 
  HeartIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  TrophyIcon,
  CalendarIcon,
  GlobeAltIcon,
  HomeIcon,
  ArrowLeftIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface CommunityMember {
  id: string;
  name: string;
  location: string;
  energyGenerated: number;
  rank: number;
  avatar: string;
  badges: string[];
}

interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  attendees: number;
  type: 'webinar' | 'workshop' | 'meetup' | 'challenge';
}

export default function CommunityPage() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const mockMembers: CommunityMember[] = [
      {
        id: '1',
        name: 'Priya Sharma',
        location: 'Mumbai, India',
        energyGenerated: 1250.5,
        rank: 1,
        avatar: 'PS',
        badges: ['Solar Champion', 'Energy Saver', 'Community Leader']
      },
      {
        id: '2',
        name: 'Rajesh Kumar',
        location: 'Delhi, India',
        energyGenerated: 1180.2,
        rank: 2,
        avatar: 'RK',
        badges: ['Solar Champion', 'Energy Saver']
      },
      {
        id: '3',
        name: 'Anita Patel',
        location: 'Bangalore, India',
        energyGenerated: 1095.8,
        rank: 3,
        avatar: 'AP',
        badges: ['Solar Champion', 'Early Adopter']
      },
      {
        id: '4',
        name: 'Vikram Singh',
        location: 'Chennai, India',
        energyGenerated: 980.3,
        rank: 4,
        avatar: 'VS',
        badges: ['Energy Saver']
      },
      {
        id: '5',
        name: 'Sneha Reddy',
        location: 'Hyderabad, India',
        energyGenerated: 920.7,
        rank: 5,
        avatar: 'SR',
        badges: ['Community Leader']
      }
    ];

    const mockEvents: CommunityEvent[] = [
      {
        id: '1',
        title: 'Solar Energy Workshop',
        date: '2024-02-15',
        description: 'Learn about solar panel installation and maintenance',
        attendees: 45,
        type: 'workshop'
      },
      {
        id: '2',
        title: 'Energy Saving Challenge',
        date: '2024-02-20',
        description: 'Compete with community members to save the most energy',
        attendees: 120,
        type: 'challenge'
      },
      {
        id: '3',
        title: 'Monthly Community Meetup',
        date: '2024-02-25',
        description: 'Share experiences and tips with fellow solar users',
        attendees: 30,
        type: 'meetup'
      }
    ];

    setTimeout(() => {
      setMembers(mockMembers);
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'webinar': return 'bg-blue-500';
      case 'workshop': return 'bg-green-500';
      case 'meetup': return 'bg-purple-500';
      case 'challenge': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Navigation Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <HomeIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SolarSense</span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500">
                <span>Features</span>
                <span>/</span>
                <span className="text-green-600 font-medium">Community</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
              >
                <ChartBarIcon className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SolarSense Community
          </h1>
          <p className="text-xl text-gray-600">
            Connect with fellow solar energy enthusiasts and share your journey
          </p>
        </motion.div>

        {/* Code Tyrans Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Follow Solar Spark Community</h2>
              <p className="text-gray-600 mb-4">
                Stay updated with the latest solar energy developments and community content
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="https://www.instagram.com/solar_spark.07?igsh=dDJvNDBwbmpvcnM0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2"
                >
                  <GlobeAltIcon className="h-5 w-5" />
                  <span>Follow Solar Spark on Instagram</span>
                </a>
                <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                  <ShareIcon className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">SS</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <UserGroupIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">1,250+</h3>
            <p className="text-gray-600">Active Members</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <TrophyIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">5,420</h3>
            <p className="text-gray-600">kWh Generated</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <HeartIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">98%</h3>
            <p className="text-gray-600">Satisfaction Rate</p>
          </motion.div>
        </div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Leaderboard</h2>
          <div className="space-y-4">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">#{member.rank}</span>
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{member.avatar}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Energy Generated</p>
                    <p className="font-bold text-green-600">{member.energyGenerated} kWh</p>
                  </div>
                  <div className="flex space-x-1">
                    {member.badges.map((badge, badgeIndex) => (
                      <span
                        key={badgeIndex}
                        className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-3 h-3 ${getEventTypeColor(event.type)} rounded-full`}></div>
                  <span className="text-sm text-gray-600 capitalize">{event.type}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserGroupIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{event.attendees} attendees</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Join Event
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Community Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Discussion Forums</h3>
              <p className="text-sm text-gray-600">Share tips and ask questions</p>
            </div>
            <div className="text-center p-4">
              <TrophyIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Achievements</h3>
              <p className="text-sm text-gray-600">Earn badges and recognition</p>
            </div>
            <div className="text-center p-4">
              <ShareIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Knowledge Sharing</h3>
              <p className="text-sm text-gray-600">Learn from experts</p>
            </div>
            <div className="text-center p-4">
              <StarIcon className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Success Stories</h3>
              <p className="text-sm text-gray-600">Inspire and be inspired</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}