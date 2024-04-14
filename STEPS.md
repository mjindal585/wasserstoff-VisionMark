# Backend Developer Task: VisionMark AI-Assisted Annotation Suite

## Overview

VisionMark is a cutting-edge, mobile-first application aimed at simplifying the data collection and annotation process for preparing training datasets for YOLO image recognition models. This task challenges you, as a backend developer candidate, to architect and implement the backend services for VisionMark. Your goal is to develop a scalable, efficient system capable of handling image processing, user management, automatic annotations, and data exporting functionalities.

## Tech Stack Used

- Node and Express for services
- Typescript
- JWT for authentication
- Brcrypt for storing password
- MongoDB as database
- Mongoose as ODM
- Multer for file upload

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd repo-name
```
2. Install dependencies:
```bash
npm install
```
3. Setup env taking reference from .env.example file.
4. Clone https://github.com/mjindal585/annotations-flask-api and follow its README guide.

## Usage

1. Run the Node server:

```bash
npm run start
```
## Linting
We also use [Eslint](https://github.com/eslint/eslint) with Typescript Standard Style.
- To run lint:
  ```bash
  npm run lint
  ```
## IDE
Preferred IDE is `VSCODE`
Please enable following plugins for your editor:
- **EditorConfig:** To enable reading of .editorconfig file for consistent coding convention.
- **Eslint:** For linting errors


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
