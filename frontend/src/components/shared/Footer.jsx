import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left Side: Copyright */}
        <p className="text-sm md:text-base">
          &copy; {new Date().getFullYear()} CareerCoach. All rights reserved.
        </p>

        {/* Right Side: Social & Policy Links */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 mt-4 md:mt-0">
          
          {/* Social Links */}
          <div className="flex space-x-6">
            <a
              href="https://twitter.com/careercoach"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-blue-400 transition-colors"
            >
              {/* Twitter SVG */}
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.1 9.1 0 01-2.88 1.1 4.52 4.52 0 00-7.69 4.13 12.84 12.84 0 01-9.31-4.72 4.52 4.52 0 001.4 6.05 4.46 4.46 0 01-2.05-.56v.06a4.52 4.52 0 003.63 4.43 4.49 4.49 0 01-2.04.08 4.53 4.53 0 004.22 3.14 9.07 9.07 0 01-5.6 1.93A9.32 9.32 0 012 19.54 12.81 12.81 0 008.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.35-.02-.53A8.34 8.34 0 0023 3z" />
              </svg>
            </a>

            <a
              href="https://facebook.com/careercoach"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-blue-600 transition-colors"
            >
              {/* Facebook SVG */}
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M22.67 0H1.33A1.33 1.33 0 000 1.33v21.33A1.33 1.33 0 001.33 24h11.5v-9.33H9.33v-3.67h3.5v-2.7c0-3.46 2.12-5.36 5.22-5.36 1.49 0 2.78.11 3.15.16v3.65h-2.16c-1.7 0-2.03.81-2.03 2v2.33h4.06l-.53 3.67h-3.53V24h6.93A1.33 1.33 0 0024 22.67V1.33A1.33 1.33 0 0022.67 0z" />
              </svg>
            </a>

            <a
              href="https://linkedin.com/company/careercoach"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-blue-500 transition-colors"
            >
              {/* LinkedIn SVG */}
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.45 20.45h-3.56v-5.3c0-1.27-.03-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8v5.4H9.03V9h3.42v1.56h.05c.48-.91 1.65-1.87 3.4-1.87 3.64 0 4.31 2.4 4.31 5.52v6.3zM5.34 7.43a2.07 2.07 0 11-.01-4.14 2.07 2.07 0 01.01 4.14zM6.95 20.45H3.72V9h3.23v11.45zM22.22 0H1.78A1.78 1.78 0 000 1.78v20.44A1.78 1.78 0 001.78 24h20.44a1.78 1.78 0 001.78-1.78V1.78A1.78 1.78 0 0022.22 0z" />
              </svg>
            </a>
          </div>

          {/* Privacy Policy Link */}
          <a
            href="/privacy-policy"
            className="text-sm hover:underline"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
