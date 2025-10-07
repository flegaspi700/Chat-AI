# Test Files for NoteChat-AI

This directory contains sample files and URLs for testing the NoteChat-AI application.

## 📁 Available Test Files

### Text Files (.txt)

1. **sample-article.txt** (2.5 KB)
   - Topic: History of Artificial Intelligence
   - Content: Educational article about AI development timeline
   - Use case: Test basic text file upload and Q&A

2. **company-policies.txt** (5.8 KB)
   - Topic: Employee handbook and company policies
   - Content: Detailed workplace policies (remote work, PTO, benefits)
   - Use case: Test longer document parsing and specific policy questions

3. **recipe-collection.txt** (3.2 KB)
   - Topic: Cooking recipes
   - Content: 5 classic recipes with ingredients and instructions
   - Use case: Test structured data extraction and ingredient questions

### HTML Files (can be converted to PDF)

4. **machine-learning-guide.html** (10 KB)
   - Topic: Introduction to Machine Learning
   - Content: Comprehensive ML guide with formatting
   - Use case: Test HTML rendering and complex document structure
   - **To convert to PDF:** Open in browser → Print → Save as PDF

### Reference Documents

5. **LEGAL-URLS-FOR-TESTING.md** (8 KB)
   - Content: 20+ legal URLs safe for web scraping
   - Categories: Practice sites, news, government data, educational resources
   - Use case: Reference for URL testing

## 🧪 How to Use These Files

### Testing File Upload (.txt)

1. Open NoteChat-AI at http://localhost:9002
2. Click the sidebar (hamburger menu if on mobile)
3. Look for "Upload File" or similar button
4. Select one of the .txt files
5. Wait for processing
6. Try asking questions like:
   - "When was the term 'artificial intelligence' coined?" (sample-article.txt)
   - "How many PTO days do employees get?" (company-policies.txt)
   - "What ingredients do I need for carbonara?" (recipe-collection.txt)

### Testing PDF Upload

**Option 1: Convert HTML to PDF**
1. Open `machine-learning-guide.html` in your browser
2. Press `Ctrl+P` (Print)
3. Select "Save as PDF" or "Microsoft Print to PDF"
4. Save as `machine-learning-guide.pdf`
5. Upload to NoteChat-AI

**Option 2: Use Online Converter**
1. Go to https://www.adobe.com/acrobat/online/html-to-pdf.html
2. Upload `machine-learning-guide.html`
3. Download the PDF
4. Upload to NoteChat-AI

