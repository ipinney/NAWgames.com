export const metadata = {
  title: 'Lizard Lens — Live Reptile Cams',
  description: 'Watch Blappy the bearded dragon and Pineapple the crested gecko live — 24/7 cameras with 940nm infrared night vision.',
  openGraph: {
    title: 'Lizard Lens — Live Reptile Cams',
    description: 'Watch Blappy the bearded dragon and Pineapple the crested gecko live — 24/7 cameras with 940nm infrared night vision.',
    images: [
      {
        url: 'https://nawgames.com/lizardlens-og.png',
        width: 1200,
        height: 630,
        alt: 'Lizard Lens — Live reptile cameras on nawgames.com',
      },
    ],
    type: 'website',
    siteName: 'NAW Games',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lizard Lens — Live Reptile Cams',
    description: 'Watch Blappy the bearded dragon and Pineapple the crested gecko live!',
    images: ['https://nawgames.com/lizardlens-og.png'],
  },
};

export default function LizardLensLayout({ children }) {
  return children;
}
