# Water Conservation Management System

A full-stack web application for managing water consumption, conservation tips, and billing. Built with React, Node.js, and Express.

## Features

- **User Management** - Create and manage user profiles
- **Water Meters** - Register and track water meters by location
- **Consumption Records** - Log and monitor water usage over time
- **Billing System** - Generate and track billing records
- **Water Sources** - Manage various water sources
- **Conservation Tips** - View water-saving methods with visual guides
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

### Frontend
- **React** - UI library
- **Bootstrap** - CSS framework
- **Axios** - HTTP client
- **CSS Variables** - Theme support with dark mode

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Oracle Database** - Data persistence

## Project Structure

```
WaterMan/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── App.js            # Main app component
│   │   ├── App.css           # Global styles with design tokens
│   │   └── index.js          # Entry point
│   └── package.json
├── routes/                    # Express backend routes
│   ├── users.js
│   ├── water-meters.js
│   ├── consumption-records.js
│   ├── billing.js
│   └── water-sources.js
├── server.js                  # Express server
├── db.js                      # Database connection
├── create_tables.sql          # Database schema
└── package.json
```

## Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Oracle Database (or compatible DB)

### Backend Setup

```bash
cd d:\WaterMan
npm install
```

### Frontend Setup

```bash
cd d:\WaterMan\client
npm install
```

## Configuration

1. Set up your Oracle database with the schema in `create_tables.sql`:
```bash
sqlplus username/password @create_tables.sql
```

2. Update database connection in `db.js` if needed

## Running the Application

### Start Backend Server
```bash
cd d:\WaterMan
npm start
# or
node server.js
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd d:\WaterMan\client
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user

### Water Meters
- `GET /api/water-meters` - Get all meters
- `POST /api/water-meters` - Create new meter

### Consumption Records
- `GET /api/consumption-records` - Get records
- `POST /api/consumption-records` - Add consumption record

### Billing
- `GET /api/billing` - Get billing records
- `POST /api/billing` - Create billing record

### Water Sources
- `GET /api/water-sources` - Get water sources
- `POST /api/water-sources` - Create water source

## Database Schema

The application uses the following main tables:
- **Users** - User profiles and contact information
- **WaterMeters** - Water meter details and locations
- **ConsumptionRecords** - Water usage logs
- **Billing** - Billing information and payment status
- **WaterSources** - Available water sources

## Features Highlights

### Conservation Tips
- **At Home**: Fix leaks, reduce shower time, turn off taps, run full loads, use efficient appliances, collect wastewater
- **Yard & Garden**: Water wisely, use brooms, plant drought-resistant species, use mulch
- **Visual Guides**: Smooth SVG illustrations for each conservation method

### Responsive Layout
- Side-by-side form and table on desktop
- Stacked layout on mobile
- Clean, modern UI with design tokens
- Dark mode support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues or questions, please create an issue in the GitHub repository.

## Author

Created as a Water Conservation Management System

---

**Last Updated:** November 2025
