import { copy } from "../../locales";
import { SectionHeader } from "./SectionHeader";

/** Event photos and videos: put the files in public/about/ and list them in en.json
 * (inPerson.photos). Files ending in .mp4, .webm or .mov show as videos. */
type Photo = { src: string; alt: string };

const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

/** "In person": the upcoming event, with photos and videos. Shown on the home page under the quiz. */
export function EventSection() {
  const { kicker, title, body } = copy.inPerson;
  const photos = copy.inPerson.photos as Photo[];

  return (
    <section id="event" className="section" aria-labelledby="event-heading">
      <SectionHeader kicker={kicker} title={title} titleId="event-heading" body={body} />
      {photos.length ? (
        <div className="event-media">
          {photos.map((photo) => {
            const src = `${import.meta.env.BASE_URL}about/${photo.src}`;
            return isVideo(photo.src) ? (
              // Plays silently on a loop, like a moving photo; controls let people unmute or pause.
              <video
                key={photo.src}
                src={src}
                aria-label={photo.alt}
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
              />
            ) : (
              <img key={photo.src} src={src} alt={photo.alt} loading="lazy" />
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
