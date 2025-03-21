'use client';

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { useState } from 'react';

export default function RegisterEmotion({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [cache] = useState(() => {
    const cache = createCache({ key: 'css' });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted);
    const styles = names.reduce((acc, name) => {
      if (cache.inserted[name] === undefined) return acc;
      return acc + cache.inserted[name];
    }, '');

    if (styles.trim() === '') return null;

    return (
      <style
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
} 