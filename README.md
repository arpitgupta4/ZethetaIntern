# 🏦 LendSwift: Digital Loan Application Form

LendSwift is a production-grade, 8-step multi-step loan application form designed for a modern digital lending startup. The project focuses on complex form engineering, real-time cross-step validation, state persistence, and automated end-to-end testing.

## 🚀 Key Features

* **Multi-Step Dynamic Flow:** Seamless navigation through 8 distinct stages with conditional rendering based on user inputs (e.g., Step 6 only triggers for high-value personal loans).
* **Real-time Validation:** Robust, schema-based validation using Zod and React Hook Form, including strict Regex checks for government identifiers (PAN/Aadhaar).
* **Auto-Save & Resume:** State persistence functionality that utilizes LocalStorage to ensure users never lose their progress if the browser is refreshed or closed.
* **Simulated Backend APIs:** Mocked network requests for KYC document verification and PIN code address auto-completion with dedicated loading states.
* **Advanced UI/UX:** * Native HTML5 `<canvas>` integration for E-Signature capture.
* Document upload handling.
* Dynamic sub-form rendering based on employment type (Salaried vs. Self-Employed).


* **Fully Automated E2E Testing:** A comprehensive Cypress testing suite that acts as a "virtual user," verifying DOM states, file uploads, canvas drawing, and full application submissions.

## 🛠 Technical Stack

* **Framework:** React 18 (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Form Management:** React Hook Form
* **Validation:** Zod
* **State Management:** React Context API
* **Icons:** Lucide-React
* **Testing:** Cypress (E2E Automation)

## 📦 Getting Started

### Prerequisites

* Node.js (v18+)
* npm or yarn

### Installation & Setup

1. **Clone the repository:**
```bash
git clone <your-repository-url>
cd lendswift

```


2. **Install dependencies:**
```bash
npm install

```


3. **Run the development server:**
```bash
npm run dev

```


*Open `http://localhost:5173` in your browser.*

## 🧪 Automated Testing (Cypress)

The application includes a robust End-to-End testing suite that validates the entire "Happy Path" user journey, from initial load to final submission.

**To open the interactive Cypress Test Runner:**

```bash
npx cypress open

```

**To run tests headlessly (CI/CD mode):**

```bash
npx cypress run

```

### Edge Cases Covered in Tests:

* **Age Restriction:** Rejects date-of-birth entries that make the applicant < 21 years old.
* **PAN Verification:** Strict validation rules enforcing the 4th character entity type constraint.
* **Conditional Routing:** Verifies Step 6 (Co-Applicant) properly intercepts the flow when a loan exceeds ₹5,00,000.
* **Canvas Simulation:** Automates mouse events to draw a simulated e-signature on the HTML5 canvas.
* **File Uploads:** Programmatically attaches mock `.pdf` fixtures to file inputs.

## 📋 Architecture Overview

The application follows a modular, scalable architecture:

* `/src/context` - Global Context API state management to track and save form data across steps.
* `/src/components/forms` - Independent, isolated components for each of the 8 form steps.
* `/src/schemas` - Centralized `zod` validation rules to keep components clean.
* `/cypress/e2e` - Automated test scripts interacting directly with the DOM.
* `/cypress/fixtures` - Dummy assets (like `test-doc.pdf`) used for automated testing.

## 📈 Performance Benchmarks

Designed to meet and exceed strict performance standards:

* **Lighthouse Performance Score:** > 90
* **Accessibility Score:** 100
* **First Contentful Paint (FCP):** < 1.8s
* **Total Blocking Time:** < 200ms

--