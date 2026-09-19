import { BASE, P, meta, Nav, Hero, Section, Card, Box, Btn } from '../ui';
import { PHASES, PHOTOS } from './photos';

export const metadata = meta(
  'Dusty: photos',
  'The build log in pictures: parts arriving, printing the chassis, wiring, cliff tests, the sweeper, experiment day and the board.',
  `${BASE}/photos`
);

const MEDIA = `${P}/dusty-media`;

const CHIPS = PHASES.map((p) => [p.key, p.title]);

const WHY = [
  ['A picture is evidence', 'Anyone can say the robot stopped at the edge. A photo of it stopped at the edge, with a ruler in the shot, is proof. Engineers call this documentation.'],
  ['The board needs pictures', 'The trifold has room for photos, and a board with real build pictures beats one with drawings off the internet.'],
  ['You forget how it looked', 'By November nobody will remember what the first foam mock-up looked like, or which brush was tried first, unless there is a picture.'],
  ['Mistakes are worth keeping', 'A failed print or a wrong part is part of the story. Judges like seeing what went wrong and what was done about it.'],
];

const HOWTO = [
  ['Hold still, tap to focus', 'Tap the part on the screen before taking the picture, so the camera focuses on the robot and not the table behind it.'],
  ['Get the light behind you', 'Stand so the window or lamp is behind you, not behind Dusty.'],
  ['Put something next to it for size', 'A ruler, a coin, or a hand. Small parts look huge in a photo with nothing to compare them to.'],
  ['Fill the frame', 'Get close. A tiny robot in the middle of a big messy table tells nobody anything.'],
  ['Shoot the mess too', 'Before and after pictures of the crumbs are the whole point of the invention.'],
  ['Take three, keep one', 'Photos are free. Take a few and pick the sharp one later.'],
];

function Photo({ p }) {
  return (
    <figure className="bg-naw-card rounded-2xl border border-white/10 overflow-hidden">
      <a href={`${MEDIA}/${p.file}`} target="_blank" rel="noopener noreferrer">
        <img
          src={`${MEDIA}/${p.file}`}
          alt={p.alt || p.title}
          loading="lazy"
          className={`w-full ${p.tall ? 'h-80' : 'h-56'} object-cover bg-[#0d1b2e] hover:opacity-90 transition-opacity`}
        />
      </a>
      <figcaption className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-white font-bold text-sm">{p.title}</span>
          <span className="text-white/35 text-xs tabular-nums whitespace-nowrap">{p.date}</span>
        </div>
        {p.caption && <p className="text-white/60 text-sm mt-1 leading-relaxed">{p.caption}</p>}
      </figcaption>
    </figure>
  );
}

export default function PhotosPage() {
  const byPhase = Object.fromEntries(
    PHASES.map((ph) => [ph.key, PHOTOS.filter((p) => p.phase === ph.key).sort((a, b) => (a.date < b.date ? 1 : -1))])
  );
  const total = PHOTOS.length;

  return (
    <div className="min-h-screen">
      <Nav current="photos" />
      <Hero
        title="PHOTOS"
        lead="The build log in pictures. Every box opened, every part printed, every test run."
        sub="Take the picture while it is happening. You cannot go back and photograph it later."
        badge={total ? `${total} photo${total > 1 ? 's' : ''} so far` : 'No photos yet, start with the boxes'}
        chips={CHIPS}
      />

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <Section title="Why photograph the build" big="Because the board is due in November and your memory is not evidence.">
          <div className="grid sm:grid-cols-2 gap-3">
            {WHY.map(([t, d]) => (
              <Card key={t}>
                <div className="text-white font-bold">{t}</div>
                <div className="text-white/60 text-sm mt-1">{d}</div>
              </Card>
            ))}
          </div>
          <Box tone="tip" title="Rule for every build session">
            <p>Before you put a tool down, take a picture of what you just did. It takes four seconds and it is the only chance you get.</p>
          </Box>
        </Section>

        {PHASES.map((ph, i) => {
          const shots = byPhase[ph.key];
          return (
            <Section key={ph.key} id={ph.key} n={i + 1} title={ph.title} big={ph.lead}>
              {shots.length ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {shots.map((p) => (
                    <Photo key={p.file} p={p} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 p-5">
                  <div className="text-white/45 text-sm font-semibold">Nothing here yet</div>
                  <div className="text-white/35 text-sm mt-1">Pictures show up here once this part of the build starts.</div>
                </div>
              )}
              <Box tone="facts" title="Shots to get" items={ph.shoot} />
            </Section>
          );
        })}

        <Section n={PHASES.length + 1} title="Taking a better picture" big="Six things that turn a blurry phone snap into a board photo.">
          <div className="grid sm:grid-cols-2 gap-3">
            {HOWTO.map(([t, d]) => (
              <Card key={t}>
                <div className="text-yellow-300 font-bold">{t}</div>
                <div className="text-white/65 text-sm mt-1">{d}</div>
              </Card>
            ))}
          </div>
          <Box tone="warn" title="Before a photo goes on this page">
            <p>Dusty&apos;s pages are public, so anyone can see them. Keep addresses, order paperwork, phone numbers and faces of other people out of the shot. A packing slip is fine once the address part is folded under or cropped off.</p>
          </Box>
          <div className="flex flex-wrap gap-2">
            <Btn href={`${BASE}/inventory`} primary>Check in the parts</Btn>
            <Btn href={`${BASE}/build`}>The build</Btn>
          </div>
        </Section>
      </div>
    </div>
  );
}
