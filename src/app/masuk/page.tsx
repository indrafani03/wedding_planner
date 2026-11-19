import { getProfile } from "@/lib/profile";
import { safeNextPath } from "@/lib/safe-path";
import { PinPad } from "./pin-pad";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: PageProps<"/masuk">) {
  const params = await searchParams;
  const next = safeNextPath(typeof params.next === "string" ? params.next : null);

  const profile = await getProfile();

  return (
    <PinPad next={next} coupleLabel={`${profile.groomName} & ${profile.brideName}`} />
  );
}
