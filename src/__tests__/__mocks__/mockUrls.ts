export const mockUrls = {
  valid: {
    simple: 'http://quotes.toscrape.com/',
    wikipedia: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
  },
  invalid: {
    notFound: 'https://example.com/does-not-exist',
    malformed: 'not-a-valid-url',
    blocked: 'https://www.facebook.com/',
  },
};

export const mockScrapedContent = {
  quotes: {
    title: 'Quotes to Scrape',
    content: `"The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking." - Albert Einstein
    
"It is our choices, Harry, that show what we truly are, far more than our abilities." - J.K. Rowling

"There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle." - Albert Einstein`,
  },
  wikipedia: {
    title: 'Artificial intelligence - Wikipedia',
    content: 'Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals...',
  },
  error: {
    title: undefined,
    content: undefined,
    error: 'Failed to scrape content from the URL.',
  },
};
