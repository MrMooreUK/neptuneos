
# 🤝 Contributing to NeptuneOS

Welcome to the NeptuneOS community! We're excited that you want to contribute to making aquarium monitoring better for everyone. 🐠

## 🌊 Getting Started

### 🍴 Fork & Clone
1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/neptuneos.git
   cd neptuneos
   ```
3. **Add upstream** remote to sync changes from the main repository:
   ```bash
   git remote add upstream https://github.com/lovable-community/neptuneos.git
   ```

### 🛠️ Development Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start development server**:
   ```bash
   npm run dev
   ```
3. **Run tests** (when available):
   ```bash
   npm test
   ```

## 📝 Contribution Types

We welcome various types of contributions:

### 🐛 Bug Fixes
- Fix existing issues or bugs
- Improve error handling
- Enhance stability

### ✨ New Features
- Add new monitoring capabilities
- Implement UI enhancements
- Create new integrations

### 📚 Documentation
- Improve README and guides
- Add code comments
- Create tutorials

### 🎨 Design & UX
- Enhance visual design
- Improve user experience
- Create new themes

### 🔧 Infrastructure
- Optimize build process
- Improve testing
- Enhance CI/CD

## 🚀 Development Workflow

### 1️⃣ Create a Branch
```bash
# Create and switch to a new branch
git checkout -b feature/amazing-new-feature

# Or for bug fixes
git checkout -b fix/sensor-reading-bug
```

### 2️⃣ Make Changes
- Follow our coding standards (see below)
- Write clear, descriptive commit messages
- Test your changes thoroughly

### 3️⃣ Commit Guidelines
We follow conventional commits:

```bash
# Feature
git commit -m "feat: add temperature alert notifications"

# Bug fix
git commit -m "fix: resolve sensor reading timeout issue"

# Documentation
git commit -m "docs: update API documentation"

# Style
git commit -m "style: improve responsive layout for mobile"

# Refactor
git commit -m "refactor: extract temperature utils to separate file"

# Test
git commit -m "test: add unit tests for temperature conversion"
```

### 4️⃣ Push & Pull Request
```bash
# Push your branch
git push origin feature/amazing-new-feature

# Create a Pull Request on GitHub
```

## 📋 Pull Request Guidelines

### Before Submitting
- ✅ Ensure code follows our style guide
- ✅ Test on multiple screen sizes
- ✅ Update documentation if needed
- ✅ Add/update tests when applicable
- ✅ Verify no build errors

### PR Template
When creating a pull request, include:

```markdown
## 📋 Description
Brief description of changes

## ✨ Type of Change
- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 📚 Documentation update
- [ ] 🎨 Style/UI improvement
- [ ] 🔧 Refactoring

## 🧪 Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested with mock data
- [ ] Tested with real hardware (if applicable)

## 📸 Screenshots
(If applicable, add screenshots)

## 📝 Notes
Any additional information
```

## 💻 Coding Standards

### TypeScript Guidelines
```typescript
// ✅ Good: Use descriptive names
interface TemperatureReading {
  sensor1: number;
  sensor2: number;
  timestamp: string;
}

// ✅ Good: Use proper typing
const convertTemperature = (temp: number, unit: 'C' | 'F'): number => {
  return unit === 'F' ? (temp * 9/5) + 32 : temp;
};

// ❌ Bad: Any types
const processData = (data: any) => {
  // Avoid any types
};
```

### React Components
```tsx
// ✅ Good: Functional components with TypeScript
interface Props {
  temperature: number;
  unit: 'C' | 'F';
  onUnitChange: (unit: 'C' | 'F') => void;
}

const TemperatureDisplay = ({ temperature, unit, onUnitChange }: Props) => {
  return (
    <div className="temperature-display">
      <span>{temperature}°{unit}</span>
      <button onClick={() => onUnitChange(unit === 'C' ? 'F' : 'C')}>
        Switch to °{unit === 'C' ? 'F' : 'C'}
      </button>
    </div>
  );
};

export default TemperatureDisplay;
```

### CSS/Tailwind Guidelines
```tsx
// ✅ Good: Use semantic class names and design tokens
<div className="bg-primary text-primary-foreground rounded-lg p-4">
  <h2 className="text-lg font-semibold mb-2">Temperature</h2>
  <p className="text-2xl font-bold">{temperature}°{unit}</p>
</div>

// ❌ Bad: Hard-coded colors
<div className="bg-blue-500 text-white rounded-lg p-4">
  // Don't use hard-coded colors
