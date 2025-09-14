# SolarSense Frontend

A modern React/Next.js frontend for the SolarSense intelligent energy trading platform.

## Features

- 🚀 Next.js 15 with App Router
- ⚡ React 19 with TypeScript
- 🎨 Tailwind CSS for styling
- 📱 Fully responsive design
- 🔄 Real-time WebSocket connections
- 📊 Interactive data visualizations
- 🛡️ Error boundaries and error handling
- 🔒 Security headers and optimizations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Update environment variables in `.env.local`

4. Run development server:
```bash
npm run dev
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5000
NEXT_PUBLIC_JWT_SECRET=your-secret-key
NEXT_PUBLIC_APP_NAME=SolarSense
NEXT_PUBLIC_APP_ENV=development
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Deployment

#### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

#### Docker

1. Build Docker image:
```bash
docker build -t solarsense-frontend .
```

2. Run container:
```bash
docker run -p 3000:3000 solarsense-frontend
```

#### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm run start
```

### Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── config/             # Configuration files
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Technologies Used

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Chart.js, Recharts
- **Icons**: Heroicons
- **State Management**: React Context
- **HTTP Client**: Axios
- **WebSocket**: Socket.io Client

### Performance Optimizations

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Bundle size optimization
- Compression enabled
- SWC minification
- Static generation where possible

### Security Features

- Security headers configured
- Content Security Policy
- XSS protection
- CSRF protection
- Input validation
- Error boundary implementation

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### License

MIT License - see LICENSE file for details