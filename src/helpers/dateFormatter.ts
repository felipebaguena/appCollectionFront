import { DateFormat } from "@/types/date";

interface FormatDateOptions {
  format?: DateFormat;
  defaultText?: string;
}

export const formatDate = (
  dateString: string | null,
  options: FormatDateOptions = {}
) => {
  const { format = DateFormat.LONG, defaultText = "" } = options;

  if (!dateString) return defaultText;
  const date = new Date(dateString);

  switch (format) {
    case DateFormat.SHORT:
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    case DateFormat.US:
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    case DateFormat.ISO:
      return date
        .toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .split("/")
        .reverse()
        .join("/");
    case DateFormat.LONG:
    default:
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  }
};
