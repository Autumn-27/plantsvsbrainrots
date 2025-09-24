export default function Head() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'How do I start?', acceptedAnswer: { '@type': 'Answer', text: 'Buy seeds, plant by lanes, and let plants auto-defend. Place captured brainrots on platforms to earn $/s and fund upgrades.' } },
      { '@type': 'Question', name: 'How does fusion work?', acceptedAnswer: { '@type': 'Answer', text: 'When available, combine specific plants at the fuse machine to unlock stronger versions for limited windows.' } },
      { '@type': 'Question', name: 'When should I rebirth?', acceptedAnswer: { '@type': 'Answer', text: 'Rebirth once requirements are met and progression slows. Permanent boosts compound long-term gains.' } },
      { '@type': 'Question', name: 'Is it free to play?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Premium items accelerate progress but are not required.' } }
    ]
  } as const;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  );
}


