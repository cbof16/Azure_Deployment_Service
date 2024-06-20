# Azure Deployment Service

Azure Deployment Service is a Node.js application that allows users to upload files from a git repository to Azure Blob Storage and retrieve them based on subdomains. This project is inspired by similar deployment services and provides a seamless way to manage and access files in a structured manner.

## Features

- Clone git repositories and upload files to Azure Blob Storage.
- Generate unique session IDs for each upload.
- Track upload status using Redis.
- Serve files based on subdomains.
- Basic Express server setup with TypeScript.
- Containerized build process for easy deployment.

## Prerequisites

- Node.js installed
- Redis installed and running locally
- Azure account with Blob Storage set up
- Git installed

## Installation

### Clone the repository:

```bash
git clone <repository-url>
cd azure_deployment_service
```

### Install dependencies:

```bash
npm install
```

### Initialize TypeScript project:

```bash
npx tsc --init
```

### Configure TypeScript: Update `tsconfig.json` with basic configuration.

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```
### Add dependencies:

```bash
npm install express redis azure-storage simple-git cors
```
