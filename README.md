#RepIQ — Advanced JavaScript & Vue 3 Project

RepIQ is a modern, responsive fitness and nutrition tracking application built with Vue 3 (Composition API), Pinia, Tailwind CSS, and Appwrite as the cloud backend platform. It enables regular users to plan workouts, log custom and system-verified meals, track macro targets dynamically, and monitor weekly muscle engagement via an interactive heatmap. It also features a secure administrative workspace for managing global system libraries.

Live Links & Documentation

Live Application: http://repiq.lucasalmeida.dk/

GitHub Repository: https://github.com/lucasalm7/exam-RepIQ

UI/UX Design Wireframes (Figma): https://www.figma.com/design/QmRunibMsHh8NbnO2OqCfX/RepIQ?node-id=0-1&p=f&t=vT6OlffjqKCjSYlZ-0

Architecture & Code Structure

The project follows a clean Separation of Concerns (SoC) and Single Responsibility Principle (SRP) design pattern:

Views (src/views/): Smart page containers responsible for route-level orchestration, layout composition, and high-level data synchronization (OverviewView, WorkoutsView, MealsView, AdminView, ProfileView, AuthView).

Stores (src/stores/): Pinia global state management stores (auth, workouts, meals, admin, library, logs) that communicate directly with Appwrite cloud services, handling asynchronous requests, error states, and local state caching.

Composables (src/composables/): Reusable reactive business logic and utility functions, including nutritional science calculations (useTdeeCalculator.js), role-based access checks (usePermissions.js), and modal state controllers (useModalState.js).

Components (src/components/): Modular, presentational (dumb) and interactive sub-components divided into logical feature directories (calendar, meals, overview, profile, workouts, shared).

Appwrite Backend & Data Structure

RepIQ uses Appwrite as its cloud database and authentication platform. Primary data is stored securely in remote collections rather than local storage:

profiles: Stores user metrics (height, weight, gender, birth date, activity level, calculated BMR/TDEE, and privacy flags) linked via userId.

exercises: Global system exercise library maintained by administrators and staff.

preset_meals: Verified system meal presets created by the RepIQ team.

user_exercises: Personal custom exercises created by individual users with private document-level permissions.

meals: User-created custom nutrition logs and recipes.

calendar: Centralized activity scheduling collection that tracks daily workout and meal items linked to specific dates and users, enabling the weekly overview map and muscle heatmap calculations.

Security & Permissions

Frontend: Protected router routes and navigation guards (router/index.js) verify session validity and user profiles before granting access.

Backend: Appwrite document-level permissions (Permission.read/update/delete(Role.user(userId))) ensure users can only modify their own personal records, while administrative endpoints enforce strict role checks (isAdmin / team).

AI-Assisted Development & Reflection

As part of modern software engineering workflows, AI tools (such as Claude and ChatGPT) were utilized during the development of RepIQ. Below is the required reflection for the oral examination:

1. Tools Used

AI Models: Claude (Anthropic) and ChatGPT (OpenAI).

Primary Use Cases: Architectural brainstorming, drafting complex reactive composable logic (such as date-range calculations in useWeeklyCalendar.js and matrix mapping in useMuscleHeatmap.js), debugging asynchronous Appwrite query filters, and structuring Tailwind CSS layouts.

2. Example Where AI Helped

AI significantly accelerated the development of the Weekly Calendar & Muscle Heatmap synchronization. When implementing the 7-day Monday–Sunday date generator and mapping weekly calendar documents to front/back SVG muscle group highlights, AI helped structure the pure utility function to handle ISO date conversions and reactive Set mapping efficiently, ensuring the UI updated instantly when users added or removed workouts.

3. Example Where AI Suggestion Was Modified or Rejected

During the implementation of macro calculations, an initial AI suggestion proposed calculating TDEE and macro distributions entirely inside Vue template inline expressions or massive watcher blocks. This introduced unnecessary complexity and violated the Separation of Concerns principle.

The Correction: I rejected the inline approach, extracted the math into pure functions inside useTdeeCalculator.js, and converted the values into clean, reactive computed properties inside component stores and views. This kept the UI code readable, testable, and maintainable.

4. Critical Reflection

AI is an exceptionally powerful partner for rapid prototyping, explaining syntax, and brainstorming boilerplate architecture. However, human evaluation remains indispensable. AI-generated code frequently lacks context regarding specific backend permissions (like Appwrite's role-based permission syntax) or can introduce subtle edge-case bugs in asynchronous loading states. Critical code review, rigorous manual testing in the browser, and architectural oversight by the developer are mandatory to ensure security, performance, and clean design.
