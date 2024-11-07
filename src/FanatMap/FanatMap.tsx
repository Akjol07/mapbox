import { MouseEvent, useEffect, useMemo, useState } from "react";
import "./FanatMap.css";
import BoxDisable from "./BoxDisable.svg";
import { Seat, seatsDataApi, svgStringApi } from "./fanatModel";

function getSeatId(seatGroupElement: Element | null) {
  if (!seatGroupElement) return null;
  const pathElement = seatGroupElement?.querySelector("path");
  const seatId = pathElement?.id;
  return seatId;
}

function useFloorPlan() {
  const [svgString, setSvgString] = useState<string | null>(null);
  const [seatsData, setSeatsData] = useState<Seat[]>([]);

  useEffect(() => {
    //   fetch("/svg/api")
    //     .then((res) => res.json())
    //     .then((data) => {
    setSvgString(svgStringApi);
    setSeatsData(seatsDataApi);
    // });
  }, []);

  return {
    svgString,
    seatsData,
  };
}

const FanatMap = () => {
  const { seatsData, svgString } = useFloorPlan();
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);

  console.log(selectedSeatId, "seat");

  function handleClick(e: MouseEvent<HTMLElement>) {
    const target = e.target as HTMLElement;
    const targetPagentGroup = target.parentElement;

    if (
      !targetPagentGroup?.classList.contains("availableSeat") ||
      targetPagentGroup?.classList.contains("selectedSeat")
    )
      return;

    const seatId = getSeatId(targetPagentGroup);

    if (!seatId) return;

    setSelectedSeatId(seatId);

    const currentlySelectedSeats = document.querySelectorAll(".selectedSeat");
    currentlySelectedSeats.forEach((seat) => {
      seat.classList.remove("selectedSeat");
    });
    targetPagentGroup?.classList.add("selectedSeat");
  }

  useEffect(() => {
    const svgWrapper = document.getElementById("svgWrapper");
    const seats = svgWrapper?.querySelectorAll("g[id^=booking-box]");

    const availableSeatIds = seatsData
      .filter((seat) => seat.available)
      .map((seat) => seat.id.toString());

    seats?.forEach((seat) => {
      const seatRect = seat.querySelector("rect[stroke]");
      const strokeWidth = seatRect?.getAttribute("stroke-width");
      const coords = {
        x: seatRect?.getAttribute("x"),
        y: seatRect?.getAttribute("y"),
        width: seatRect?.getAttribute("width"),
        height: seatRect?.getAttribute("height"),
      };
      if (!Object.values(coords).every(Boolean) || !strokeWidth) return;
      const correctedCoords = {
        x: +coords.x! - +strokeWidth,
        y: +coords.y! - +strokeWidth,
        width: +coords.width! + +strokeWidth * 2,
        height: +coords.height! + +strokeWidth * 2,
      };
      const currentSeatId = getSeatId(seat);

      if (!currentSeatId) return;
      if (availableSeatIds.includes(currentSeatId)) {
        seat.classList.add("availableSeat");
      } else {
        seat.classList.add("unavailableSeat");
        seat.innerHTML = `<image href="${BoxDisable}" x="${correctedCoords.x}" y="${correctedCoords.y}" height="${correctedCoords.height}" width="${correctedCoords.width}" />`;
      }
    });
  }, [seatsData, svgString]);

  const memoizedFloorPlan = useMemo(
    () => (
      <div
        onClick={handleClick}
        id="svgWrapper"
        dangerouslySetInnerHTML={{ __html: svgString || "" }}
      ></div>
    ),
    [svgString]
  );

  return <>{memoizedFloorPlan}</>;
};

export default FanatMap;
