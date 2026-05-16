import DOMPurify from 'isomorphic-dompurify';

interface SafeHtmlProps {
  html: string;
  className?: string;
  tags?: string[];
}

/**
 * Safely renders HTML by sanitizing it first.
 * Prevents XSS attacks.
 */
export default function SafeHtml({ html, className, tags }: SafeHtmlProps) {
  const allowedTags = tags || [
    'p', 'br', 'strong', 'em', 'u', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 
    'a', 'img', 'blockquote', 'code', 'pre'
  ];

  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class'],
    ADD_ATTR: ['target'],
  });

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
    />
  );
}
