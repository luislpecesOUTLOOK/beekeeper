import Link from "next/link";
import { Droplet, MoreHorizontal } from "lucide-react";
import { Apiary } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ApiaryCard({ apiary }: { apiary: Apiary }) {
  return (
    <Card padded className="group">
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <Droplet size={18} strokeWidth={2.5} className="text-teal-primary" />
          <CardTitle className="text-base">{apiary.name}</CardTitle>
        </div>
        <MoreHorizontal size={18} strokeWidth={2} className="text-charcoal/40 group-hover:text-teal-primary" />
      </CardHeader>
      <CardContent className="pt-2 space-y-2">
        <p className="text-sm text-charcoal/70 leading-snug">{apiary.location}</p>
        {apiary.regaCode && (
          <p className="text-xs text-charcoal/50 font-mono">
            REGA: {apiary.regaCode}
          </p>
        )}
        <div className="flex items-center gap-3 pt-1 border-t border-charcoal/10">
          <span className="text-xs font-semibold text-teal-primary">
            {apiary.hiveCount} colmena{apiary.hiveCount !== 1 ? "s" : ""}
          </span>
          <Link href={`/apiaries/${apiary.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Ver colmenas
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function ApiaryList({ apiaries }: { apiaries: Apiary[] }) {
  if (apiaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-charcoal/60 text-sm">No hay explotaciones registradas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {apiaries.map((apiary) => (
        <ApiaryCard key={apiary.id} apiary={apiary} />
      ))}
    </div>
  );
}
