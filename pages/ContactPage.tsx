import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-black dark:text-white">
            Connect with Us
          </h2>
          <p className="mt-4 text-center text-lg text-gray-500 dark:text-gray-400">
            We'd love to hear from you! Whether you have a question, feedback, or need assistance, feel free to reach out.
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
            <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg">
                <h3 className="font-bold text-lg text-black dark:text-white mb-2">Email Support</h3>
                <a href="mailto:teamcodehustlers@gmail.com" className="text-xl font-semibold text-black dark:text-white underline hover:opacity-80 break-all">
                    teamcodehustlers@gmail.com
                </a>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">We typically respond within 24 hours.</p>
            </div>
            
             <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg">
                <h3 className="font-bold text-lg text-black dark:text-white mb-2">Phone Support</h3>
                <a href="tel:+1234567890" className="text-xl font-semibold text-black dark:text-white underline hover:opacity-80">
                    +1 (234) 567-890
                </a>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Available Mon-Fri, 9am-5pm EST.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;