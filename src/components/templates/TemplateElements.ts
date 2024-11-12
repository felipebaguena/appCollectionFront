import styled from "styled-components";
import { NAVBAR_HEIGHT } from "../layout/NavbarElements";

export const TemplateContainer = styled.article<{ backgroundImage: string }>`
  position: relative;
  max-width: 1200px;
  margin: 2rem auto;
  z-index: 1;
  padding-bottom: 4rem;
  margin-top: 4rem;

  @media (max-width: 768px) {
    margin-top: 1rem;
  }

  @media (max-width: 480px) {
    margin-top: 0;
  }
`;

export const MainContent = styled.div`
  background: white;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const PageBackground = styled.div<{ backgroundImage: string }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(${(props) => props.backgroundImage});
    background-size: cover;
    background-position: center;
    filter: blur(8px);
    transform: scale(1.1);
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
  }
`;

export const HeaderSection = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  padding: 2rem 2rem 1rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
  z-index: 1;
`;

export const Title = styled.h1`
  font-size: 3.5rem;
  color: white;
  margin-bottom: 1rem;
  font-weight: bold;
  position: relative;
  z-index: 3;

  @media (max-width: 768px) {
    font-size: 2.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const Subtitle = styled.h2`
  font-size: 1.8rem;
  color: white;
  font-weight: 300;
  opacity: 0.9;
  position: relative;
  z-index: 3;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 2rem 4rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem 3rem;
  }

  @media (max-width: 480px) {
    padding: 0 1rem 2rem;
  }
`;

export const Paragraph = styled.p`
  max-width: 45rem;
  padding-bottom: 1.5rem;
  padding-top: 1.5rem;
  margin: 0 auto;

  @media (max-width: 480px) {
    padding-bottom: 1rem;
    padding-top: 1rem;
  }
`;

export const Content = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--dark-grey);
  max-width: 45rem;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

export const ContentImage = styled.img`
  width: 100%;
  object-fit: cover;
  margin: 2rem 0;
`;

export const CoverImage = styled.img`
  width: 100%;
  object-fit: cover;
  margin-bottom: 1.5rem;
`;

export const PreviewBanner = styled.div`
  position: fixed;
  top: ${NAVBAR_HEIGHT};
  left: 0;
  right: 0;
  background: var(--app-yellow);
  color: var(--dark-grey);
  text-align: center;
  padding: 1rem;
  z-index: 1000;
  font-size: 1.2rem;
  font-weight: bold;
`;

export const PublishInfo = styled.div`
  color: var(--dark-grey);
  font-size: 0.9rem;
  font-style: italic;
  opacity: 0.8;
  max-width: 45rem;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    margin-bottom: 0.5rem;
  }
`;
