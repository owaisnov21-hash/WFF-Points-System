
import React, { useState } from 'react';
import StarIcon from './icons/StarIcon';

interface StarRatingProps {
  maxStars: number;
  currentRating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ maxStars, currentRating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  // For criteria with many points (like Rally), we render fewer stars to keep the UI clean
  const displayStars = Math.min(maxStars, 10); 
  const valuePerStar = maxStars / displayStars;

  const handleRatingClick = (index: number) => {
    const rating = Math.round((index + 1) * valuePerStar);
    onRatingChange(rating);
  };
  
  const handleHover = (index: number) => {
    const rating = Math.round((index + 1) * valuePerStar);
    setHoverRating(rating);
  };

  return (
    <div className="flex items-center" onMouseLeave={() => setHoverRating(0)}>
      {[...Array(displayStars)].map((_, index) => {
        const ratingValue = (index + 1) * valuePerStar;
        const isActive = (hoverRating || currentRating) >= ratingValue;
        
        return (
          <div
            key={index}
            onClick={() => handleRatingClick(index)}
            onMouseEnter={() => handleHover(index)}
            className="cursor-pointer"
          >
            <StarIcon isActive={isActive} />
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
