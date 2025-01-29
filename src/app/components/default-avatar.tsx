'use client';

interface DefaultAvatarProps {
  imageUrl: string | false | undefined
}

import Image from 'next/image';
import { useState } from 'react';

export default function DefaultAvatar({ imageUrl }: DefaultAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="avatar-container w-10 h-10 rounded-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imageUrl ? (
      <Image
        src={imageUrl}
        alt='user avatar'
        width={46}
        height={46}
        className="object-cover"
      />
      ) : (
      <Image
        src={
          isHovered 
            ? "/images/icon-user.gif" 
            : "/images/icon-user-static.png"
        }
        alt='user avatar'
        width={46}
        height={46}
        className="object-cover"
        unoptimized
      />
      )}
    </div>
  );
}
