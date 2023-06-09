import React from 'react';

const quotes = [
  "Take things one step at a time. Don't overwhelm yourself with everything at once.",
  'Progress is progress, no matter how small. Keep moving forward.',
  "Don't be discouraged by setbacks. Use them as opportunities to learn and grow.",
  'Take breaks when you need them, but always come back and keep pushing forward.',
  'Celebrate your successes, no matter how small. They are important milestones in your journey.',
  'You have unique strengths and abilities that make you who you are. Use them to your advantage.',
  'Remember, you are not alone. There are others out there who understand and support you.',
  'Believe in yourself and your abilities. You have what it takes to accomplish great things.',
  "Don't let fear hold you back from achieving your goals. You are stronger than you think.",
  'Take each day as it comes and focus on the small victories. They will add up to big successes.',
  'Never give up on your dreams. Anything is possible with hard work and determination.',
  'Your unique perspective and experiences are valuable assets. Use them to your advantage.',
  'When things get tough, remember that challenges are opportunities for growth and learning.',
  "Success is not about being perfect, it's about progress. Keep moving forward, one step at a time.",
  'Celebrate your strengths and accomplishments, no matter how small. They are all important milestones.',
  'Stay positive and surround yourself with people who uplift and inspire you.',
  'You are capable of overcoming any obstacle. Keep pushing yourself to be the best you can be.',
];

function EmptyComponent() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h3>Here&apos;s an interesting fact!</h3>

      <h2>{quotes[Math.floor(Math.random() * 15)]}</h2>
    </div>
  );
}

export default EmptyComponent;
