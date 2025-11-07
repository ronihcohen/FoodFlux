# FoodFlux - Calorie Tracking Application

## Project Overview
FoodFlux is a full-stack web application designed for comprehensive calorie tracking and nutritional management. Built with modern technologies, the application provides a responsive interface that works seamlessly across desktop and mobile devices.

## Technology Stack
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Next.js App Router with Server Actions
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with multiple providers
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Vercel-ready configuration

## Core Features

### Authentication System
- Secure user authentication with NextAuth.js
- Support for multiple authentication providers
- User session management and protection
- Password-based local authentication
- Email verification system

### Daily Calorie Tracking
- **Calendar Navigation**: Browse through different days with previous/next navigation
- **Daily Entries**: Add, view, and manage food items for each day
- **Calorie Calculation**: Automatic calculation of total daily calories
- **Entry Management**: Add, edit, and delete individual food entries
- **Real-time Updates**: Immediate reflection of changes across the interface

### Goal Management
- **Daily Calorie Goals**: Set and manage personalized daily calorie targets
- **Progress Tracking**: Visual comparison between consumed calories and daily goals
- **Goal Persistence**: Goals are saved and maintained across sessions
- **Goal vs Actual Display**: Clear visualization of calorie deficit/surplus

### Food Item Management
- **Preset Food Items**: Create and maintain a personal library of frequently consumed foods
- **Quick Entry**: Use presets to quickly add common foods to daily entries
- **Custom Entries**: Add one-time food items with custom calorie values
- **Preset Management**: Edit and delete preset food items as needed
- **Calorie Per Unit**: Track calories per serving/unit for accurate calculations

### User Experience Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Intuitive Interface**: Clean, modern UI with clear navigation
- **Real-time Validation**: Form validation and error handling
- **Data Persistence**: All data is securely stored and backed up
- **Performance Optimized**: Fast loading times and smooth interactions

## Database Schema

### Core Models
- **User**: Authentication and profile information
- **FoodItem**: Preset food items with calorie information
- **Entry**: Daily food entries linked to specific dates
- **DailyGoal**: User's daily calorie targets
- **Account/Session**: Authentication session management

### Data Relationships
- Users can have multiple food presets
- Daily entries are linked to specific dates and users
- Food presets can be referenced by multiple entries
- Daily goals are unique per user

## Technical Requirements

### Performance
- Fast page loads and smooth interactions
- Optimized database queries with proper indexing
- Efficient state management and caching

### Security
- Secure authentication with session management
- Data validation and sanitization
- User data isolation and protection
- CSRF protection and secure form handling

### Scalability
- Modular code architecture
- Database optimization for growth
- Efficient data structures for large datasets
- Caching strategies for improved performance

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- High contrast and readable typography

## Future Enhancements
- Nutritional information beyond calories (protein, carbs, fats)
- Meal planning and scheduling
- Progress charts and analytics
- Social features and sharing
- Mobile app development
- Integration with fitness trackers
- Barcode scanning for packaged foods
- Recipe management and meal suggestions