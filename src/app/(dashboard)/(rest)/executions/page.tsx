import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();
  return (
    <div>
      <p>Executions</p>
    </div>
  );
};

export default Page;
