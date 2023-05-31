import styled from 'styled-components';

interface ProgressBarProps {
  percentage: number;
}

export const ProgressBarContainer = styled.div`
  width: 80%;
  height: 10px;
  background-color: #272727;
  border-radius: 50px;
`;

export const ProgressBar = styled.div<ProgressBarProps>`
  height: 100%;
  width: ${({ percentage }) => `${percentage}%`};
  background-color: #6c63ff;
  border-radius: inherit;
`;


