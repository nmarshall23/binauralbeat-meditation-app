
export function useScollToNewCard<C extends ComponentPublicInstance | null>(
  cards: Ref<Array<C>>,
  initalEventCount: number
) {
  const cardsLen = computed(() => cards.value.length);
  const lastCard = computed(() => cards.value[cards.value.length - 1]);

  watch(cardsLen, (curLen, prevLen) => {
    if (
      isDefined(prevLen) &&
      curLen > initalEventCount &&
      curLen > prevLen &&
      isDefined(lastCard)
    ) {
      console.log("scroll to last %o", cards.value.length);

      if (isDefined(lastCard.value.$el)) {
        console.log("scroll to lastCard %o", toRaw(lastCard.value));

        lastCard.value.$el.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "end",
        });
      }
    }
  });
}
