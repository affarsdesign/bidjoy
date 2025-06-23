# BidJoy Nova Stack - Swedish Auction Platform

## Overview
BidJoy Nova Stack is a complete auction platform specializing in Swedish antique and vintage markets, featuring SMS bidding integration for maximum accessibility.

## Production Features
- **SMS Bidding**: Cellsynt integration for real-time bid placement
- **Payment Processing**: Stripe integration for secure transactions
- **Image Management**: Cloudinary integration for auction photos
- **Revenue Tracking**: Automatic calculation of SMS fees and commissions
- **Health Monitoring**: Production-ready health checks

## Deployment
This application is configured for Docker deployment on Render.

### Quick Deploy
1. Connect your Render account to this repository
2. Create a new Web Service with Docker environment
3. Set the required environment variables
4. Deploy

### Environment Variables
Configure these in your Render dashboard:
```
CELLSYNT_USERNAME=your_cellsynt_username
CELLSYNT_PASSWORD=your_cellsynt_password
STRIPE_SECRET_KEY=sk_...
VITE_STRIPE_PUBLIC_KEY=pk_...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=10000
NODE_ENV=production
```

## API Endpoints
- `GET /` - Service status and integration info
- `GET /health` - Health check for monitoring
- `POST /api/sms/webhook` - SMS bid processing
- `GET /api/auctions` - Active auctions
- `GET /api/bids` - Recent bids
- `GET /api/revenue` - Revenue tracking
- `POST /api/create-payment-intent` - Stripe payments

## SMS Bidding Format
Send SMS to configured number with format:
`BUD [OBJECT] [AMOUNT]`

Example: `BUD KLOCKA 500`

## Revenue Model
- 2 SEK per SMS bid
- 15% commission on auction sales
- B2B Nova Auth subscriptions: 99-499 SEK/month

## POC Customer
Klockargården Church - antique clock auctions with SMS bidding

## Support
This platform targets Swedish antique and vintage markets as a Tradera alternative for niche markets.
