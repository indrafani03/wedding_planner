import { getProfile } from "@/lib/profile";
import { PinPad } from "./pin-pad";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: PageProps<"/masuk">) {
  const params = await searchParams;
  const rawNext = typeof params.next === "string" ? params.next : "/";
  // Only allow same-origin paths, never an absolute URL from the query string.
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  const profile = await getProfile();

  return (
    <PinPad next={next} coupleLabel={`${profile.groomName} & ${profile.brideName}`} />
  );
}
