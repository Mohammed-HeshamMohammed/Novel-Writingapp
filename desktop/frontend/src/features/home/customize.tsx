import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <div className="btn">
        <button className="button face">
          <div className="deadpool-face">
            <div className="ded eye" />
          </div>
        </button>
        <button className="button1 face">
          <div className="wolverine-face">
            <div className="wol mask" />
            <div className="wol-eye" />
          </div>
        </button>
        <div className="customize-left">CUST</div>
        <div className="customize-right">MIZE</div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    cursor: pointer;
    position: relative;
    width: 60px;
    height: 120px;
    border: none;
    border-radius: 6rem 0 0 6rem;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s ease;
  }

  .deadpool-face {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 100px;
    border: none;
    border-radius: 6rem 0 0 6rem;
    transition: all 0.5s ease;
    background: linear-gradient(90deg, #9d0000 5%, #af0000 10%, #cf0102 30%, #b10101 50%, #cf0102 70%, #c00101 80%, #c00101 95%);
    right: 0;
    box-shadow: inset 2px 0px 5px rgba(0, 0, 0);
  }

  .ded {
    position: absolute;
    background-color: #090b0c;
    border: none;
    width: 25px;
    height: 20px;
    left: 12px;
    clip-path: polygon(1% 1%, 99% 59%, 91% 73%, 85% 81%, 77% 89%, 71% 94%, 65% 98%, 58% 99%, 52% 99%, 44% 98%, 38% 97%, 33% 92%, 28% 85%, 23% 75%);
    transition: all 0.5s ease;
  }

  .button1 {
    cursor: pointer;
    position: relative;
    width: 60px;
    height: 120px;
    border: none;
    border-radius: 0 6rem 6rem 0;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s ease;
  }

  .wolverine-face {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 100px;
    left: 0;
    border: none;
    border-radius: 0 6rem 6rem 0;
    box-shadow: inset 2px 0 5px rgba(0, 0, 0);
    background: linear-gradient(90deg, #fce620 5%, #ebd61d 10%, #f5e024 30%, #e6d31d 50%, #f5e024 70%, #ebd61d 80%, #fce620 95%);
    transition: all 0.5s ease;
  }

  .wol {
    position: absolute;
    border: none;
    background-color: transparent;
    box-shadow: none;
    width: 75px;
    height: 110px;
    bottom: 8px;
    right: -18px;
    transition: all 0.5s ease;
    clip-path: polygon(98% 1%, 85% 15%, 73% 28%, 61% 38%, 49% 46%, 35% 50%, 23% 54%, 15% 57%, 10% 66%, 13% 78%, 21% 86%, 32% 87%, 54% 83%, 42% 100%, 62% 89%, 73% 85%, 81% 73%, 85% 63%, 90% 40%, 93% 28%);
  }

  .wol-eye {
    position: absolute;
    border: none;
    background-color: #090b0c;
    box-shadow: none;
    width: 25px;
    height: 20px;
    transition: all 0.5s ease;
    clip-path: polygon(1% 1%, 99% 59%, 91% 73%, 85% 81%, 77% 89%, 71% 94%, 65% 98%, 58% 99%, 52% 99%, 44% 98%, 38% 97%, 33% 92%, 28% 85%, 23% 75%);
    transform: rotateY(180deg);
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s ease;
    position: relative;
    transform: scale(0.6);
  }

  .customize-left {
    position: absolute;
    left: -100px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 30px;
    font-weight: 900;
    font-family: 'Arial Black', Arial, sans-serif;
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    pointer-events: none;
    letter-spacing: 3px;
    text-transform: uppercase;
    background: linear-gradient(135deg, #ff0000 0%, #ff4444 15%, #ff8888 30%, #ffffff 45%, #ffdddd 55%, #ff6666 70%, #ff2222 85%, #cc0000 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 10px rgba(255, 0, 0, 0.5)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
    text-shadow: 2px 2px 8px rgba(255, 0, 0, 0.3);
    animation: heroGlow 2s ease-in-out infinite alternate;
  }

  .customize-right {
    position: absolute;
    right: -100px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 30px;
    font-weight: 900;
    font-family: 'Arial Black', Arial, sans-serif;
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    pointer-events: none;
    letter-spacing: 3px;
    text-transform: uppercase;
    background: linear-gradient(135deg, #ffff00 0%, #ffff44 15%, #ffff88 30%, #ffffff 45%, #ffffdd 55%, #ffff66 70%, #ffff22 85%, #cccc00 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 10px rgba(255, 255, 0, 0.5)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
    text-shadow: 2px 2px 8px rgba(255, 255, 0, 0.3);
    animation: heroGlow 2s ease-in-out infinite alternate;
    animation-delay: 0.5s;
  }

  @keyframes heroGlow {
    0% {
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
      transform: translateY(-50%) scale(1);
    }
    100% {
      filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)) drop-shadow(0 4px 8px rgba(0, 0, 0, 1));
      transform: translateY(-50%) scale(1.05);
    }
  }

  .btn:hover .button {
    background: linear-gradient(90deg, #9d0000 5%, #af0000 10%, #cf0102 30%, #b10101 50%, #cf0102 70%, #c00101 80%, #c00101 95%);
    box-shadow: 0px 0px 5px #9e1f35;
  }

  .btn:hover .button1 {
    background: linear-gradient(90deg, #fce620 5%, #ebd61d 10%, #f5e024 30%, #e6d31d 50%, #f5e024 70%, #ebd61d 80%, #fce620 95%);
    box-shadow: 0px 0px 5px #feff1e;
  }

  .btn:hover .deadpool-face {
    background: #090b0c;
    right: 5px;
    box-shadow: inset 5px 5px 8px rgba(0, 0, 0);
  }

  .btn:hover .wolverine-face {
    background: transparent;
    left: 5px;
    box-shadow: inset 2px 0 5px rgba(0, 0, 0);
  }

  .btn:hover .ded {
    background-color: #ececec;
  }

  .btn:hover .wol {
    background-color: #090b0c;
    width: 75px;
    height: 110px;
    bottom: 8px;
    right: -20px;
    transform: rotateY(0deg);
    clip-path: polygon(98% 1%, 85% 15%, 73% 28%, 61% 38%, 49% 46%, 35% 50%, 23% 54%, 15% 57%, 10% 66%, 13% 78%, 21% 86%, 32% 87%, 54% 83%, 42% 100%, 62% 89%, 73% 85%, 81% 73%, 85% 63%, 90% 40%, 93% 28%);
  }

  .btn:hover .wol-eye {
    background-color: #ececec;
  }

  .btn:hover .customize-left,
  .btn:hover .customize-right {
    opacity: 1;
    transform: translateY(-50%) scale(1.1);
    animation: heroPulse 1.5s ease-in-out infinite;
  }

  @keyframes heroPulse {
    0%, 100% {
      transform: translateY(-50%) scale(1.1);
    }
    50% {
      transform: translateY(-50%) scale(1.15);
    }
  }

  .btn:active .face:not(:hover) {
    filter: grayscale(1);
  }

  .btn:active .face:hover {
    transform: scale(1.1);
  }
`;

export default Button;