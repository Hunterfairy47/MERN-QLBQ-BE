export const convertionTable = (ingredientName: string, amount: number) => {
  switch (ingredientName) {
    case "Dầu ăn":
      return (amount / 1000 / 1.24) * 1000;
    case "Trứng gà ta":
      return;

    default:
      break;
  }
};
