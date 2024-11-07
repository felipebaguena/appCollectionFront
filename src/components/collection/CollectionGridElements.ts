import styled from "styled-components";
import Link from "next/link";

export const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 0 1rem;
  width: 100%;
  justify-content: flex-start;
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const GameCardWrapper = styled(Link)<{ $isCompact?: boolean }>`
  flex: 0 0 auto;
  width: calc(33.333% - 14px);
  max-width: 400px;
  min-width: 300px;
  margin: 0;
  text-decoration: none;
  position: relative;

  @media (max-width: 1200px) {
    width: calc(50% - 10px);
    max-width: 400px;
  }

  @media (max-width: 768px) {
    width: ${(props) => (props.$isCompact ? "calc(50% - 10px)" : "100%")};
    max-width: ${(props) => (props.$isCompact ? "180px" : "400px")};
    min-width: ${(props) => (props.$isCompact ? "150px" : "250px")};
  }

  &:hover {
    .image-wrapper {
      opacity: 0;
    }

    .expanded-wrapper {
      opacity: 1;
    }

    .info-label,
    .add-collection-label {
      opacity: 1;
      transform: translateY(0);
    }

    .game-card {
      transform: translateY(-2px);
    }
  }
`;

export const GameCard = styled.div<{ $isCompact?: boolean }>`
  background-color: var(--background);
  padding: ${(props) => (props.$isCompact ? "8px" : "15px")};
  display: flex;
  flex-direction: column;
  cursor: pointer;
  height: 100%;
  transition: transform 0.2s ease-in-out;
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
`;

export const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2rem;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    opacity: 0;
  }
`;

export const ExpandedImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    opacity: 1;
  }
`;

export const GameImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const GameContent = styled.div<{ $isCompact?: boolean }>`
  padding: ${(props) => (props.$isCompact ? "5px 5px" : "10px 10px")};
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

export const GameTitle = styled.h3<{ $isCompact?: boolean }>`
  margin: 0;
  font-size: ${(props) => (props.$isCompact ? "14px" : "18px")};
  color: var(--dark-grey);
  font-weight: bold;
`;

export const GameInfo = styled.div<{ $isCompact?: boolean }>`
  display: ${(props) => (props.$isCompact ? "none" : "flex")};
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--grey);
`;

export const GameYear = styled.span``;

export const GamePlatforms = styled.span``;

export const InfoLabel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--app-yellow);
  color: var(--dark-grey);
  padding: 0.6rem 0.8rem;
  font-weight: bold;
  text-align: center;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.6s cubic-bezier(0.8, 0, 0.4, 1);

  @media (max-width: 768px) {
    display: none;
  }
`;

export const AddToCollectionLabel = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  background-color: var(--grey);
  color: white;
  padding: 0.6rem 0.8rem;
  font-weight: bold;
  text-align: center;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.6s cubic-bezier(0.8, 0, 0.4, 1);
  cursor: pointer;

  @media (max-width: 768px) {
    display: none;
  }

  &:hover {
    background-color: var(--dark-grey);
    transition: background-color 0.4s ease;
  }
`;

export const Pagination = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const PageButton = styled.button<{
  active?: boolean;
  disabled?: boolean;
}>`
  padding: 8px 12px;
  border: none;
  background-color: ${(props) =>
    props.active ? "var(--app-yellow)" : "var(--background)"};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "var(--background)" : "var(--app-yellow)"};
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-bottom: 2rem;
  width: 100%;
`;

export const Content = styled.div`
  flex: 1;
  width: 100%;
`;

export const PaginationContainer = styled.div`
  margin-top: 2rem;
  width: 100%;
`;

export const DeleteIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 4rem;
  background-color: var(--app-red);
  width: 2.5rem;
  height: 2.5rem;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    display: flex;
  }

  svg {
    color: white;
    font-size: 1.5rem;
  }
`;

export const EditIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 7rem;
  background-color: var(--app-yellow);
  width: 2.5rem;
  height: 2.5rem;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    display: flex;
    cursor: pointer;
    &:hover {
      background-color: var(--app-yellow);
    }
    svg {
      color: var(--dark-grey);
    }
  }

  svg {
    color: var(--dark-grey);
    font-size: 1.5rem;
    transition: all 0.3s ease;
  }
`;

export const CollectionIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--app-yellow);
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    cursor: default;
    pointer-events: none;
    &:hover {
      background-color: var(--app-yellow);
    }
    svg {
      color: var(--dark-grey);
    }
  }

  &:hover {
    background-color: var(--app-red);
    svg {
      color: white;
    }
  }

  svg {
    color: var(--dark-grey);
    font-size: 1.5rem;
    transition: all 0.3s ease;
  }
`;

export const MobileLoginBanner = styled.div`
  display: none;
  background-color: var(--grey);
  color: white;
  padding: 0.8rem;
  text-align: center;
  font-weight: bold;
  margin-bottom: 1rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: ${(props) =>
      !localStorage.getItem("access_token") ? "block" : "none"};
  }

  &:hover {
    background-color: var(--dark-grey);
  }
`;

export const AddIcon = styled.div<{ inCollection?: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--grey);
  width: 2.5rem;
  height: 2.5rem;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    display: ${(props) => (!props.inCollection ? "flex" : "none")};
  }

  svg {
    color: white;
    font-size: 1.5rem;
  }
`;

export const CompactIconsContainer = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.3rem;
  z-index: 3;
`;

interface CompactIconProps {
  variant?: "edit" | "delete" | "add";
}

export const CompactIcon = styled.div<CompactIconProps>`
  width: 1.8rem;
  height: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => {
    switch (props.variant) {
      case "edit":
        return "var(--app-yellow)";
      case "delete":
        return "var(--app-red)";
      default:
        return "var(--grey)";
    }
  }};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  &:hover {
    background-color: ${(props) => {
      switch (props.variant) {
        case "edit":
          return "var(--app-yellow)";
        case "delete":
          return "var(--app-red)";
        default:
          return "var(--dark-grey)";
      }
    }};
  }

  svg {
    font-size: 1.2rem;
    color: ${(props) =>
      props.variant === "edit" ? "var(--dark-grey)" : "white"};
  }
`;
