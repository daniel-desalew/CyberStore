import { Children } from "react";

export default function Carousel({ children }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
      {Children.map(children, (c) => (
        <div className="w-[70%] shrink-0 snap-start sm:w-[45%] md:w-auto">
          {c}
        </div>
      ))}
    </div>
  );
}
