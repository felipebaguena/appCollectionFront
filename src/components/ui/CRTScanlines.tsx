import styled, { keyframes, css } from "styled-components";

interface CRTScanlinesProps {
  opacity?: number;
  linesColor?: string;
  linesSpacing?: number;
  linesThickness?: number;
  animationSpeed?: number;
  animate?: boolean;
  curvature?: number;
  saturation?: number;
  contrast?: number;
  sweepIntensity?: number;
}

const scanAnimation = keyframes`
  0% {
    top: -70%;
  }
  100% {
    top: 100%;
  }
`;

const CRTScanlinesWrapper = styled.div<CRTScanlinesProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 10;
`;

const CurvatureEffect = styled.div<{ curvature: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        to right,
        rgba(16, 16, 16, 0.8) 0%,
        rgba(16, 16, 16, 0.8) ${(props) => props.curvature * 8}%,
        transparent ${(props) => props.curvature * 15}%
      ),
      linear-gradient(
        to left,
        rgba(16, 16, 16, 0.8) 0%,
        rgba(16, 16, 16, 0.8) ${(props) => props.curvature * 8}%,
        transparent ${(props) => props.curvature * 15}%
      ),
      linear-gradient(
        to bottom,
        rgba(16, 16, 16, 0.8) 0%,
        rgba(16, 16, 16, 0.8) ${(props) => props.curvature * 8}%,
        transparent ${(props) => props.curvature * 15}%
      ),
      linear-gradient(
        to top,
        rgba(16, 16, 16, 0.8) 0%,
        rgba(16, 16, 16, 0.8) ${(props) => props.curvature * 8}%,
        transparent ${(props) => props.curvature * 15}%
      );
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 0 0,
        rgba(16, 16, 16, 0.8) 0%,
        rgba(16, 16, 16, 0.8) ${(props) => props.curvature * 12}%,
        transparent ${(props) => props.curvature * 20}%
      ),
      radial-gradient(
        circle at 100% 0,
        rgba(16, 16, 16, 0.8) 0%,
        rgba(16, 16, 16, 0.8) ${(props) => props.curvature * 12}%,
        transparent ${(props) => props.curvature * 20}%
      ),
      radial-gradient(
        circle at 0 100%,
        rgba(16, 16, 16, 0.8) 0%,
        rgba(16, 16, 16, 0.8) ${(props) => props.curvature * 12}%,
        transparent ${(props) => props.curvature * 20}%
      ),
      radial-gradient(
        circle at 100% 100%,
        rgba(16, 16, 16, 0.8) 0%,
        rgba(16, 16, 16, 0.8) ${(props) => props.curvature * 12}%,
        transparent ${(props) => props.curvature * 20}%
      );
  }
`;

const ScanlinesEffect = styled.div<CRTScanlinesProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  overflow: hidden;
`;

const ScanlinesSweep = styled.div<CRTScanlinesProps>`
  position: absolute;
  top: -70%;
  left: 0;
  width: 100%;
  height: 70%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, ${(props) => (props.sweepIntensity || 0.5) * 0.2}) 50%,
    rgba(255, 255, 255, 0) 100%
  );

  ${(props) =>
    (props.animate ?? true) &&
    css`
      animation: ${scanAnimation} ${props.animationSpeed || 4}s linear infinite;
    `}
  z-index: 3;
`;

const ScanlinesPattern = styled.div<CRTScanlinesProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    ${(props) => props.linesColor || "rgba(255, 255, 255, 0.08)"},
    ${(props) => props.linesColor || "rgba(255, 255, 255, 0.08)"}
      ${(props) => props.linesThickness || 4}px,
    transparent ${(props) => props.linesThickness || 4}px,
    transparent ${(props) => props.linesSpacing || 8}px
  );
  opacity: ${(props) => props.opacity ?? 2};
  z-index: 4;
  pointer-events: none;
`;

const SaturationContrastLayer = styled.div<{
  saturation: number;
  contrast: number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: hsl(
    120,
    ${(props) => (props.saturation - 1) * 100}%,
    ${(props) => (2 - props.contrast) * 50}%
  );
  mix-blend-mode: color;
  opacity: 0.3;
  z-index: 3;
`;

export const CRTScanlines: React.FC<CRTScanlinesProps> = (props) => {
  return (
    <CRTScanlinesWrapper>
      {(props.curvature ?? 0.2) > 0 && (
        <CurvatureEffect curvature={props.curvature ?? 0.2} />
      )}
      <ScanlinesEffect>
        <ScanlinesSweep {...props} />
      </ScanlinesEffect>
      <ScanlinesPattern {...props} />
      <SaturationContrastLayer
        saturation={props.saturation ?? 1.5}
        contrast={props.contrast ?? 1.6}
      />
    </CRTScanlinesWrapper>
  );
};

export default CRTScanlines;
