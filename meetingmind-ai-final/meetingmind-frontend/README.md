# MeetingMind AI — Intelligent Meeting Assistant

A production-ready frontend for MeetingMind AI, an intelligent meeting assistant powered by Z.AI's GLM series models. This application automatically transcribes, summarizes, and extracts action items from meetings, with an interactive Q&A interface.

## Features

- **Smart Summarization**: GLM-4 distills conversations into concise, actionable summaries
- **Action Item Extraction**: Automatically identifies tasks, owners, and deadlines
- **Q&A Interface**: Ask natural language questions about meeting content
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessible**: WCAG AA compliant with proper ARIA labels and keyboard navigation
- **Production-Ready**: Includes tests, CI/CD, and deployment configurations

## Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Build Tool**: Vite
- **Routing**: Wouter
- **UI Components**: shadcn/ui + Radix UI
- **Testing**: Vitest + React Testing Library
- **CI/CD**: GitHub Actions
- **AI Engine**: Z.AI GLM series models (mocked in frontend)

## Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/meetingmind-frontend.git
cd meetingmind-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests
npm test

# Run linter
npm run lint

# Type check
npm run check

# Format code
npm run format
```

## Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── pages/          # Page components (Home, Features, Pricing, Demo, About)
│   ├── components/     # Reusable UI components (Nav, Footer)
│   ├── lib/            # Utilities and mock API
│   │   ├── api.ts      # Mock API functions (processTranscript, answerQuestion)
│   │   └── mockData.ts # Sample transcript and mock outputs
│   ├── contexts/       # React contexts
│   ├── App.tsx         # Main app component with routing
│   ├── main.tsx        # React entry point
│   └── index.css       # Global styles and design tokens
├── tests/              # Test files
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.cjs
```

## Demo Page

The Demo page showcases the core functionality:

1. **Raw Transcript**: Pre-filled with a sample meeting transcript
2. **Process Button**: Simulates GLM processing (900ms delay)
3. **Summary Card**: Displays AI-generated summary
4. **Action Items Card**: Shows extracted tasks with owners and deadlines
5. **Q&A Box**: Ask questions about the meeting with keyword-based answers

### Sample Transcript

The demo uses a realistic Q3 marketing budget meeting with:

- Budget allocation discussion ($50k total)
- LinkedIn ads ($20k), content ($15k), events ($15k)
- Deadline: August 10th for events, August 5th for ad copy
- Action items assigned to Bob and Carol

### Mock API

The frontend includes mock implementations of:

- `processTranscript(transcript)` - Returns mocked summary and action items
- `answerQuestion(question)` - Keyword-based answer lookup

**To integrate with a real backend**, update `client/src/lib/api.ts` to call your backend endpoints instead of returning mocks.

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

- **Demo Component**: Process button, Q&A functionality, reset behavior
- **Navigation**: Link routing and active states
- **Accessibility**: ARIA labels, keyboard navigation

## Accessibility

- ✅ WCAG AA color contrast
- ✅ Keyboard navigation support
- ✅ ARIA labels on interactive elements
- ✅ `aria-live` regions for dynamic content updates
- ✅ Semantic HTML structure

## Performance

- **Lighthouse Target**: P90 > 90
- **FCP**: < 1.2s (fast 3G)
- **LCP**: < 1.8s
- **Optimized assets**: Minimal bundle size with tree-shaking

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Docker

```bash
# Build image
docker build -t meetingmind-frontend .

# Run container
docker run -p 3000:3000 meetingmind-frontend
```

### GitHub Pages

```bash
# Build static site
npm run build

# Deploy to gh-pages branch
npx gh-pages -d dist
```

## Environment Variables

The app uses the following environment variables (injected at build time):

- `VITE_APP_TITLE` - Application title
- `VITE_APP_LOGO` - Logo URL
- `VITE_ANALYTICS_ENDPOINT` - Analytics endpoint
- `VITE_ANALYTICS_WEBSITE_ID` - Analytics website ID

## Contributing

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes and commit: `git commit -am 'feat: add new feature'`
3. Push to the branch: `git push origin feat/your-feature`
4. Open a pull request

## Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `test:` - Test additions/updates
- `ci:` - CI/CD changes
- `docs:` - Documentation changes
- `style:` - Code style changes (no logic changes)
- `refactor:` - Code refactoring

## Credits

**MeetingMind AI** — Demo built using design & copy from the MeetingMind AI concept document.

**Core AI Attribution**: [Z.AI GLM series models](https://www.z-ai.com/) — Advanced language models for reasoning, generation, and orchestration.

Built during the **UK AI Agent Hackathon EP4** in collaboration with OpenClaw.

## License

MIT License — See LICENSE file for details

## Support

For issues, questions, or suggestions:

- 📧 Email: support@meetingmind.ai
- 🐛 GitHub Issues: [Report a bug](https://github.com/yourusername/meetingmind-frontend/issues)
- 💬 Discussions: [Join the conversation](https://github.com/yourusername/meetingmind-frontend/discussions)

## Roadmap

- [ ] Real backend integration with Z.AI API
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Slack bot for notifications
- [ ] Jira integration for ticket creation
- [ ] Meeting history and search
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard

---

**Made with ❤️ by the MeetingMind team**
