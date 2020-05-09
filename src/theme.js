import { css } from 'linaria';

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
};
