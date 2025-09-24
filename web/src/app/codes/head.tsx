export default function Head() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I redeem Plants vs Brainrots codes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Open the in-game Shop, go to Rewards → Codes, enter a valid code, then press Claim.'
        }
      },
      {
        '@type': 'Question',
        name: 'Why is my code not working?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Codes are case-sensitive and may expire. Double-check spelling; if it still fails, it likely expired.'
        }
      },
      {
        '@type': 'Question',
        name: 'Where can I find the latest working codes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'This page is kept up to date. Check the “Active” list at the top for verified codes and rewards.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I copy a code from this page?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use the Copy button next to each code, then paste it into the in-game Codes input.'
        }
      }
    ]
  } as const;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  );
}


