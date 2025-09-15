'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  LockClosedIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EyeIcon,
  KeyIcon,
  ServerIcon
} from '@heroicons/react/24/outline';

interface SecurityFeature {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  status: 'active' | 'pending' | 'disabled';
}

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<'security' | 'terms' | 'privacy'>('security');

  const securityFeatures: SecurityFeature[] = [
    {
      title: 'End-to-End Encryption',
      description: 'All data transmission is encrypted using AES-256 encryption',
      icon: LockClosedIcon,
      status: 'active'
    },
    {
      title: 'Two-Factor Authentication',
      description: 'Secure login with SMS and authenticator app support',
      icon: KeyIcon,
      status: 'active'
    },
    {
      title: 'Data Privacy Protection',
      description: 'Your personal data is protected and never shared with third parties',
      icon: EyeIcon,
      status: 'active'
    },
    {
      title: 'Secure Cloud Storage',
      description: 'Data stored in encrypted cloud servers with regular backups',
      icon: ServerIcon,
      status: 'active'
    },
    {
      title: 'Regular Security Audits',
      description: 'Monthly security assessments and vulnerability testing',
      icon: ShieldCheckIcon,
      status: 'active'
    },
    {
      title: 'GDPR Compliance',
      description: 'Full compliance with European data protection regulations',
      icon: CheckCircleIcon,
      status: 'active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'disabled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircleIcon;
      case 'pending': return ExclamationTriangleIcon;
      case 'disabled': return ExclamationTriangleIcon;
      default: return ExclamationTriangleIcon;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Security & Privacy
          </h1>
          <p className="text-xl text-gray-600">
            Your data security and privacy are our top priorities
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 rounded-md transition-colors ${
                activeTab === 'security'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Security Features
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-6 py-3 rounded-md transition-colors ${
                activeTab === 'terms'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-6 py-3 rounded-md transition-colors ${
                activeTab === 'privacy'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Privacy Policy
            </button>
          </div>
        </div>

        {/* Security Features Tab */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Security Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <ShieldCheckIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Secure</h3>
                  <p className="text-gray-600">Bank-level encryption and security</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <LockClosedIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy First</h3>
                  <p className="text-gray-600">Your data stays private and protected</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <CheckCircleIcon className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Compliant</h3>
                  <p className="text-gray-600">GDPR and industry standards</p>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {securityFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  const StatusIcon = getStatusIcon(feature.status);
                  const statusColor = getStatusColor(feature.status);
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                              <div className="flex items-center space-x-1">
                                <StatusIcon className="h-3 w-3" />
                                <span className="capitalize">{feature.status}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Terms & Conditions Tab */}
        {activeTab === 'terms' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Terms & Conditions</h2>
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h3>
              <p className="text-gray-600 mb-6">
                By accessing and using SolarSense, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Use License</h3>
              <p className="text-gray-600 mb-6">
                Permission is granted to temporarily download one copy of SolarSense for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Disclaimer</h3>
              <p className="text-gray-600 mb-6">
                The materials on SolarSense are provided on an &apos;as is&apos; basis. SolarSense makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">4. Limitations</h3>
              <p className="text-gray-600 mb-6">
                In no event shall SolarSense or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SolarSense, even if SolarSense or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">5. Accuracy of Materials</h3>
              <p className="text-gray-600 mb-6">
                The materials appearing on SolarSense could include technical, typographical, or photographic errors. SolarSense does not warrant that any of the materials on its website are accurate, complete, or current. SolarSense may make changes to the materials contained on its website at any time without notice.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">6. Links</h3>
              <p className="text-gray-600 mb-6">
                SolarSense has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by SolarSense of the site. Use of any such linked website is at the user&apos;s own risk.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">7. Modifications</h3>
              <p className="text-gray-600 mb-6">
                SolarSense may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">8. Governing Law</h3>
              <p className="text-gray-600 mb-6">
                These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
              </p>
            </div>
          </motion.div>
        )}

        {/* Privacy Policy Tab */}
        {activeTab === 'privacy' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Policy</h2>
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Information We Collect</h3>
              <p className="text-gray-600 mb-6">
                We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Name, email address, and contact information</li>
                <li>Solar panel installation details and energy generation data</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Usage data and preferences</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">2. How We Use Your Information</h3>
              <p className="text-gray-600 mb-6">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Information Sharing</h3>
              <p className="text-gray-600 mb-6">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist us in operating our platform</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">4. Data Security</h3>
              <p className="text-gray-600 mb-6">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure data centers and infrastructure</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">5. Your Rights</h3>
              <p className="text-gray-600 mb-6">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Delete your personal information</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h3>
              <p className="text-gray-600 mb-6">
                We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">7. Data Retention</h3>
              <p className="text-gray-600 mb-6">
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">8. Changes to This Policy</h3>
              <p className="text-gray-600 mb-6">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">9. Contact Us</h3>
              <p className="text-gray-600 mb-6">
                If you have any questions about this privacy policy or our data practices, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@solarsense.com<br />
                  <strong>Phone:</strong> +91-9876543210<br />
                  <strong>Address:</strong> SolarSense Technologies, Mumbai, India
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}