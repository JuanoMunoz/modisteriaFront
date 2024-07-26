import "./button.css";
export default function Button({ color, content }) {
  const colors = {
    default: "#000",
    primary: "#00f",
    warning: "#f00",
    success: "#0f0",
  };
  const backgroundColor = colors[color] || colors.default;

  return (
    <button className="button" style={{ backgroundColor: backgroundColor }}>
      {content}
    </button>
  );
}
