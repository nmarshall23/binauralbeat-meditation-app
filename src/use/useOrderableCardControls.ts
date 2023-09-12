export type IndexedItem = {
  itemId: number;
  sortOrder: number;
};

export function useOrderableCardControls<C extends IndexedItem>(
  cards: Ref<Array<C>>
) {
  const cardsSorted = useSorted(cards, (a, b) => a.sortOrder - b.sortOrder);

  function removeCard(id: number) {
    const index = cards.value.findIndex((item) => id === item.itemId);

    if (index >= 0) {
      cards.value.splice(index, 1);
    }
  }

  function moveCardUp(id: number) {
    const cardA = findCardbyId(id);
    if (isDefined(cardA)) {
      const cardB = findCardbySorting(cardA.sortOrder);
      if (isDefined(cardB)) {
        cardA.sortOrder = cardA.sortOrder + 1;
        cardB.sortOrder = cardB.sortOrder - 1;
      }
    }
  }

  function moveCardDown(id: number) {
    const cardA = findCardbyId(id);
    if (isDefined(cardA)) {
      const cardB = findCardbySorting(cardA.sortOrder);
      if (isDefined(cardB)) {
        cardA.sortOrder = cardA.sortOrder - 1;
        cardB.sortOrder = cardB.sortOrder + 1;
      }
    }
  }

  function findCardbyId(id: number) {
    return cards.value.find((item) => id === item.itemId);
  }
  function findCardbySorting(sortOrder: number) {
    return cards.value.find((item) => sortOrder > item.sortOrder);
  }

  return {
    cardsSorted,
    moveCardDown,
    moveCardUp,
    removeCard,
  };
}
