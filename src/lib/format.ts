import type { PersonShort } from "@/types";

const TIME_ZONE = "Europe/Moscow";

export function fullName(person: PersonShort | null | undefined) {
  if (!person) return "—";
  const name = `${person.first_name} ${person.last_name}`.trim();
  return name || person.email;
}

export function initials(person: PersonShort) {
  const letters = `${person.first_name.charAt(0)}${person.last_name.charAt(0)}`;
  return (letters || person.email.charAt(0)).toUpperCase();
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ru-RU", {
    timeZone: TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ru-RU", {
    timeZone: TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