</div>
```

### File Organization
```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── features/           # Feature-specific components
│   └── layout/             # Layout components
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions
├── types/                  # TypeScript type definitions
├── contexts/               # React contexts
└── pages/                  # Page components
```

### Component Guidelines
- 📝 **Small & Focused**: Keep components under 100 lines when possible
- 🧩 **Single Responsibility**: One component, one purpose
- 🔄 **Reusable**: Design for reusability
- 📱 **Responsive**: Always consider mobile first
- ♿ **Accessible**: Include proper ARIA labels and semantic HTML

## 🎨 Design Guidelines

### Design System Usage
- 🎨 Use design tokens from `index.css`
- 🌈 Follow the aquatic color palette
- 📱 Maintain responsive design patterns
- ♿ Ensure accessibility standards

### UI/UX Principles
- **Clarity**: Make interfaces intuitive
- **Consistency**: Follow established patterns
- **Feedback**: Provide clear user feedback
- **Performance**: Optimize for speed
- **Accessibility**: Design for everyone

## 🧪 Testing Guidelines

### Unit Tests
```typescript
// Example test structure
describe('Temperature Utils', () => {
  describe('convertTemperature', () => {
    it('should convert Celsius to Fahrenheit correctly', () => {
      expect(convertTemperature(25, 'F')).toBe(77);
    });

    it('should return Celsius unchanged', () => {
      expect(convertTemperature(25, 'C')).toBe(25);
    });
  });
});
```

### Manual Testing Checklist
- ✅ **Responsive Design**: Test on different screen sizes
- ✅ **Dark/Light Mode**: Verify both themes work
- ✅ **User Interactions**: Test all buttons and forms
- ✅ **Error Handling**: Test error states
- ✅ **Performance**: Check loading times

## 🐛 Bug Reports

When reporting bugs, include:

### 🔍 Bug Report Template
```markdown
## 🐛 Bug Description
Clear description of the bug

## 🔄 Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## ✅ Expected Behavior
What you expected to happen

## 📱 Environment
- Device: [e.g. iPhone 12, Desktop]
- Browser: [e.g. Chrome 96, Safari 15]
- OS: [e.g. iOS 15, Windows 11]
- NeptuneOS Version: [e.g. v1.0]

## 📸 Screenshots
(If applicable)

## 📝 Additional Context
Any other relevant information
```

## 💡 Feature Requests

### ✨ Feature Request Template
```markdown
## 🎯 Feature Description
Clear description of the feature

## 🤔 Problem/Use Case
What problem does this solve?

## 💡 Proposed Solution
How should this feature work?

## 🔄 Alternatives Considered
Other solutions you've considered

## 📸 Mockups/Sketches
(If applicable)
```

## 🏷️ Issue Labels

We use these labels to organize issues:

- 🐛 **bug**: Something isn't working
- ✨ **enhancement**: New feature or request
- 📚 **documentation**: Improvements to docs
- 🆘 **help wanted**: Extra attention needed
- 🥇 **good first issue**: Good for newcomers
- 🎨 **design**: UI/UX improvements
- 🔧 **infrastructure**: Build/deploy improvements
- 📱 **mobile**: Mobile-specific issues
- ♿ **accessibility**: Accessibility improvements

## 🎉 Recognition

### Contributors Wall
All contributors are recognized in our README.md and will be featured in:
- 📝 CONTRIBUTORS.md file
- 🎉 Release notes
- 🐙 GitHub contributors section
- 💬 Discord community highlights

### Contribution Levels
- 🌱 **First Contribution**: Welcome to the community!
- 🌿 **Regular Contributor**: Multiple merged PRs
- 🌳 **Core Contributor**: Significant impact on the project
- 🏆 **Maintainer**: Trusted with project maintenance

## 📞 Getting Help

### Where to Ask Questions
- 💬 **Discord**: [Community Chat](https://discord.com/channels/1119885301872070706/1280461670979993613)
- 📝 **GitHub Discussions**: For detailed technical discussions
- 🐛 **GitHub Issues**: For bug reports and feature requests
- 📚 **Documentation**: Check existing docs first

### Development Support
- 🛠️ **Setup Issues**: Ask in Discord #development channel
- 🐛 **Bug Investigation**: Create detailed GitHub issue
- 💡 **Feature Planning**: Start a GitHub discussion
- 📚 **Documentation**: Ask in Discord #documentation

## 📜 Code of Conduct

### Our Pledge
We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Expected Behavior
- ✅ Be respectful and inclusive
- ✅ Welcome newcomers and help them learn
- ✅ Focus on constructive feedback
- ✅ Acknowledge different perspectives
- ✅ Show empathy towards community members

### Unacceptable Behavior
- ❌ Harassment or discriminatory language
- ❌ Personal attacks or trolling
- ❌ Public or private harassment
- ❌ Publishing others' private information
- ❌ Other conduct inappropriate in a professional setting

## 🙏 Thank You!

Thank you for taking the time to contribute to NeptuneOS! Every contribution, no matter how small, helps make aquarium monitoring better for the entire community. 

### Special Thanks
- 🌊 **Early Adopters**: For testing and feedback
- 🐛 **Bug Reporters**: For helping improve stability
- 💡 **Feature Contributors**: For expanding capabilities
- 📚 **Documentation Writers**: For making the project accessible
- 🎨 **Designers**: For improving user experience

---

Happy coding! 🐠💻 Let's build something amazing together!
