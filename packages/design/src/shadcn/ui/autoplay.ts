import type useEmblaCarousel from "embla-carousel-react";

type EmblaCarouselApi = NonNullable<ReturnType<typeof useEmblaCarousel>[1]>;
type EmblaPlugin = NonNullable<Parameters<typeof useEmblaCarousel>[1]>[number];

export type ShadcnAutoplayOptions = {
  delay?: number;
  stopOnInteraction?: boolean;
  stopOnMouseEnter?: boolean;
};

const defaultOptions: Required<ShadcnAutoplayOptions> = {
  delay: 4000,
  stopOnInteraction: true,
  stopOnMouseEnter: false,
};

export function ShadcnAutoplay(
  options: ShadcnAutoplayOptions = {},
): EmblaPlugin {
  const pluginOptions = { ...defaultOptions, ...options };
  let embla: EmblaCarouselApi | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let isHovered = false;
  let isInteracting = false;
  let isStopped = false;

  const clearTimer = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };

  const scheduleNext = () => {
    clearTimer();
    if (!embla || isStopped || isHovered || isInteracting) return;

    timer = setTimeout(() => {
      embla?.scrollNext();
      scheduleNext();
    }, pluginOptions.delay);
  };

  const onPointerDown = () => {
    isInteracting = true;
    if (pluginOptions.stopOnInteraction) {
      isStopped = true;
      clearTimer();
    } else {
      clearTimer();
    }
  };

  const onPointerUp = () => {
    isInteracting = false;
    if (!pluginOptions.stopOnInteraction) scheduleNext();
  };

  const init = (api: EmblaCarouselApi) => {
    embla = api;
    isHovered = false;
    isInteracting = false;
    isStopped = false;
    api.on("pointerDown", onPointerDown);
    api.on("pointerUp", onPointerUp);
    api.on("select", scheduleNext);

    if (pluginOptions.stopOnMouseEnter) {
      api.rootNode().addEventListener("mouseenter", onMouseEnter);
      api.rootNode().addEventListener("mouseleave", onMouseLeave);
    }

    scheduleNext();
  };

  const onMouseEnter = () => {
    isHovered = true;
    clearTimer();
  };

  const onMouseLeave = () => {
    isHovered = false;
    scheduleNext();
  };

  return {
    name: "shadcnAutoplay",
    options: {},
    init,
    destroy: () => {
      clearTimer();
      embla?.off("pointerDown", onPointerDown);
      embla?.off("pointerUp", onPointerUp);
      embla?.off("select", scheduleNext);

      if (pluginOptions.stopOnMouseEnter) {
        embla?.rootNode().removeEventListener("mouseenter", onMouseEnter);
        embla?.rootNode().removeEventListener("mouseleave", onMouseLeave);
      }

      embla = undefined;
    },
  };
}
