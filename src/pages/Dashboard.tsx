// src/pages/Dashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";

// Adjust this to match your table
const TABLE_NAME = "compliance_checks";

type ComplianceItem = {
  id: string | number;
  industry: string;             // e.g. "healthcare", "construction"
  is_outdated: boolean;         // boolean flag
  updated_at?: string | null;   // optional timestamp
  // Add any other fields you have:
  // title?: string;
  // status?: string;
};

function humanize(input: string): string {
  return input
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c: string) => c.toUpperCase());
}

export default function Dashboard() {
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setErrorMsg("");

      // Update the select list to the columns you actually need
      const { data, error } = await supabase
        .from<ComplianceItem>(TABLE_NAME)
        .select("id, industry, is_outdated, updated_at")
        .order("updated_at", { ascending: false });

      if (!isMounted) return;
      if (error) {
        setErrorMsg(error.message ?? "Failed to load dashboard data.");
        setItems([]);
      } else {
        setItems(data ?? []);
      }

      setLoading(false);
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const anyOutdated = useMemo(
    () => (items || []).some((d: ComplianceItem) => Boolean(d.is_outdated)),
    [items]
  );

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {anyOutdated && (
          <span className="badge badge-warning text-sm">
            Some items are marked as Outdated
          </span>
        )}
      </header>

      {loading ? (
        <div className="animate-pulse text-gray-500">Loading…</div>
      ) : errorMsg ? (
        <div className="alert alert-error">
          <span>{errorMsg}</span>
        </div>
      ) : items.length === 0 ? (
        <div className="text-gray-500">No data found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="text-left">ID</th>
                <th className="text-left">Industry</th>
                <th className="text-left">Status</th>
                <th className="text-left">Updated</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id}>
                  <td className="align-top">{String(row.id)}</td>
                  <td className="align-top font-medium">
                    {humanize(row.industry || "")}
                  </td>
                  <td className="align-top">
                    {row.is_outdated ? (
                      <span className="badge badge-warning">Outdated</span>
                    ) : (
                      <span className="badge badge-success">Up to date</span>
                    )}
                  </td>
                  <td className="align-top">
                    {row.updated_at
                      ? new Date(row.updated_at).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}