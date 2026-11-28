// Initialize Vercel Web Analytics via CDN
// This script dynamically loads the Vercel Analytics script
(function() {
  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://cdn.vercel-insights.com/v1/script.js';
  document.head.appendChild(script);
})();
