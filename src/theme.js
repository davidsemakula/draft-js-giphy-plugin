import { css } from 'linaria';

/* greys */
export const giphyBlack = '#121212'
export const giphyDarkestGrey = '#212121'
export const giphyDarkGrey = '#2e2e2e'
export const giphyDarkCharcoal = '#3e3e3e'
export const giphyCharcoal = '#4a4a4a'
export const giphyLightCharcoal = '#5c5c5c'
export const giphyLightGrey = '#a6a6a6'
export const giphyLightestGrey = '#d8d8d8'
export const giphyWhiteSmoke = '#ececec'
export const giphyWhite = '#ffffff'
/* primary */
export const giphyBlue = '#00ccff'
export const giphyGreen = '#00ff99'
export const giphyPurple = '#9933ff'
export const giphyRed = '#ff6666'
export const giphyYellow = '#fff35c'
/* secondary */
export const giphyAqua = '#00e6cc'
export const giphyLightBlue = '#3191ff'
export const giphyIndigo = '#6157ff'
export const giphyPink = '#e646b6'

const sharedSelectButton = `
  font-size: 16px;
  line-height: 16px;
  cursor: pointer;
  color: #888;
  background: #fff;
  margin: 0;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;

  &:focus {
    outline: 0; /* reset for :focus */
  }

  &:hover {
    background: #f3f3f3;
  }

  &:active {
    background: #e6e6e6;
  }
`;

const sharedFilterButton = `
  display: inline-block;
  font-size: 16px;
  line-height: 16px;
  cursor: pointer;
  color: #888;
  background: #fff;
  margin: 0;
  padding: 8px 16px;
  border: 1px solid #ddd;
  box-sizing: border-box;

  &:focus {
    outline: 0; /* reset for :focus */
  }

  &:hover {
    background: #f3f3f3;
  }

  &:active {
    background: #e6e6e6;
  }
`;

const loaderHeight = 37;

export const defaultTheme = {
  // giphy styles
  giphy: css`
    position: relative;
    display: block;
    margin: 0;
  `,

  giphyImage: css`
    display: inline-block;
    max-width: 100%;
    height: auto;
    margin: 12px 0;
  `,

  // select styles
  select: css`
    background: #fff;
    display: inline-block;
  `,

  selectPopover: css`
    position: absolute;
    width: auto;
    height: auto;
    background: #fff;
    padding: 10px;
    margin-top: 5px;
    border-radius: 2px;
    border: 1px solid #e0e0e0;
    box-shadow: 0px 4px 30px 0px rgba(220, 220, 220, 1);
    box-sizing: border-box;
    z-index: 1000;
  `,

  selectClosedPopover: css`
    display: none;
  `,

  selectButton: css`
    ${sharedSelectButton}
  `,

  selectPressedButton: css`
    ${sharedSelectButton}
    background: #ededed;
  `,

  searchWrapper: css`
    margin-bottom: 8px;
  `,

  searchInput: css`
    display: block;
    font-size: 16px;
    width: 100%;
    height: 36px;
    padding: 8px 16px;
    border: 1px solid #DFE7EF;
    border-radius: 4px;
  `,

  filterButtonWrapper: css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;

    > * {
      flex-grow: 1;
    }

    > *:first-child {
      border-radius: 4px 0 0 4px;
    }

    > *:last-child {
      border-radius: 0 4px 4px 0;
    }
  `,

  filterButton: css`
    ${sharedFilterButton}
  `,

  filterPressedButton: css`
    ${sharedFilterButton}
    background: #ededed;
  `,

  gridWrapper: css`
    width: 100%;
    height: 50vh;
    overflow-y: scroll;
  `,

  gridLoader: css`
    display: flex;
    align-items: center;
    height: ${loaderHeight}px;
    padding-top: 15px;
    margin: 0 auto;
    text-align: center;
    justify-content: center;
    animation: pulse 0.8s ease-in-out 0s infinite alternate backwards;

    div {
      @keyframes bouncer to {
        transform: scale(1.75) translateY(-20px);
      }
      display: inline-block;
      height: 10px;
      width: 10px;
      margin: ${loaderHeight}px 10px 10px 10px;
      position: relative;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
      animation: bouncer cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.75s infinite alternate;
      &:nth-child(5n + 1) {
        background: ${giphyGreen};
        animation-delay: 0;
      }
      &:nth-child(5n + 2) {
        background: ${giphyBlue};
        animation-delay: calc(0s + (0.1s * 1));
      }
      &:nth-child(5n + 3) {
        background: ${giphyPurple};
        animation-delay: calc(0s + (0.1s * 2));
      }
      &:nth-child(5n + 4) {
        background: ${giphyRed};
        animation-delay: calc(0s + (0.1s * 3));
      }
      &:nth-child(5n + 5) {
        background: ${giphyYellow};
        animation-delay: calc(0s + (0.1s * 4));
      }
    }
    `,

  gridFetchError: css`
    color: ${giphyLightGrey};
    display: flex;
    justify-content: center;
    margin: 30px 0;
    font-size: 16px;
    font-weight: 600;

    a {
      color: ${giphyBlue};
      cursor: pointer;

      &:hover {
        color: white;
      }
    }
    `,
};
