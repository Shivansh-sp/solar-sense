import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  // Create HTML response that handles the OAuth callback
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Google OAuth Callback</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f9fafb;
          }
          .container {
            text-align: center;
            padding: 2rem;
          }
          .spinner {
            width: 3rem;
            height: 3rem;
            border: 0.25rem solid #e5e7eb;
            border-top: 0.25rem solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .text {
            color: #6b7280;
            font-size: 1.125rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="spinner"></div>
          <p class="text">Completing Google authentication...</p>
        </div>
        <script>
          (function() {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');

            if (error) {
              // Redirect back to home with error
              const returnUrl = localStorage.getItem('oauth_return_url') || '/';
              localStorage.removeItem('oauth_return_url');
              window.location.href = returnUrl + '?oauth_error=' + encodeURIComponent(error);
              return;
            }

            if (code) {
              // Process the OAuth code
              fetch('/api/auth/google-callback', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: code }),
              })
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  // Store token and redirect
                  localStorage.setItem('token', data.token);
                  const returnUrl = localStorage.getItem('oauth_return_url') || '/';
                  localStorage.removeItem('oauth_return_url');
                  window.location.href = returnUrl;
                } else {
                  throw new Error(data.message || 'Authentication failed');
                }
              })
              .catch(error => {
                console.error('OAuth error:', error);
                const returnUrl = localStorage.getItem('oauth_return_url') || '/';
                localStorage.removeItem('oauth_return_url');
                window.location.href = returnUrl + '?oauth_error=' + encodeURIComponent(error.message);
              });
            }
          })();
        </script>
      </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
