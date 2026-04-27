import styled from 'styled-components';
import { useTheme } from '@/context/ThemeContext';

const Loader = () => {
  const { theme } = useTheme();
  
  return (
    <StyledWrapper $theme={theme}>
      <div className="container">
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<{ $theme: 'dark' | 'light' }>`
  .container {
    width: 160px;
    height: 200px;
  }

  .block {
    position: relative;
    box-sizing: border-box;
    float: left;
    margin: 0 20px 20px 0;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: ${props => props.$theme === 'dark' ? '#FFF' : '#0f172a'};
    transition: background-color 0.3s ease;
  }

  .block:nth-child(4n+1) {
    animation: wave_61 2s ease .0s infinite;
  }

  .block:nth-child(4n+2) {
    animation: wave_61 2s ease .2s infinite;
  }

  .block:nth-child(4n+3) {
    animation: wave_61 2s ease .4s infinite;
  }

  .block:nth-child(4n+4) {
    animation: wave_61 2s ease .6s infinite;
    margin-right: 0;
  }

  @keyframes wave_61 {
    0% {
      top: 0;
      opacity: 1;
    }

    50% {
      top: 60px;
      opacity: .2;
    }

    100% {
      top: 0;
      opacity: 1;
    }
  }`;

export default Loader;
