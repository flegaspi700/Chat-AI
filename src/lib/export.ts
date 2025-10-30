import type { Conversation } from './types';
import { jsPDF } from 'jspdf';

/**
 * Formats a conversation as plain text
 */
export function exportConversationToTxt(conversation: Conversation): string {
  const lines: string[] = [];
  
  // Header
  lines.push('='.repeat(50));
  lines.push(conversation.title);
  lines.push('='.repeat(50));
  lines.push('');
  
  // Metadata
  const createdDate = new Date(conversation.createdAt).toLocaleString();
  const updatedDate = new Date(conversation.updatedAt).toLocaleString();
  lines.push(`Created: ${createdDate}`);
  lines.push(`Last Updated: ${updatedDate}`);
  lines.push(`Messages: ${conversation.messages.length} messages`);
  lines.push('');
  
  // Sources section
  lines.push('-'.repeat(50));
  lines.push('SOURCES');
  lines.push('-'.repeat(50));
  if (conversation.sources.length > 0) {
    conversation.sources.forEach((source, index) => {
      lines.push(`${index + 1}. ${source.name} (${source.type})`);
      if (source.summary) {
        lines.push(`   Summary: ${source.summary}`);
      }
      lines.push('');
    });
  } else {
    lines.push('No sources used in this conversation.');
    lines.push('');
  }
  
  // Messages section
  lines.push('-'.repeat(50));
  lines.push('CONVERSATION');
  lines.push('-'.repeat(50));
  lines.push('');
  
  conversation.messages.forEach((message, index) => {
    const label = message.role === 'user' ? 'USER' : 'AI';
    lines.push(`${label}:`);
    lines.push(message.content);
    
    // Add separator between messages (but not after the last one)
    if (index < conversation.messages.length - 1) {
      lines.push('');
      lines.push('-'.repeat(50));
      lines.push('');
    }
  });
  
  lines.push('');
  lines.push('='.repeat(50));
  lines.push('End of conversation');
  lines.push('='.repeat(50));
  
  return lines.join('\n');
}

/**
 * Exports a conversation as PDF
 */
export async function exportConversationToPdf(
  conversation: Conversation
): Promise<{ success: boolean; filename?: string; error?: string }> {
  try {
    if (!conversation) {
      throw new Error('Invalid conversation object');
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper function to add text with page break support
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const lines = doc.splitTextToSize(text, maxWidth);
      
      lines.forEach((line: string) => {
        if (yPosition + 10 > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += fontSize * 0.5;
      });
    };

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(conversation.title, margin, yPosition);
    yPosition += 12;

    // Metadata
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Created: ${new Date(conversation.createdAt).toLocaleString()}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Updated: ${new Date(conversation.updatedAt).toLocaleString()}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Messages: ${conversation.messages.length}`, margin, yPosition);
    yPosition += 12;

    // Sources section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Sources', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (conversation.sources.length > 0) {
      conversation.sources.forEach((source, index) => {
        if (yPosition + 15 > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(`${index + 1}. ${source.name} (${source.type})`, margin, yPosition);
        yPosition += 5;
        if (source.summary) {
          const summaryLines = doc.splitTextToSize(`   ${source.summary}`, maxWidth - 10);
          summaryLines.forEach((line: string) => {
            if (yPosition + 5 > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(line, margin + 5, yPosition);
            yPosition += 5;
          });
        }
        yPosition += 3;
      });
    } else {
      doc.text('No sources used in this conversation.', margin, yPosition);
      yPosition += 8;
    }

    yPosition += 8;

    // Messages section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Conversation', margin, yPosition);
    yPosition += 10;

    conversation.messages.forEach((message) => {
      // Check if we need a new page
      if (yPosition + 30 > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      // Message label
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(message.role === 'user' ? 0 : 50, message.role === 'user' ? 100 : 50, message.role === 'user' ? 200 : 150);
      const label = message.role === 'user' ? 'USER' : 'AI';
      doc.text(label, margin, yPosition);
      yPosition += 6;

      // Message content
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const contentLines = doc.splitTextToSize(message.content, maxWidth);
      contentLines.forEach((line: string) => {
        if (yPosition + 6 > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += 5;
      });

      yPosition += 8;
    });

    // Generate safe filename
    const safeTitle = conversation.title
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
    const timestamp = Date.now();
    const filename = `${safeTitle}_${timestamp}.pdf`;

    // Save the PDF
    doc.save(filename);

    return {
      success: true,
      filename,
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Triggers a file download in the browser
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Export conversation as TXT file
 */
export function exportAsTxt(conversation: Conversation): void {
  const content = exportConversationToTxt(conversation);
  const safeTitle = conversation.title
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);
  const filename = `${safeTitle}_${Date.now()}.txt`;
  downloadFile(content, filename, 'text/plain');
}

/**
 * Export conversation as PDF file
 */
export async function exportAsPdf(conversation: Conversation): Promise<void> {
  await exportConversationToPdf(conversation);
}
