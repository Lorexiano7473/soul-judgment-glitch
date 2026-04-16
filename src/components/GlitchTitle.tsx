interface Props {
  text: string;
  className?: string;
}
export default function GlitchTitle({ text, className = "" }: Props) {
  return (
    <span
      data-text={text}
      className={`glitch-text font-display ${className}`}
    >
      {text}
    </span>
  );
}
