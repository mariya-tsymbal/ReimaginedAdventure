import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ProductImage } from '../../../types/product';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  images: ProductImage[];
  productTitle: string;
}

export function ImageCarousel({ images, productTitle }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  }

  if (!images.length) {
    return <View style={styles.placeholder} />;
  }

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        accessibilityRole="adjustable">
        {images.map((img, i) => (
          <Image
            key={img.id}
            source={{ uri: img.url }}
            style={styles.image}
            resizeMode="cover"
            accessible
            accessibilityLabel={`${productTitle} image ${i + 1} of ${images.length}`}
          />
        ))}
      </ScrollView>
      {images.length > 1 && (
        <View style={styles.dots} accessibilityElementsHidden>
          {images.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    width: SCREEN_WIDTH,
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
  },
  image: { width: SCREEN_WIDTH, aspectRatio: 1 },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
  },
  dotActive: { backgroundColor: '#333' },
});
