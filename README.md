# mortgage-document-ai
====================

A lightweight demo built to show how to extract structured data from mortgage documents using OCR and AI.

## Live Demo

-   **Try it out:** [Demo Link](https://demo.mortgageflow.io/)
-   **View sample JSON response:** [Sample Response Link](https://jsonhero.io/j/oRCDn1zAfQw5)

## What ML model is used

To extract structured data from mortgage documents, you must have an ML model trained on the documents you want to process.

In this demo, we use a custom model that we trained to extract 130 fields from the 1st and 2nd sections of the URLA Form 1003.

To create a custom model, we used **[Custom Document Extractor](https://cloud.google.com/document-ai/docs/workbench/build-custom-processor)** from **[Google Document AI](https://cloud.google.com/document-ai)**.

Here's the [document schema](https://github.com/mortgageflow/mortgage-document-ai/blob/main/packages/models/src/documents/urla-form-1003.ts) that contains a list of entities extracted from Form 1003.

## What's inside

### `models` package

`.packages/models`

It's a package that contains:

-   Normalized schema for each document type
-   And a collection of utils to map raw Google Document AI response to document schema

### `api` package

`.packages/api`

It is an express.js server with a single endpoint that:

-   Accepts documents from the frontend
-   Sends processing to Google document AI
-   Uses models to transform into normalized schema
-   Returns normalized data back to the frontend

### `ui` package

`.packages/ui`

It is a simple next.js/react.js application where the user can:

-   Upload document for processing
-   See the result of the processing

It has two main routes:

-   `/` - where the user can upload a document or select a sample
-   `/documents/[documentId]` - where users see the result of the document

## How it all works together

-   User uploads file into the `ui` on `/` route
-   `ui` sends the file for processing to the `api`
-   `api` sends the file for processing to the `Google Document AI`
-   `Google Document AI` process file using a custom model trained on our data
-   `api` uses document schemas & utils from `models` to DocumentResponse into usable data
-   `api` sends normalized document data to the `ui`
-   `ui` uses utils from models to transform data into usable for `ui`
-   `ui` renders extracted data on the `/documents/[documentId]` data

## How to deploy it

This repository is intended for education purposes.

But it might be a good starting point if you build your document processing solution.

Here's a rough outline of how to get this demo running on your servers:

1.  Train **Custom Document Extractor from Google Document AI**
    1.  Create a document extractor  
    2.  Create a schema of the document
    3.  Label documents to prepare data for training
    4.  Train the model
2.  Build document schema [(example)](https://github.com/mortgageflow/mortgage-document-ai/blob/main/packages/models/src/documents/urla-form-1003.ts)
    1.  Update processor name
    2.  Create a list of labels extracted by your model
    3.  Map labels into the document structure you want to get as an output
4.  Deploy the UI & API
    1.  Create [render.com](http://render.com) account
    2.  Use [render.com](http://render.com) blueprint to deploy (render.yaml)

If you need help building something similar, reach out to us [here](https://www.mortgageflow.io/book-a-demo).

## Technology stack

-   Document models
    -   Google Document AI
    -   TypeScript
-   Frontend UI
    -   React.js
    -   Next.js
    -   TypeScript
    -   Tailwind CSS
-   Backend API
    -   Node.js
    -   Express.js
    -   Typescript

## Author

Built by MortgageFlow

[Mortgage Software Consulting and Development Company](https://www.mortgageflow.io/)

mortgageflow.io
