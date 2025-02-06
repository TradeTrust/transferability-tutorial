# Transferability Tutorial

This tutorial walks you through setting up a simple React project using TypeScript and Vite. You'll integrate the **TrustVC** library to see how transactions and endorsement chain works of a W3C **Verifiable Credential (VC)** or **OpenAttestation** document.

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v18.x or higher)
- **npm** (v6.x or higher)

If you don't have them, you can download and install them from [Node.js official website](https://nodejs.org/).

## Setting Up the Project

Follow these steps to set up the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/TradeTrust/transferability-tutorial.git
   cd transferability-tutorial
   ```

2. **Install dependencies:**

   Use npm to install the necessary dependencies:

   ```bash
   npm install
   ```

3. **Update environment**
   Add and update the .env file with infura api key
   You can update the chain you want to test by updating the RPC url in app.js.
4. **Run the development server:**

   To start the project locally, run:

   ```bash
   npm run dev
   ```

## Transferring a document

You will have to sign the document to generate the Token ID and mint the token as well to see the endorsement chain.
