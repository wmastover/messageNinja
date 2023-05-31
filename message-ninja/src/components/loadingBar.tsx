import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface ProgressBarProps {
  percentage: number;
}

export const ProgressBarContainer = styled.div`
  height: 10px;
  width: 80%;
  background-color: #272727;
  border-radius: 5px;
`;

export const ProgressBar = styled.div<ProgressBarProps>`
  height: 100%;
  width: ${({ percentage }) => `${percentage}%`};
  background-color: #ffe600;
  border-radius: inherit;
`;

interface LoadingBarProps {
  apiResponded: boolean;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ apiResponded }) => {
  const [percentage, setPercentage] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let timer = setInterval(() => {
      setPercentage((oldPercentage) => {
        if (oldPercentage >= 100) {
          clearInterval(timer);
          return 100;
        }
        return oldPercentage + 1;
      });
    }, 50); // 50 ms * 100 increments = 5000 ms (5 seconds)
    setIntervalId(timer);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []); // empty dependency array to run this once on mount

  useEffect(() => {
    if (apiResponded && intervalId) {
      clearInterval(intervalId);
      setPercentage(100);

    }
  }, [apiResponded, intervalId]); // monitor apiResponded changes

  return (
    <ProgressBarContainer>
      <ProgressBar percentage={percentage} />
    </ProgressBarContainer>
  );
};

