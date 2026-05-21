import { auth } from "@clerk/nextjs/server";
import { OrganizationProfile, CreateOrganization } from "@clerk/nextjs";
import { Users2, Info } from "lucide-react";

export const metadata = {
  title: "Team",
};

export default async function TeamPage() {
  const { orgId } = await auth();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold tracking-[-0.025em]" style={{ color: "#0A0A0F" }}>Team Workspace</h1>
        <p className="text-[14px] text-slate-500 mt-1.5">
          Invite teammates to collaborate on your data quality assets.
        </p>
      </div>

      {/* Workspace isolation callout */}
      <div
        className="flex items-start gap-3 rounded-[14px] p-4"
        style={{
          background: "#FFF4EB",
          border: "1px solid #FDDFC9",
        }}
      >
        <Info className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#C96040" }} />
        <div>
          <p className="text-[13px] font-medium" style={{ color: "#7C2D12" }}>
            Team and personal workspaces are separate
          </p>
          <p className="text-[12px] mt-0.5" style={{ color: "#92400E" }}>
            Data created in your team workspace is only visible to team members. Your personal
            workspace data stays private. Switch between them using the workspace selector in
            the top bar.
          </p>
        </div>
      </div>

      {/* Clerk org management */}
      {orgId ? (
        <OrganizationProfile
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border border-[#EEF0F3] rounded-[16px] w-full",
            },
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="rounded-[16px] border border-[#EEF0F3] p-6 text-center space-y-4">
            <div
              className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
              style={{ background: "rgba(0,201,167,0.1)" }}
            >
              <Users2 className="w-6 h-6" style={{ color: "#00C9A7" }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Create a team workspace
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Create an organisation to share Business Units, Catalogs, and Data Assets
                with your team. Invite members by email.
              </p>
            </div>
          </div>

          <CreateOrganization
            afterCreateOrganizationUrl="/dashboard/team"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border border-slate-200 rounded-xl w-full",
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
