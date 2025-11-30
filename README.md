# Water Conservation Management System

A full-stack web application for managing water consumption, conservation tips, billing, and user alerts. Built with React, Node.js, Express, and Oracle Database.

## Features

- **User Management** - Create, manage user profiles, login, and registration with role-based access
- **Water Meters** - Register and track water meters by location
- **Consumption Records** - Log and monitor water usage over time
- **Billing System** - Generate and track billing records
- **Water Sources** - Manage various water sources
- **Conservation Methods** - View and manage water-saving methods with efficiency ratings
- **Implementation Records** - Track implementation of conservation methods by users
- **Water Savings** - Calculate and track water savings from implemented methods
- **Alerts** - Send notifications and alerts to users
- **Admin Dashboard** - Administrative interface for managing the system
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
- **oracledb** - Oracle database driver

### Development Tools
- **Nodemon** - Auto-restart for development
- **Dotenv** - Environment variable management

## Project Structure

```
WaterMan/
├── client/                    # React frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── AdminDashboard.js
│   │   │   ├── Billing.js
│   │   │   ├── Conservation.js
│   │   │   ├── ConsumptionRecords.js
│   │   │   ├── Login.js
│   │   │   ├── SignUp.js
│   │   │   ├── Users.js
│   │   │   ├── WaterMeters.js
│   │   │   ├── WaterSavings.js
│   │   │   ├── WaterSavingVisualize.js
│   │   │   └── WaterSources.js
│   │   ├── App.js             # Main app component
│   │   ├── App.css            # Global styles with design tokens
│   │   └── index.js           # Entry point
│   └── package.json
├── routes/                    # Express backend routes
│   ├── alerts.js
│   ├── billing.js
│   ├── conservationMethods.js
│   ├── consumptionRecords.js
│   ├── implementationRecords.js
│   ├── users.js
│   ├── waterMeters.js
│   ├── waterSavings.js
│   └── waterSources.js
├── migrations/                # Database migration scripts
│   ├── 001_modify_tables_for_no_id_columns.sql
│   ├── 002_adjust_migration_to_current_schema.sql
│   ├── 003_add_conservation_tables.sql
│   ├── 004_add_role_to_users.sql
│   ├── 005_add_password_to_users.sql
│   ├── 006_add_water_savings_table.sql
│   └── 007_add_water_saved_column.sql
├── server.js                  # Express server
├── db.js                      # Database connection
├── migrate.js                 # Migration runner
├── create_tables.js           # Database table creation script
├── create_tables.sql          # Database schema
├── package.json
└── README.md
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

2. Run migrations to update the schema:
```bash
npm run migrate
```

3. Update database connection in `db.js` if needed

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
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration

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

### Conservation Methods
- `GET /api/conservation-methods` - Get all conservation methods
- `GET /api/conservation-methods/:id` - Get conservation method by ID
- `POST /api/conservation-methods` - Create new conservation method (Admin only)

### Implementation Records
- `GET /api/implementation-records` - Get all implementation records
- `GET /api/implementation-records/:id` - Get implementation record by ID
- `POST /api/implementation-records` - Create new implementation record

### Water Savings
- `GET /api/water-savings` - Get all water savings records
- `POST /api/water-savings` - Create new water savings record

### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create new alert

## Database Schema

The application uses the following main tables:
- **Users** - User profiles, contact information, roles
- **WaterMeters** - Water meter details and locations
- **ConsumptionRecords** - Water usage logs
- **Billing** - Billing information and payment status
- **WaterSources** - Available water sources
- **ConservationMethod** - Water-saving methods with efficiency ratings
- **ImplementationRecord** - Records of implemented conservation methods
- **WaterSavings** - Calculated water savings from implementations
- **Alerts** - User notifications and alerts

## Features Highlights

### Conservation Methods
- **Efficiency Ratings**: Methods rated 1-5 for effectiveness
- **Cost Tracking**: Associated costs for implementation
- **Visual Guides**: Smooth SVG illustrations for each method

### User Roles
- **Admin**: Full system access, can manage conservation methods
- **User**: Standard access for personal water management

### Water Savings Calculation
- Automatic calculation based on implementation duration and method efficiency
- Historical tracking of savings achieved

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

**Last Updated:** December 2024
