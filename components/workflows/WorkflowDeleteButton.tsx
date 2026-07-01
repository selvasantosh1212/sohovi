"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteWorkflow } from "@/app/actions/workflows";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { toast } from "sonner";

interface Props {
  workflowId: string;
  workflowName: string;
  redirectAfter?: string;
}

export function WorkflowDeleteButton({ workflowId, workflowName, redirectAfter }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        aria-label="Delete workflow"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <DeleteConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Delete "${workflowName}"?`}
        description="This will permanently delete the workflow and its configuration. Saved run history linked to this workflow will not be deleted."
        onConfirm={async () => {
          await deleteWorkflow(workflowId);
          toast.success("Workflow deleted");
          if (redirectAfter) router.push(redirectAfter);
        }}
      />
    </>
  );
}
