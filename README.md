

# Misinformation Detection – GenAI

Harness the power of **AI** to detect misinformation, fraud, and synthetic media.
This repository contains everything you need to run the **CodeHustlers** app locally or deploy it on AI Studio.

---

## 🚀 Run Locally

**Prerequisites:** [Node.js](https://nodejs.org/) (v18+ recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/jahnavi-varma/Misinformation_detection-GenAi.git
   cd Misinformation_detection-GenAi
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your API key:

   ```env
   VITE_GENAI_API_KEY=your_api_key_here
   ```

4. **Run the app**

   ```bash
   npm run dev
   ```

   The app will be available at **[http://localhost:5173](http://localhost:5173)** by default.

---

## 📂 Project Structure

```
Misinformation_detection-GenAi/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/           # App pages (Home, Results, etc.)
│   ├── services/        # API integration & utilities
│   ├── App.tsx          # Main app entry
│   └── main.tsx         # Vite entry point
├── .env.example         # Example env file
├── package.json         # Project metadata & dependencies
├── vite.config.ts       # Vite configuration
└── README.md
```

---

## ⚙️ How It Works

* Users input text or a URL.
* The app sends the content to a Generative AI model via API.
* The model:

  * Detects potential misinformation or fake content.
  * Provides an explanation and confidence level.
* Results are displayed in a clean, user-friendly interface.

---

## 🧪 Testing & Linting

```bash
# Run tests
npm test

# Run ESLint
npm run lint
```

---

## 🚀 Deployment

You can deploy this app to **Vercel**, **Netlify**, or any static hosting provider:

```bash
npm run build
```

This generates a production-ready `dist/` folder.

For AI Studio deployment, follow the platform’s app publishing guide.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🛠️ Roadmap & Improvements

* [ ] Add support for multiple AI models
* [ ] Extend input sources (PDF, images, social media posts)
* [ ] Improve confidence scoring & visualization
* [ ] Add multilingual misinformation detection

---

## 📜 License

This project is licensed under the MIT License.

---

## 🙌 Credits

Built with ❤️ by **CodeHustlers Team**.
