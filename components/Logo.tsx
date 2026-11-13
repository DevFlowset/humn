/** HUMN wordmark, set in the display face (Presicav when licensed). */
export default function Logo({ size = 17 }: { size?: number }) {
  return (
    <span className="logo hn-display" style={{ fontSize: size }} aria-hidden="true">
      HUMN
    </span>
  );
}
