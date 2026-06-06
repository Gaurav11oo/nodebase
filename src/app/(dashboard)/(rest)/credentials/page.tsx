import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();
  return (
    <div>
      <p>Credentials</p>
    </div>
  );
};

export default Page;
