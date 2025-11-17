# iOS Widget Setup via Shortcuts

Since you're using a web app, you can create a native-looking widget using **iOS Shortcuts + Widgetsmith** or **iOS Shortcuts automation**.

## Option 1: Use Widgetsmith (Easiest)

1. **Install Widgetsmith** (free app by Apple): https://apps.apple.com/app/widgetsmith/id1523682643
2. **Create a new shortcut** in Shortcuts app:
   - Open Shortcuts app
   - Tap + Create Shortcut
   - Add action: "Get contents of URL" → `https://yourapp.com/api/widget`
   - Add action: "Get Dictionary Value" → key: "remaining"
   - Add action: "Ask for Number" → show the remaining cals
   - Save shortcut as "FoodFlux Widget"
3. **Add to home screen:**
   - In Widgetsmith, create a new widget
   - Set size to Small/Medium
   - Choose your "FoodFlux Widget" shortcut
   - Add to home screen

## Option 2: Use Shortcuts Automation (Most Native)

1. **Create an automation:**
   - Shortcuts app → Automation tab
   - Create new "Time of Day" automation (e.g., every 1 hour)
   - Add action: "Get contents of URL" → `https://yourapp.com/api/widget`
   - Add notification to display the remaining calories
   - Enable "Ask Before Running" toggle OFF

2. **Set refresh interval** (hourly, daily, etc.)

## Option 3: Native iOS App (Professional)

For a true native iOS widget (no web), you'd need to:
- Build a native iOS app using Swift + WidgetKit
- Or use a tool like React Native, Flutter, or Expo to wrap your web app
- This is more involved but gives you full widget control

---

## API Endpoint

Your app now has an API at: `/api/widget`

**Example response:**
```json
{
  "remaining": 450,
  "total": 1550,
  "goal": 2000,
  "date": "2025-11-17"
}
```

You can test it: `https://yourapp.com/api/widget`

---

**Which option would you prefer?** Option 1 (Widgetsmith) is easiest and works today.
