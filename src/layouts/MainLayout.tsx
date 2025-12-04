import React, { type ReactNode } from "react";
import styled from "styled-components";

interface MainLayoutWrapperProps {
  children: ReactNode;
}

const MainLayoutWrapper = styled.div<{ isMobileMode: boolean }>`
  width: 100dvw;
  height: 100dvh;
  box-sizing: border-box;

  .root {
    background: #0f0f0f;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: ${({ isMobileMode }) =>
      isMobileMode ? "10px 20px" : "30px 50px"};

    display: flex;
    justify-content: center;
  }

  .content {
    max-width: 1920px;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
  }
`;

const MainLayout = React.memo(({ children }: MainLayoutWrapperProps) => {
  return (
    <MainLayoutWrapper>
      <div className={"root"}>
        <div className={"content"}>{children}</div>
      </div>
    </MainLayoutWrapper>
  );
});

export default MainLayout;