**Option 3: Download Sample PDFs**
These are legal, freely available PDFs you can download and test:
- [Attention Is All You Need (Transformers paper)](https://arxiv.org/pdf/1706.03762.pdf)
- [Python Documentation PDF](https://docs.python.org/3/download.html)

### Testing URL Scraping

Use URLs from `LEGAL-URLS-FOR-TESTING.md`. **Start with these 5:**

**Easy (Simple HTML):**
1. `http://quotes.toscrape.com/`
   - Ask: "What quotes are on the first page?"

2. `https://example.com/`
   - Ask: "What is the main message of this page?"

**Medium (Real Content):**
3. `https://en.wikipedia.org/wiki/Artificial_intelligence`
   - Ask: "When was the Turing test proposed?"

4. `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide`
   - Ask: "What topics are covered in the JavaScript guide?"

**Complex (Rich Content):**
5. `https://www.scrapethissite.com/pages/simple/`
   - Ask: "What countries are listed on this page?"

## 📊 Recommended Test Scenarios

### Scenario 1: Single File Q&A
1. Upload `sample-article.txt`
2. Ask 3-5 questions about AI history
3. Verify accurate responses

### Scenario 2: Multiple Files
1. Upload `sample-article.txt` AND `company-policies.txt`
2. Ask: "What's the connection between AI and remote work policies?"
3. Test if AI can synthesize information from both sources

### Scenario 3: File + URL Combination
1. Upload `recipe-collection.txt`
2. Add URL: `https://en.wikipedia.org/wiki/Italian_cuisine`
3. Ask: "Tell me about carbonara based on my sources"
4. Verify it uses both file and URL

### Scenario 4: Large Document
1. Upload/scrape the ML guide (as PDF or HTML)
2. Ask: "Summarize the types of machine learning"
3. Ask: "What are the steps in the ML workflow?"
4. Test handling of longer content

### Scenario 5: Structured Data
1. Upload `recipe-collection.txt`
2. Ask: "List all recipes and their main ingredients"
3. Test extraction of structured information

### Scenario 6: Comparison Questions
1. Upload multiple files
2. Ask: "Compare the key concepts across my sources"
3. Test analytical capabilities

## ✅ Testing Checklist

- [ ] Upload .txt file successfully
- [ ] Upload PDF file successfully
- [ ] Scrape simple URL (quotes.toscrape.com)
- [ ] Scrape Wikipedia article
- [ ] Ask factual questions from uploaded file
- [ ] Ask questions requiring inference
- [ ] Test with multiple files simultaneously
- [ ] Test file + URL combination
- [ ] Remove a source and verify it's no longer used
- [ ] Test with empty sources (should prompt to add sources)
- [ ] Test with very long document (10+ pages)
- [ ] Test error handling (invalid URL)
- [ ] Test error handling (unsupported file type)

## 🐛 Known Issues to Watch For

1. **PDF Parsing:**
   - Large PDFs may take 10-30 seconds to process
   - Some PDFs with complex formatting may not parse correctly
   - Image-based PDFs (scanned documents) won't work without OCR

2. **URL Scraping:**
   - JavaScript-heavy sites may not load properly
   - Some sites block scrapers (403/429 errors)
   - Very large pages may timeout
   - Sites with authentication won't work

3. **Context Window:**
   - Too many sources may exceed AI context limits
   - Very long documents may be truncated
   - Combining 10+ sources may cause issues

## 💡 Sample Questions by File

### sample-article.txt
- "When was the term 'artificial intelligence' coined?"
- "What happened during the first AI winter?"
- "What are some current challenges in AI?"
- "How has deep learning changed AI?"

### company-policies.txt
- "How many PTO days do employees get after 3 years?"
- "What is the remote work policy?"
- "How much is the fitness reimbursement?"
- "What's the process for requesting time off?"

### recipe-collection.txt
- "What ingredients do I need for chocolate chip cookies?"
- "How long do I bake the cookies?"
- "What's the cooking temperature for carbonara?"
- "List all the recipes in the collection"

### machine-learning-guide.html/pdf
- "What are the three types of machine learning?"
- "Explain the bias-variance tradeoff"
- "What are some popular ML libraries?"
- "What are the steps in the ML workflow?"

## 🎯 Pro Testing Tips

1. **Start Simple:** Begin with simple questions before complex ones
2. **Test Boundaries:** Try questions your sources can't answer
3. **Mix Sources:** Combine files and URLs to test source attribution
4. **Check Accuracy:** Verify AI responses against source content
5. **Test Limits:** See how many sources you can add before issues
6. **Error Cases:** Test with broken URLs, empty files, wrong formats

## 📝 Creating Your Own Test Files

Want to create custom test files? Here's how:

**Text Files:**
```bash
# Create a new .txt file
New-Item -Path "my-test-file.txt" -ItemType File
# Edit with notepad
notepad my-test-file.txt
```

**Convert Anything to PDF:**
1. Create any document (Word, HTML, etc.)
2. Print to PDF
3. Save in this test-files folder

## 🔗 Additional Resources

- [More Practice Scraping Sites](http://toscrape.com/)
- [Public APIs for Testing](https://github.com/public-apis/public-apis)
- [Free PDF Books (Legal)](https://www.gutenberg.org/)
- [Creative Commons Content](https://search.creativecommons.org/)

---

**Happy Testing! 🚀**

If you encounter any issues, check the browser console (F12) for error messages.
