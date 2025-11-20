import React from "react";
import styled from "styled-components";

const AnimatedDeleteButton = ({ onClick }) => {
  return (
    <Wrapper>
      <button className="button" onClick={onClick}>
        <svg viewBox="0 0 448 512" className="svgIcon">
          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
        </svg>
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #111;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.3s;
    position: relative;
    overflow: hidden;
  }

  .svgIcon {
    width: 12px;
    transition: 0.3s;
  }

  .svgIcon path {
    fill: white;
  }

  .button:hover {
    width: 140px;
    background: #ff4545;
    border-radius: 50px;
  }

  .button:hover .svgIcon {
    width: 45px;
    transform: translateY(60%);
  }

  .button::before {
    position: absolute;
    top: -20px;
    content: "Delete";
    color: white;
    font-size: 2px;
    transition: 0.3s;
  }

  .button:hover::before {
    font-size: 13px;
    transform: translateY(30px);
  }
`;

export default AnimatedDeleteButton;