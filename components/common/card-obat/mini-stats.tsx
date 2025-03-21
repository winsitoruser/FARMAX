const colors = [
  { color: "info", code: "#00A3B4" },
  { color: "success", code: "#7CA079" },
  { color: "warning", code: "#DB9441" },
  { color: "danger", code: "#d23" },
  { color: "muted", code: "#888" },
  { color: "normal", code: "#000" },
];

const sizes = [
  { name: "large", titleSize: "1.1rem", labelSize: ".9rem" },
  { name: "medium", titleSize: "1rem", labelSize: ".8rem" },
  { name: "small", titleSize: ".8rem", labelSize: ".7rem" },
];

interface MiniStatsProps {
  label: string;
  value: React.ReactNode;
  color?: string;
  size?: string;
  labelPosition?: string;
}

export const MiniStats: React.FC<MiniStatsProps> = ({
  label,
  value,
  color = "muted",
  size = "small",
  labelPosition = "top",
}) => (
  <div
    style={{
      display: "flex",
      gap: ".05rem",
      flexDirection: labelPosition === "top" ? "column" : "column-reverse",
    }}
  >
    <div
      style={{
        fontSize: sizes.find((s) => s.name === size)?.labelSize,
        textAlign: "center",
        color: colors.find((c) => c.color === "muted")?.code,
      }}
    >
      {`${label}`.toLocaleUpperCase()}
    </div>
    <div
      style={{
        fontSize: sizes.find((s) => s.name === size)?.titleSize,
        textAlign: "center",
        color: colors.find((c) => c.color === color)?.code || color,
        fontWeight: 600,
        textTransform: "uppercase",
      }}
    >
      {value}
    </div>
  </div>
);
