import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TempComponentPage from "./TempComponent";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <TempComponentPage />
    </div>
  );
}
