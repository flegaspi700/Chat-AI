# FileChat AI

An intelligent chat application built with Next.js and Genkit that allows you to get insights from your documents and websites. Upload files or provide URLs and start asking questions!

## Features

- **Conversational AI Chat:** Interact with an AI to ask questions and get information from your provided sources.
- **File Uploads:** Upload and process both `.txt` and `.pdf` files to use as a knowledge base.
- **Website Scraping:** Provide any website URL, and the application will scrape its content to use as a source for the chat.
- **Source Management:** A clean sidebar interface allows you to easily add, view, and remove your files and URL sources.
- **AI-Powered Theme Generation:** Dynamically create and apply color themes based on a text prompt.
- **Responsive Design:** A modern, responsive UI that works across different screen sizes.

## Getting Started

To get this project running locally, follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

    This will start the Next.js development server, typically on [http://localhost:9002](http://localhost:9002).

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Generative AI:** [Google Genkit](https://firebase.google.com/docs/genkit)
- **UI:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Web Scraping:** [Cheerio](https://cheerio.js.org/)
- **PDF Parsing:** [pdfjs-dist](https://mozilla.github.io/pdf.js/)

## Next Steps (Suggestions):

- **Persist Sources & Themes**: Save the user's uploaded files, URLs, and selected theme choice (including AI-generated ones) to the browser's local storage so they persist between sessions.
- **Streaming Responses**: Enhance the user experience by streaming AI responses token by token, rather than waiting for the full response to be generated.
- **Chat History**: Implement a feature to save and load past chat conversations.
- **User Authentication**: Add user accounts to allow individuals to save their files and chat history securely.
- **More File Types**: Expand file support to include other common formats like `.docx`, `.csv`, or even images.
- **Content Summaries**: Show a brief AI-generated summary for each uploaded file or URL to give the user a quick overview of the source material.