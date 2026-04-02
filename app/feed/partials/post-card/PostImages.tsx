'use client';

interface PostImage {
  url: string;
  publicId: string;
}

interface Props {
  images: PostImage[];
}

export default function PostImages({ images }: Props) {
  if (images.length === 0) return null;

  return (
    <div
      className="_feed_inner_timeline_image"
      style={
        images.length > 1
          ? { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2px' }
          : undefined
      }
    >
      {images.map((img, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={img.publicId || i}
          src={img.url}
          alt={`Post image ${i + 1}`}
          className="_time_img"
          style={{
            width: '100%',
            height: images.length > 1 ? '200px' : 'auto',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ))}
    </div>
  );
}
