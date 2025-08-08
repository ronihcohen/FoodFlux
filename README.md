# FoodFlux - Calorie Tracking Application

A modern, full-stack calorie tracking application built with Next.js 14, TypeScript, and Prisma. FoodFlux helps users track their daily calorie intake, manage food presets, and achieve their nutritional goals.

## 🚀 Features

### 📊 Daily Calorie Tracking
- **Calendar Navigation**: Browse through different days with intuitive previous/next navigation
- **Daily Entries**: Add, view, and manage food items for each day
- **Real-time Calculations**: Automatic calculation of total daily calories
- **Entry Management**: Add, edit, and delete individual food entries with instant updates

### 🎯 Goal Management
- **Personalized Goals**: Set and manage daily calorie targets
- **Progress Tracking**: Visual comparison between consumed calories and daily goals
- **Goal Persistence**: Goals are saved and maintained across sessions
- **Smart Display**: Clear visualization of calorie deficit/surplus

### 🍎 Food Item Management
- **Preset System**: Create and maintain a personal library of frequently consumed foods
- **Quick Entry**: Use presets to quickly add common foods to daily entries
- **Custom Entries**: Add one-time food items with custom calorie values
- **Preset Management**: Edit and delete preset food items as needed

### 🔐 Authentication & Security
- **Secure Authentication**: NextAuth.js with multiple providers
- **User Sessions**: Robust session management and protection
- **Data Isolation**: Complete user data separation and security
- **Form Validation**: Real-time validation and error handling

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Next.js App Router with Server Actions
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Vercel-ready configuration

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FoodFlux/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables in `.env.local`:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### Core Models
- **User**: Authentication and profile information
- **FoodItem**: Preset food items with calorie information
- **Entry**: Daily food entries linked to specific dates
- **DailyGoal**: User's daily calorie targets
- **Account/Session**: Authentication session management

### Key Relationships
- Users can have multiple food presets
- Daily entries are linked to specific dates and users
- Food presets can be referenced by multiple entries
- Daily goals are unique per user

## 🚀 Usage

### Getting Started
1. **Sign Up/Login**: Create an account or sign in with your credentials
2. **Set Daily Goal**: Configure your daily calorie target
3. **Add Food Presets**: Create frequently used food items for quick entry
4. **Track Daily Intake**: Add food entries for each day
5. **Monitor Progress**: View your daily summary and goal comparison

### Key Features
- **Calendar Navigation**: Use the Previous/Next buttons to navigate between days
- **Quick Entry**: Select from your presets or add custom food items
- **Goal Management**: Set and adjust your daily calorie targets
- **Preset Management**: Create, edit, and delete your food presets

## 🔧 Development

### Project Structure
```
web/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── lib/              # Utility functions and configurations
│   ├── types/            # TypeScript type definitions
│   └── generated/        # Prisma generated client
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio for database management

### Database Management
```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Create a new migration
npx prisma migrate dev --name <migration-name>

# Open Prisma Studio
npx prisma studio
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
```

## 🔮 Future Enhancements

- **Nutritional Information**: Track protein, carbs, fats beyond calories
- **Meal Planning**: Schedule and plan meals in advance
- **Progress Analytics**: Charts and insights into eating patterns
- **Social Features**: Share progress and recipes with friends
- **Mobile App**: Native mobile application
- **Fitness Integration**: Connect with fitness trackers
- **Barcode Scanning**: Scan packaged foods for automatic entry
- **Recipe Management**: Create and manage meal recipes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
- Check the [Issues](https://github.com/your-repo/issues) page
- Create a new issue with detailed information
- Contact the development team

---

Built with ❤️ using Next.js, TypeScript, and Prisma
