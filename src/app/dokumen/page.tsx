import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ProgressCard, SectionTitle } from "@/components/stat";
import { DeleteButton } from "@/components/form/delete-button";
import { ToggleCheck } from "@/components/form/toggle-check";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { deleteDocumentItem, toggleDocumentItem } from "./actions";
import { DocumentItemSheet } from "./item-sheet";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const items = await prisma.documentItem.findMany({
    orderBy: [{ groupCode: "asc" }, { sortOrder: "asc" }],
  });

  const done = items.filter((i) => i.progress === "SUDAH").length;

  const groups = new Map<string, { name: string; items: typeof items }>();
  for (const item of items) {
    const key = `${item.groupCode}. ${item.groupName}`;
    const bucket = groups.get(key);
    if (bucket) bucket.items.push(item);
    else groups.set(key, { name: item.groupName, items: [item] });
  }

  return (
    <>
      <PageHeader
        title="Administrasi & Dokumen"
        subtitle="Berkas N1-N4, KUA, dan persiapan"
        action={<DocumentItemSheet />}
      />

      <div className="flex flex-col gap-4 p-4">
        <ProgressCard
          label="Kelengkapan dokumen"
          done={done}
          total={items.length}
          hint={`${items.length - done} item masih belum beres`}
        />

        {items.length === 0 ? (
          <EmptyState
            title="Belum ada daftar dokumen"
            description='Tekan "Tambah" untuk mendata berkas yang perlu diurus.'
          />
        ) : (
          [...groups.entries()].map(([key, group]) => {
            const groupDone = group.items.filter(
              (i) => i.progress === "SUDAH",
            ).length;
            return (
              <section key={key} className="flex flex-col gap-2">
                <SectionTitle
                  right={
                    <span className="text-muted-foreground text-xs tabular-nums">
                      {groupDone}/{group.items.length}
                    </span>
                  }
                >
                  {key}
                </SectionTitle>

                {group.items.map((item) => (
                  <div key={item.id} className="bg-card rounded-xl border p-3">
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <ToggleCheck
                          id={item.id}
                          checked={item.progress === "SUDAH"}
                          action={toggleDocumentItem}
                          ariaLabel={`Tandai ${item.name} sudah beres`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-sm leading-tight font-medium",
                            item.progress === "SUDAH" &&
                              "text-muted-foreground line-through",
                          )}
                        >
                          {item.name}
                        </p>
                        {item.details ? (
                          <p className="text-muted-foreground mt-1 text-xs">
                            {item.details}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-1 flex justify-end gap-1">
                      <DocumentItemSheet
                        item={{
                          id: item.id,
                          groupCode: item.groupCode,
                          groupName: item.groupName,
                          name: item.name,
                          progress: item.progress,
                          details: item.details,
                        }}
                      />
                      <DeleteButton id={item.id} action={deleteDocumentItem} />
                    </div>
                  </div>
                ))}
              </section>
            );
          })
        )}
      </div>
    </>
  );
}
