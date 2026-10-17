# 🛒 বাজার দর | BazarDor

প্রয়োজনীয় পণ্যের দাম এক নজরে।

BazarDor is a responsive grocery price application for Bangladesh. Browse daily prices, explore product categories, and compare prices across markets through a Bengali interface.

## 🔗 Project Links

- **Live Website:** https://github.com/mdfahadhosen20/bazardor-app
- **GitHub Repository:** https://github.com/mdfahadhosen20/bazardor-app

## ✨ Features

- Responsive layouts for mobile, tablet, and desktop.
- Category navigation with active highlighting and horizontal scrolling on mobile.
- Scrolling price ticker with clickable product links.
- Home page sections for the top six price risers, top six price fallers, and all products.
- Prices and percentage changes displayed in Bengali numerals.
- Category filtering and ascending or descending price sorting.
- Protected product details and profile pages.
- Market price tables with minimum, maximum, and average prices.
- Email and password registration and sign-in.
- Google and GitHub social sign-in.
- Profile updates for name, optional phone number, and optional address.
- Toast notifications, loading skeletons, retry controls, and a custom 404 page.
- Authentication data stored in MongoDB Atlas.

## 🛠️ Technologies

- **Next.js App Router:** routing and server rendering.
- **React:** components and interactive forms.
- **TypeScript:** type checking.
- **Tailwind CSS:** styling and responsive layouts.
- **Better Auth:** authentication and session management.
- **MongoDB Atlas:** hosted database for users, accounts, and sessions.
- **MongoDB Node.js Driver:** database connectivity.
- **Better Auth MongoDB Adapter:** authentication database integration.
- **react-hot-toast:** toast notifications.
- **Hind Siliguri:** Bengali typography.
- **Vercel:** deployment.

## 📄 Main Routes

| Route | Description | Access |
| --- | --- | --- |
| `/` | Home page and product lists | Public |
| `/category/[slug]` | Category products and price sorting | Public |
| `/product/[slug]` | Product details and market prices | Sign-in required |
| `/signin` | Email and social sign-in | Public |
| `/signup` | Account registration | Public |
| `/profile` | Personal profile | Sign-in required |
| `/profile/update` | Profile editing | Sign-in required |

## 🚀 Run Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
MONGODB_URI="mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/?retryWrites=true&w=majority"
MONGODB_DB_NAME="bazardor"

BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-generated-auth-secret"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

Replace the placeholders with your own configuration.

Generate an authentication secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Configure MongoDB Atlas

- Create a MongoDB Atlas cluster.
- Create a database user with `readWrite` access to the `bazardor` database.
- Configure the IP Access List to allow connections from your development environment.
- Copy the cluster connection string into `MONGODB_URI`.
- URL-encode special characters in the connection string password.

The application uses the Better Auth MongoDB adapter. Authentication collections are created when authentication data is first written.

### 4. Configure OAuth callbacks

Add the following callback URLs to your OAuth applications.

**Google:**

```text
http://localhost:3000/api/auth/callback/google
```

**GitHub:**

```text
http://localhost:3000/api/auth/callback/github
```

### 5. Start the development server

```bash
npm run dev
```

Open http://localhost:3000.

## ✅ Project Checks

Run the linter:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Start the production server after building:

```bash
npm start
```

## 🌐 Product API

Product prices are fetched from:

```text
https://openapi.programming-hero.com/api/bazardor
```

Endpoints used by the application include:

- `/products`
- `/products?category=chal`
- `/products/:id`

Website product routes use slugs. The application finds the matching product ID before fetching its detailed information.

Product prices come from the external API. MongoDB stores authentication and profile data.

## 💰 Price Calculations

- Today's price and percentage change come from the product API.
- The minimum price is the lowest minimum among the listed markets.
- The maximum price is the highest maximum among the listed markets.
- The average price is the mean of the midpoint prices of the listed markets.
- Price risers and fallers are ranked by the magnitude of their percentage change.
- Displayed prices are indicative and may differ from actual market prices.

## 🔐 Authentication

Better Auth handles email and password authentication, Google sign-in, GitHub sign-in, and sessions through its MongoDB adapter.

The server checks the session before displaying protected product details and profile pages. Visitors without a valid session are redirected to sign in.

Email registration redirects to the sign-in page. Successful sign-in redirects to the home page.

Users can update their name, phone number, and address. Phone number and address are optional.

## 📦 Deployment

1. Import the GitHub repository into Vercel.
2. Add the environment variables to the deployment environment.
3. Set `BETTER_AUTH_URL` to the production website URL.
4. Configure MongoDB Atlas network access for the deployment environment.
5. Add the production OAuth callback URLs:

   Google:

   ```text
   https://bazardor-app.vercel.app/api/auth/callback/google
   ```

   GitHub:

   ```text
   https://bazardor-app.vercel.app/api/auth/callback/github
   ```

6. Deploy the application.
7. Test registration, email sign-in, social sign-in, profile updates, protected pages, and page refreshes.

Keep `.env` files and real credentials out of Git.
