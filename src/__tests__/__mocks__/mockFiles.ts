import type { FileInfo } from '@/lib/types';

export const mockTextFile: FileInfo = {
  name: 'sample-article.txt',
  content: `The History of Artificial Intelligence

Artificial Intelligence (AI) has a rich history dating back to the mid-20th century. The term "artificial intelligence" was coined by John McCarthy in 1956 at the Dartmouth Conference.

Early Developments (1950s-1960s)
The foundations of AI were laid by pioneers like Alan Turing, who proposed the Turing Test in 1950 as a measure of machine intelligence.`,
  type: 'file',
  source: 'sample-article.txt',
};

export const mockPolicyFile: FileInfo = {
  name: 'company-policies.txt',
  content: `TechCorp Company Policies

1. REMOTE WORK POLICY

Eligibility:
All full-time employees are eligible for remote work arrangements after completing their 90-day probationary period.

2. PAID TIME OFF (PTO)

Accrual Rates:
- 0-2 years: 15 days per year
- 3-5 years: 20 days per year
- 6+ years: 25 days per year`,
  type: 'file',
  source: 'company-policies.txt',
};

export const mockUrlContent: FileInfo = {
  name: 'Quotes to Scrape',
  content: `"The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking." - Albert Einstein

"It is our choices, Harry, that show what we truly are, far more than our abilities." - J.K. Rowling`,
  type: 'url',
  source: 'http://quotes.toscrape.com/',
};

export const mockFileList: FileInfo[] = [
  mockTextFile,
  mockPolicyFile,
  mockUrlContent,
];

export const createMockFile = (overrides?: Partial<FileInfo>): FileInfo => ({
  name: 'test-file.txt',
  content: 'Test file content',
  type: 'file',
  source: 'test-file.txt',
  ...overrides,
});
